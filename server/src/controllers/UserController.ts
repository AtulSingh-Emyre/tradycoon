import {Request, Response, NextFunction} from 'express';
import UserDetail from '../models/User/UserAuthDetails';
import User from '../models/User/UserAuthDetails';
import AnalystPostBuySell from '../models/Analyst/AnalystPostBuySell';
import {UserRoles} from '../models/User/UserAuthDetails';
import SignalArchive from '../models/Analyst/SignalArchive';
import {getEnvironmentVariables} from '../environments/env';
import {MailGenerator, transporter} from './AuthController';
import Userfollowers from '../models/User/Userfollowers';
import ClientUserLists from '../models/client/ClientUserLists';
import mongoose from 'mongoose';
import DeviceInformation from '../models/User/DeviceInfo';
import {NotificationTopic, sendNotification, subscribeToTopic} from '../firebase/fcm';

export class UserController {
  static async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const loginUserId: any = req.user;
      const userDetails = await UserController.getUserDetailsById(id, loginUserId._id);
      if (userDetails) {
        res.status(200).json({
          data: userDetails,
          success: true,
        });
      } else {
        return res.json({
          success: false,
          message: 'User not found !',
        });
        //  throw new Error('User Not Found !');
      }
    } catch (error) {
      next(error);
    }
  }

  static async getUserDetailsById(userId: string, loginUserId?: string) {
    const id = userId;
    const isMaskFiled = !(userId == loginUserId ? true : loginUserId ? false : true);
    const user = await UserDetail.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'userfollowers',
          pipeline: [
            {
              $facet: {
                total_followers: [
                  {$match: {follower_id: {$exists: true, $in: [mongoose.Types.ObjectId(id)]}}},
                  {$count: 'total'},
                ],
                isfollowing: [
                  {
                    $match: {
                      $and: [
                        {user_id: {$exists: true, $eq: mongoose.Types.ObjectId(loginUserId)}},
                        {
                          follower_id: {
                            $exists: true,
                            $in: [mongoose.Types.ObjectId(id)],
                          },
                        },
                      ],
                    },
                  },
                  {$count: 'total'},
                ],
                total_following: [
                  {$match: {user_id: {$exists: true, $eq: mongoose.Types.ObjectId(id)}}},
                  {
                    $project: {
                      _id: 0,
                      total: {$size: '$follower_id'},
                    },
                  },
                ],
              },
            },
            {
              $project: {
                total_followers: {
                  $cond: [
                    {$ne: ['$total_followers.total', []]},
                    {$arrayElemAt: ['$total_followers.total', 0]},
                    0,
                  ],
                },
                total_following: {
                  $cond: [
                    {$ne: ['$total_following.total', []]},
                    {$arrayElemAt: ['$total_following.total', 0]},
                    0,
                  ],
                },
                isfollowing: {
                  $cond: [
                    {$ne: ['$isfollowing.total', []]},
                    {$arrayElemAt: ['$isfollowing.total', 0]},
                    0,
                  ],
                },
                total_following1: '$total_following1.total',
              },
            },
          ],
          as: 'followingFollower',
        },
      },
      {
        $lookup: {
          from: 'analystpostbuysellsignals',
          let: {user_id: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {$eq: ['$analyst', '$$user_id']},
              },
            },
            {
              $count: 'total_AnalystSignal',
            },
          ],
          as: 'AnalystSignalCount',
        },
      },
      {
        $lookup: {
          from: 'signalarchives',
          let: {user_id: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {$in: [mongoose.Types.ObjectId(id), '$user_id']},
              },
            },
            {
              $count: 'total_signalarchives',
            },
          ],
          as: 'signalarchives',
        },
      },
      {
        $project: {
          name: 1,
          work_mail: {
            $cond: [
              {$and: [{$ne: ['$work_mail', '']}, isMaskFiled]},
              {
                $concat: [
                  {$substrCP: ['$work_mail', 0, 2]},
                  '********',
                  {$substr: ['$work_mail', {$add: [{$strLenCP: '$work_mail'}, -11]}, 11]},
                ],
              },
              '$work_mail',
            ],
          },
          roles: 1,
          phone: {
            $cond: [
              {$and: [{$ne: ['$phone', '']}, isMaskFiled]},
              {$concat: [{$substrCP: ['$phone', 0, 2]}, '******', {$substrCP: ['$phone', 8, 2]}]},
              '$phone',
            ],
          },
          sebiReg_No: 1,
          business_name: 1,
          profileStatus: 1,
          business_account: 1,
          website_url: 1,
          description: 1,
          experience: 1,
          DOB: 1,
          interests: 1,
          avatar: 1,
          created_at: 1,
          analystPostSignalCount: {
            $cond: [
              {$ne: ['$AnalystSignalCount.total_AnalystSignal', []]},
              {$arrayElemAt: ['$AnalystSignalCount.total_AnalystSignal', 0]},
              0,
            ],
          },
          traderSaveSignalCount: {
            $cond: [
              {$ne: ['$signalarchives.total_signalarchives', []]},
              {$arrayElemAt: ['$signalarchives.total_signalarchives', 0]},
              0,
            ],
          },
          followersCount: {$arrayElemAt: ['$followingFollower.total_followers', 0]},
          followingCount: {$arrayElemAt: ['$followingFollower.total_following', 0]},
          isFollowing: {$toBool: {$arrayElemAt: ['$followingFollower.isfollowing', 0]}},
        },
      },
    ]);
    return user ? user[0] : [];
  }

  static async postSupportQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const userDetails = await UserDetail.findById(req.body.userId).select({
        _id: 1,
        name: 1,
        phone: 1,
        work_mail: 1,
      });
      const q = req.body.mssg;
      const response = {
        body: {
          name: userDetails?.name ? userDetails.name : userDetails?._id,
          intro: q,
          outro:
            ' mail id of user: ' +
            userDetails?.work_mail +
            ' \n phone number of user: ' +
            userDetails?.phone +
            '\n id of user: ' +
            userDetails?._id,
        },
      };
      const mail = MailGenerator.generate(response);
      const message = {
        from: getEnvironmentVariables().email,
        to: getEnvironmentVariables().email,
        subject: 'support query',
        html: mail,
      };
      const result = await transporter.sendMail(message);
      res.status(200).json({
        success: true,
        data: {},
        message: 'user details updated',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProfile = await User.findByIdAndUpdate(
        req.body.id,
        {
          ...req.body.userData,
          updated_at: new Date(),
        },
        {new: true},
      );

      if (updatedProfile) {
        const user = await UserController.getUserDetailsById(updatedProfile._id);
        if (user) {
          const userAuthData: any = {
            id: user._id,
            uid: user.uid,
            name: user.name,
            phone: user.phone,
            role: user.roles,
            experience: user.experience,
            business_account: user.business_account,
            avatar: user.avatar,
            work_mail: user.work_mail,
            profileStatus: user.profileStatus,
            business_name: user.business_name,
            description: user.description,
            website_url: user.website_url,
            DOB: user.DOB,
            interests: user.interests,
            isActive: user.isActive,
            sebiReg_No: user.sebiReg_No,
            analystPostSignalCount: user.analystPostSignalCount,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            traderSaveSignalCount: user.traderSaveSignalCount,
          };
          res.status(200).json({
            success: true,
            data: userAuthData,
            message: 'user details updated',
          });
        } else {
          res.status(200).json({
            success: true,
            data: [],
            message: 'user details not found',
          });
        }
      } else {
        res.status(200).json({
          success: false,
          data: [],
          message: 'user details not updated',
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await User.deleteMany({id: req.body.phone});
      res.json({
        status: 'ok',
        data: {},
        message: 'user data delted',
        error: 'user data failed to be deleted',
      });
    } catch (err) {
      next(err);
    }
  }
  static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await UserDetail.find({
        roles: [UserRoles.ANALYST],
      })
        .skip(parseInt(req.params.skip))
        .limit(20)
        .select({
          _id: 1,
          name: 1,
          work_mail: 1,
          phone: 1,
          avatar: 1,
          isActive: 1,
          roles: 1,
          created_at: 1,
        });

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (err) {
      next(err);
    }
  }
  static async addArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.body.postId;
      const userId = req.body.userId;
      const archive = req.body.archive;
      const userarchive = await SignalArchive.findOne({signal_id: postId});
      if (!userarchive) {
        const signalArchiveFistTime = new SignalArchive({
          signal_id: postId,
          user_id: userId,
        });
        await signalArchiveFistTime.save();
      } else {
        const archiveExist = userarchive.user_id.indexOf(userId);
        if (archiveExist === -1 && archive) {
          userarchive.user_id.push(userId);
        } else {
          userarchive.user_id.splice(archiveExist, 1);
        }
        userarchive.save();
      }
      res.json({
        success: true,
        data: {},
        message: 'Signal Archived',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id.split('@')[0];
      const skip = req.params.id.split('@')[1];
      const userFollowers = await Userfollowers.find(
        {follower_id: {$in: [userId]}},
        {_id: 0, user_id: 1},
      )
        .skip(parseInt(skip))
        .limit(20)
        .populate({
          path: 'user_id',
          select: {
            name: 1,
            work_mail: {
              $cond: [
                {$ne: ['$work_mail', '']},
                {
                  $concat: [
                    {$substrCP: ['$work_mail', 0, 2]},
                    '********',
                    {$substr: ['$work_mail', {$add: [{$strLenCP: '$work_mail'}, -11]}, 11]},
                  ],
                },
                '$work_mail',
              ],
            },
            phone: {
              $cond: [
                {$ne: ['$phone', '']},
                {$concat: [{$substrCP: ['$phone', 0, 2]}, '******', {$substrCP: ['$phone', 8, 2]}]},
                '$phone',
              ],
            },
            avatar: 1,
            roles: 1,
            created_at: 1,
            updated_at: 1,
          },
        })
        .exec();

      const followers = await userFollowers.map((users) => users.user_id);
      res.json({
        success: true,
        data: followers,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id.split('@')[0];
      const skip = req.params.id.split('@')[1];
      const userFollowers = await Userfollowers.findOne(
        {user_id: userId},
        {_id: 0, user_id: 0, __v: 0},
      )
        .skip(parseInt(skip))
        .limit(20)
        .populate({
          path: 'follower_id',
          select: {
            name: 1,
            work_mail: {
              $cond: [
                {$ne: ['$work_mail', '']},
                {
                  $concat: [
                    {$substrCP: ['$work_mail', 0, 2]},
                    '********',
                    {$substr: ['$work_mail', {$add: [{$strLenCP: '$work_mail'}, -11]}, 11]},
                  ],
                },
                '$work_mail',
              ],
            },
            phone: {
              $cond: [
                {$ne: ['$phone', '']},
                {$concat: [{$substrCP: ['$phone', 0, 2]}, '******', {$substrCP: ['$phone', 8, 2]}]},
                '$phone',
              ],
            },
            avatar: 1,
            roles: 1,
            created_at: 1,
            updated_at: 1,
          },
        })
        .exec();
      res.json({
        success: true,
        data: userFollowers?.follower_id || [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      // user is following followUser
      const userId = req.body.userId;
      const followerId: string = req.body.followerId;
      const addFollower = req.body.addfollower;

      const userfollowers = await Userfollowers.findOne({user_id: userId});
      if (!userfollowers) {
        const userDetail = await UserDetail.findOne({_id: userId});
        if (userDetail) {
          const newUserfollowers = new Userfollowers({
            user_id: userId,
            follower_id: followerId,
          });
          await newUserfollowers.save();
        }
      } else {
        const followersExist = userfollowers.follower_id.indexOf(followerId);
        if (followersExist == -1 && addFollower) {
          userfollowers.follower_id.push(followerId);
        } else {
          userfollowers.follower_id.splice(followersExist, 1);
        }
        userfollowers.save();
      }
      res.json({
        success: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubscribeClientGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const subscribeClientGroup = await ClientUserLists.find(
        {user_id: userId},
        {_id: 0, __v: 0, user_id: 0},
      )
        .populate({
          path: 'group_id',
          select: '-_id groupName analyst_UserId',
          populate: {
            path: 'analyst_UserId',
            select: '-_id name work_mail phone avatar',
          },
        })
        .exec();
      res.json({
        success: true,
        data: subscribeClientGroup || [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async SaveDeviceInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.userId;
      const token = req.body.deviceToken;
      if (userId && token) {
        const userDeviceInfo = await DeviceInformation.findOneAndUpdate(
          {user_id: userId},
          {device_Token: token},
          {new: true},
        );
        if (!userDeviceInfo) {
          const deviceInfo = new DeviceInformation({
            device_Token: token,
            user_id: userId,
          });
          await deviceInfo.save();
        }
        res.json({
          success: true,
          data: {},
          message: 'Device Information Save',
        });
        await subscribeToTopic(token, NotificationTopic.FREE_SIGNAL);
        sendNotification([token], 'Welcome to Tradycoon !');
      } else {
        res.json({
          success: false,
          data: {},
          message: 'Device Information not Save',
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // User Report Controller options
  static async analystSignalReport(req: Request, res: Response, next: NextFunction) {
    try {
      const analystId = mongoose.Types.ObjectId(req.body.userId);
      const timeframe = req.body.timeframe;

      const signalData = await AnalystPostBuySell.aggregate([
        {$match: {analyst: analystId}},
        {
          $facet: {
            TotalSignal: [{$match: {_id: {$exists: true}}}, {$count: 'Total'}],
            FreeSignal: [{$match: {isFree: {$exists: true, $eq: true}}}, {$count: 'Total'}],
            PaidSignal: [{$match: {isFree: {$exists: true, $eq: false}}}, {$count: 'Total'}],
            ActiveSignal: [{$match: {isActive: {$exists: true, $eq: true}}}, {$count: 'Total'}],
            DeactivateSignal: [
              {$match: {isActive: {$exists: true, $eq: false}}},
              {$count: 'Total'},
            ],
            // TotalReturn: [{$match: {achievedPrice: {$exists: true}}}, {$sum: '$achievedPrice'}],
          },
        },
        {
          $project: {
            totalSignal: {$arrayElemAt: ['$TotalSignal.Total', 0]},
            freeSignal: {$arrayElemAt: ['$FreeSignal.Total', 0]},
            paidSignal: {$arrayElemAt: ['$PaidSignal.Total', 0]},
            activeSignal: {$arrayElemAt: ['$ActiveSignal.Total', 0]},
            deactivateSignal: {$arrayElemAt: ['$DeactivateSignal.Total', 0]},
            // TotalReturn: '$TotalReturn',
          },
        },
      ]);
      // res.status(200).json({
      //   success: true,
      //   data: {
      //     totalPost: total,
      //     free: freePosts,
      //     paid: paidPost,
      //     totalPoint: point,
      //     pointPer: pointPer / isAchieved,
      //     positiveSignal: isAchieved,
      //     negativeSignal: negativeSignal,
      //   },
      // });
      res.status(200).json({
        success: true,
        data: signalData ? signalData[0] : [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async purgeData(req: Request, res: Response, next: NextFunction) {
    try {
      await User.deleteMany({});
      res.json({
        status: 'ok',
        data: {},
        message: 'all user data delted',
        error: 'user data failed to be deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}
