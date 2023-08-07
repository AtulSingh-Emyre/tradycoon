import {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import ClientGroup from '../models/client/ClientGroups';
import UserDetail from '../models/User/UserAuthDetails';
import ClientUserLists from '../models/client/ClientUserLists';
import { ClientManagementErrors } from '../utilities/ClientManagementUtils';
export class ClientGroupController {
  static async groupDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.userId;
      const groupList = await ClientGroup.find(
        {
          analyst_UserId: userId,
        },
        {__v: 0, analyst_UserId: 0},
      );
      if (!groupList) {
        return res.status(200).json({
          data: [],
          success: true,
          count: 0,
        });

        // throw new Error('Group Does Not Exist');
      }
      res.status(200).json({
        data: groupList,
        success: true,
        count: groupList.length,
      });
    } catch (error) {
      next(error);
    }
  }
  static async clientDetailsByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.body.groupId;
      const skip = Number(req.body.skip);

      const userDetailsGroup = await ClientUserLists.find(
        {
          group_id: groupId,
        },
        {__v: 0},
      )
        .skip(skip)
        .limit(50)
        .populate({
          path: 'user_id',
          select: 'name work_mail phone avatar',
        })
        .exec();
      if (!userDetailsGroup) {

        return res.json({
          success: false,
          message: ClientManagementErrors.GET_CLIENT_DETAILS__GROUP_DOESNOT_EXISTS,
        });
      }
      res.status(200).json({
        data: (await userDetailsGroup) || [],
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  static async addGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupName = req.body.groupName;
      const userId = req.body.userId;
      const clientgroupdetails = await ClientGroup.findOne({
        groupName: groupName,
        analyst_UserId: userId,
      });
      if (!clientgroupdetails) {
        const newClientInGroup = new ClientGroup({
          analyst_UserId: userId,
          groupName: groupName,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newClientInGroup.save();
        res.status(200).json({
          data: newClientInGroup,
          message: 'Successful group added',
          success: true,
        });
      } else {
        return res.json({
          success: false,
          message: ClientManagementErrors.ADD_GROUP__GROUP_NAME_EXISTS,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  static async addClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientGroupId = req.body.groupId;
      const validTill = req.body.validTill;
      const user =
        req.body.email !== ''
          ? await UserDetail.findOne(
              {work_mail: req.body.email},
              {name: 1, work_mail: 1, phone: 1, avatar: 1},
            )
          : await UserDetail.findOne(
              {phone: req.body.phone},
              {name: 1, work_mail: 1, phone: 1, avatar: 1},
            );
      if (user) {
        const isUserExistClientGroup = await ClientUserLists.findOne({
          group_id: clientGroupId,
          user_id: user._id,
        });
        if (!isUserExistClientGroup) {
          const clientUserLists = new ClientUserLists({
            group_id: clientGroupId,
            user_id: user._id,
            created_at: new Date(),
            valid_at: validTill,
          });
          clientUserLists.save();

          res.status(200).json({
            data: {user, clientUserLists},
            message: 'Successful User added',
            success: true,
          });
        } else {
          return res.json({
            success: false,
            message: ClientManagementErrors.ADD_CLIENT_USER_ALREADY_EXISTS,
          });
          // throw new Error('User already exists in this group');
        }
      } else {
        return res.json({
          success: false,
          message: ClientManagementErrors.USER_NOT_FOUND,
        });
        // throw new Error('User not found');
      }
    } catch (error) {
      next(error);
    }
  }
  static async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = req.body.userId;
      const validTill = req.body.updatedUserDetails.valid_at;
      const isUserExistClientGroup = await ClientUserLists.findByIdAndUpdate(
        Id,
        {
          valid_at: validTill,
        },
        {new: true},
      );
      if (isUserExistClientGroup) {
        res.json({
          data: isUserExistClientGroup,
          message: 'Client Updated',
          success: true,
        });
      } else {

        return res.json({
          success: false,
          message: ClientManagementErrors.UPDATED,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async renameGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.userId;
      const groupId = req.body.Id;
      const groupName = req.body.groupName;
      const clientgroupdetails = await ClientGroup.findOne({
        _id: userId,
        groupName: groupName,
      });
      if (!clientgroupdetails) {
        const renameGroups = await ClientGroup.findByIdAndUpdate(
          groupId,
          {groupName: groupName},
          {new: true},
        );
        res.json({
          data: renameGroups,
          message: 'Group Updated',
          success: true,
        });
      } else {
        return res.json({
          success: false,
          message: ClientManagementErrors.ADD_GROUP__GROUP_NAME_EXISTS,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = req.body.Id;
      const deleteClientGroup = await ClientGroup.findByIdAndDelete(Id);
      if (deleteClientGroup) {
        const deleteClient = await ClientUserLists.deleteMany({group_id: Id});
        if (deleteClient) {
          res.json({
            data: {},
            message: 'Group with related clients deleted',
            success: true,
          });
        } else {
          res.json({
            data: {},
            message: 'Group deleted',
            success: true,
          });
        }
      } else {

        return res.json({
          success: false,
          message: ClientManagementErrors.DELETED,
        });

      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = req.body.Id;
      const deleteClient = await ClientUserLists.findByIdAndDelete(Id);
      if (deleteClient) {
        res.json({
          data: {},
          message: 'Client deleted',
          success: true,
        });
      } else {
        return res.json({
          success: false,
          message: ClientManagementErrors.DELETED,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async purge(req: Request, res: Response, next: NextFunction) {
    // await ClientGroup.deleteMany({});
    // await UserDetail.deleteMany({});
    // await AnalystPostBuySell.deleteMany({});
    // await ChatDetails.deleteMany({});
    res.json({
      success: true,
    });
  }
}
