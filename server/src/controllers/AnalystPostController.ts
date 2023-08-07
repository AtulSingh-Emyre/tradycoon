import {Request, Response, NextFunction} from 'express';
import {sendNotificationAll} from '../firebase/fcm';
import AnalystPostBuySell from '../models/Analyst/AnalystPostBuySell';
import SignalLike from '../models/Analyst/SignalLike';
import mongoose from 'mongoose';
import ClientUserLists from '../models/client/ClientUserLists';
import SignalArchive from '../models/Analyst/SignalArchive';
import {UserNotificationController} from './UserNotificationController';
import {IUserNotifications} from '../models/User/UserNotification';
import UserDetail from '../models/User/UserAuthDetails';

export class AnalystPostController {
  static async saveSignalPost(req: Request, res: Response, next: NextFunction) {
    try {
      const user: any = req.user;
      const post = req.body.post;
      const userDetails = await UserDetail.findById(user._id);
      if (!userDetails) {
        throw new Error('The requested User can’t be found');
      }

      const newPost = new AnalystPostBuySell({
        ...post,
        subscibeClient: post.subscibeClient,
        updated_at: Date.now(),
      });
      const saveSignalPost = await newPost.save();

      const sendNotificationAsync = async () => {
        const body = ` ${post.stockName} ${post.buy ? '🟢Buy' : '🔴Sell'} ${post.comparator} ₹${
          post.price
        } \nTarget-1 : ₹${post.T1} Target-2 : ₹${post.T2} SL : ₹${post.SL} \n 🔔 hurry up `;

        const title = `🔥 New signal created by ${userDetails.name} 🔥`;

        sendNotificationAll(title, body);

        const saveNotificationData: IUserNotifications = {
          sender: userDetails._id,
          message: `${title}\n${body}`,
          created_at: new Date(),
        };
        UserNotificationController.saveUserNotifications(saveNotificationData);
      };

      //prevent request from waiting for the notification to be sent
      if (post.isFree) {
        sendNotificationAsync().catch(console.error);
      }

      res.status(200).json({
        data: saveSignalPost,
        message: 'Signal Created Successfully',
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  static async patchSignalPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = req.body.updates;
      const postId = req.params.id;
      const user: any = req.user;
      const userDetails = await UserDetail.findById(user._id);
      if (!userDetails) {
        throw new Error('The requested User can’t be found');
      }
      const signalUpdate = await AnalystPostBuySell.findByIdAndUpdate(
        postId,
        {
          ...post,
          updated_at: Date.now(),
        },
        {new: true},
      );

      const sendNotificationActiveSignal = async () => {
        const body = `${post.stockName} ${post.buy ? '🟢Buy' : '🔴Sell'} ${post.comparator} ${
          post.price
        } \nTarget-1 : ₹${post.T1} Target-2 : ₹${post.T2} SL : ₹${post.SL} \n 🔔 hurry up `;
        const title = `🔥🤞 Signal updated by ${userDetails.name} 🤞🔥`;
        await sendNotificationAll(title, body);

        const saveNotificationData: IUserNotifications = {
          sender: userDetails._id,
          message: `${title}\n${body}`,
          created_at: new Date(),
        };
        UserNotificationController.saveUserNotifications(saveNotificationData);
        //AnalystPostController.getDeviceTokenByGroup(post.subscibeClient);
      };
      const sendNotificationCloseSignal = async () => {
        const body = `${post.stockName} ${post.buy ? '🟢Buy' : '🔴Sell'} ${post.comparator} ${
          post.price
        } \nTarget-1 : ₹${post.T1} Target-2 : ₹${post.T2} SL : ₹${post.SL} Achive : ${
          post.achievedPrice
        }%`;
        const title =
          post.achievedPrice >= 0
            ? `✌🏻🤑 Signal Close by ${userDetails.name} 🤑✌🏻`
            : `🤞 Signal Close by ${userDetails.name} 🤞`;

        await sendNotificationAll(title, body);

        const saveNotificationData: IUserNotifications = {
          sender: userDetails._id,
          message: `${title}\n${body}`,
          created_at: new Date(),
        };
        UserNotificationController.saveUserNotifications(saveNotificationData);
        //AnalystPostController.getDeviceTokenByGroup(post.subscibeClient);
      };
      // prevent request from waiting for the notification to be sent
      if (post.isFree && post.isActive) {
        sendNotificationActiveSignal().catch(console.error);
      }
      if (!post.isActive) {
        sendNotificationCloseSignal().catch(console.error);
      }

      res.json({
        success: true,
        data: signalUpdate,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSignalDetailsByQuary(req: Request, res: Response, next: NextFunction) {
    try {
      const isArchivePageOfAnalyst = req.body.user.isUser && req.body.options.archives;
      const isArchivePageOfTrader = !req.body.user.isUser && req.body.options.archives;
      const isArchivePageOfSelf =
        req.body.options.archives && req.body.user.id === req.body.user.userId;
      const isAnalystSignalPage = req.body.user.isUser && !req.body.options.archives;
      const isSignalViewPage = !req.body.user.isUser && !req.body.options.archives;
      // Time-period-wise filter : Query time : {isIntraday:boolean} | {}
      let queryTime: {isIntraday: boolean} | {} = {};
      if (req.body.time.isAll) {
        //do nothing
      } else if (!(req.body.time.isIntraday && req.body.time.isInterday)) {
        if (req.body.time.isIntraday) {
          queryTime = {...queryTime, isIntraday: true};
        } else if (req.body.time.isInterday) {
          queryTime = {...queryTime, isIntraday: false};
        } else {
          //do nothing
        }
      }

      let queryActive: {isActive: boolean} | {} = {};
      if (!req.body.time.isActive) {
        // deactive posts
        queryActive = {isActive: false};
      } else if (!req.body.time.isNotActive) {
        queryActive = {isActive: true};
      } else {
        // do nothing
      }

      const user = {
        userID: req.body.user.userId, // of current user(login user)
        Id: req.body.user.id, // of the profile view user
      };

      let queryObj = {};
      if (isAnalystSignalPage) {
        queryObj = {analyst: mongoose.Types.ObjectId(req.body.user.id), isActive: true};
      } else if (isArchivePageOfAnalyst) {
        queryObj = {
          $or: [
            {analyst: mongoose.Types.ObjectId(req.body.user.id), isFree: true},
            {isFree: false, isActive: false, analyst: mongoose.Types.ObjectId(req.body.user.id)},
          ],
        };
      } else if (isArchivePageOfSelf) {
        const clientSignalArchivesData = await SignalArchive.find(
          {user_id: user.userID},
          {_id: 0, signal_id: 1},
        ).distinct('signal_id');
        queryObj = {_id: {$in: clientSignalArchivesData}};
      } else if (isArchivePageOfTrader) {
        queryObj = {isActive: false};
      } else {
        const clientGroupData = await ClientUserLists.find(
          {user_id: user.userID},
          {_id: 0, group_id: 1},
        ).distinct('group_id');
        const paidClientGroupList = {subscibeClient: {$in: clientGroupData}};

        queryObj = {
          $or: [
            {...queryActive, ...queryTime, isFree: true},
            {
              ...queryActive,
              ...queryTime,
              ...paidClientGroupList,
            },
          ],
        };
      }

      const options = {
        skip: req.body.options.skip,
        limit: req.body.options.limit,
      };
      const result = await AnalystPostController.getSignalDetails(user, queryObj, options);
      // quary match
      // 1 profile Analyst own profile:  {analyst: ObjectId(60c49443255cf13ac71fd138)} loginid : req.users._id
      // 2 profile trader own profile :  {}
      // 1.1 profile Analyst profile from other user:   {isActive: false analyst: ObjectId(60c49443255cf13ac71fd138)} //loginid : req.users._id
      // 2.1 profile trader profile from other user :  {isActive: false}
      // 3 analyst post created view : {isActive: false analyst: ObjectId(60c49443255cf13ac71fd138)} // loginid : req.users._id
      // 4 signal view page :  {isActive: false}
      res.json({
        success: true,
        data: result,
        message: 'post data gained',
      });
    } catch (error) {
      next(error);
    }
  }

  private static async getSignalDetails(
    userID: {userID: ''; Id: ''}, //current user [ID requested user],[userID-login user]
    quarySignal: {}, //ex:{isActive: false, stockName: 'Test1'}
    options: {skip: 0; limit: 30}, //defult value set
  ) {
    const quary = quarySignal || {};
    const userId = mongoose.Types.ObjectId(userID.Id);
    const loginUserId = mongoose.Types.ObjectId(userID.userID);
    const skip = Number(options.skip);
    const limit = Number(options.limit);
    const signalData = await AnalystPostBuySell.aggregate([
      {$sort: {updated_at: -1}},
      {$match: quary},
      {$skip: skip},
      {$limit: limit},
      {
        $lookup: {
          from: 'signalarchives', //archives Logic
          let: {signal_id: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{$eq: ['$signal_id', '$$signal_id']}],
                },
              },
            },
            {
              $project: {
                _id: 0,
                total_archive: {$size: '$user_id'},
                isArchives: {
                  $cond: [{$ne: ['$user_id', []]}, {$in: [loginUserId, '$user_id']}, 0],
                },
              },
            },
          ],
          as: 'archives',
        },
      },
      {
        $lookup: {
          from: 'signallikes', //Like Logic
          let: {signal_id: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{$eq: ['$signal_id', '$$signal_id']}],
                },
              },
            },
            {
              $project: {
                _id: 0,
                total_like: {$size: '$user_id'},
                isLike: {
                  $cond: [{$ne: ['$user_id', []]}, {$in: [loginUserId, '$user_id']}, 0],
                },
              },
            },
          ],
          as: 'like',
        },
      },
      {
        $lookup: {
          from: 'userdetails',
          as: 'AnalystDetails',
          localField: 'analyst',
          foreignField: '_id',
        },
      },
      {$unwind: '$AnalystDetails'},
      {
        $project: {
          _id: 1,
          stockName: 1,
          price: 1,
          buy: 1,
          comparator: 1,
          T1: 1,
          T2: 1,
          T3: 1,
          SL: 1,
          description: 1,
          isIntraday: 1,
          validTill: 1,
          isFree: 1,
          isActive: 1,
          possibility: 1,
          subscibeClient: 1,
          achievedPrice: 1,
          achievedValue: 1,
          analyst: 1,
          analystName: '$AnalystDetails.name',
          isLike: {
            $cond: [{$ne: ['$like.isLike', []]}, {$arrayElemAt: ['$like.isLike', 0]}, false],
          },
          isArchives: {
            $cond: [
              {$ne: ['$archives.isArchives', []]},
              {$arrayElemAt: ['$archives.isArchives', 0]},
              false,
            ],
          },
          updated_at: 1,
          created_at: 1,
          likeCount: {$sum: '$like.total_like'},
          archiveCount: {$sum: '$archives.total_archive'},
        },
      },
    ]);
    console.log(signalData);
    console.log(signalData.length);
    return signalData;
  }
  // private static async getDeviceTokenByGroup(groupList: []) {
  //   console.log('groupList', groupList);
  //   const clientGroupData = await ClientUserLists.aggregate([
  //     //{$match: {group_id: {$elemMatch: {$in: ['$group_id', groupList]}}}},
  //     //{$match: {$in: ['$group_id', groupList]}},
  //     {$match: {group_id: {$in: groupList}}},

  //     {
  //       $project: {
  //         _id: 0,
  //         user_id: 1,
  //       },
  //     },
  //   ]);
  //   console.log('groupList groupList', clientGroupData);
  //   return groupList;
  //   //const clientGroupData = await ClientUserLists.aggregate([{$match: {author: 'dave'}}]);
  // }
  static async likeSignal(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.body.postId;
      const userId = req.body.userId;
      const like = req.body.like;
      const userSignalLike = await SignalLike.findOne({signal_id: postId});
      if (!userSignalLike) {
        const signalLikeFistTime = new SignalLike({
          signal_id: postId,
          user_id: userId,
        });
        await signalLikeFistTime.save();
      } else {
        const likeExist = userSignalLike.user_id.indexOf(userId);
        if (likeExist === -1 && like) {
          userSignalLike.user_id.push(userId);
        } else {
          userSignalLike.user_id.splice(likeExist, 1);
        }
        userSignalLike.save();
      }
      res.json({
        success: true,
        data: {},
        message: 'Signal Liked',
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSignal(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.body.postId;
      const analystPostBuySell = await AnalystPostBuySell.findByIdAndDelete(postId);
      if (analystPostBuySell) {
        const signalLike = await SignalLike.findOneAndDelete(postId);
        const signalArchive = await SignalArchive.findOneAndDelete(postId);
        res.json({
          success: true,
          data: {},
          message: 'Signal deleted',
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
