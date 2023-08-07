import {Request, Response, NextFunction} from 'express';
import {getEnvironmentVariables} from '../environments/env';
import jwt from 'jsonwebtoken';
import {UserController} from './UserController';
import UserDetail, {ProfileStatus} from '../models/User/UserAuthDetails';
import * as nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const randomEmail = require('random-email');
const random_name = require('node-random-name');

enum errorMessages {
  STATUS_401 = 'invalid data provided, please try again',
  STATUS_501 = 'server error, please try again',
}

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
    user: getEnvironmentVariables().email,
    pass: getEnvironmentVariables().password,
  },
});
export const MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Tradycoon',
    link: 'https://play.google.com/store/apps/details?id=com.tradycoon.app',
    logo: 'https://firebasestorage.googleapis.com/v0/b/tradycoon-3fb5c.appspot.com/o/staticImage%2Flogo.png?alt=media&token=532465b1-d8e6-453e-9992-5ec27113a522',
  },
});

export class AuthController {
  static async userCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const n = parseInt(req.params.n);
      for (let index = 0; index < n; index++) {
        const user = new UserDetail({
          name: random_name(),
          work_mail: randomEmail(),
          phone: Math.floor(Math.random() * 9000000000) + 1000000000,
          roles: ['analyst'],
          avatar: 'https://picsum.photos/seed/picsum/200/300',
        });
        await user.save();

        const user2 = new UserDetail({
          name: random_name(),
          work_mail: randomEmail(),
          phone: Math.floor(Math.random() * 9000000000) + 1000000000,
          roles: ['trader'],
          avatar: 'https://picsum.photos/seed/picsum/200/300',
        });
        await user2.save();
      }
      res.json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  }

  static async otp(req: Request, res: Response, next: NextFunction) {
    try {
      const phone: string = req.body.phone;
      const user = await UserDetail.findOne({phone: phone.substring(3)});
      if (user) {
        return res.status(200).json({
          data: {
            exists: true,
          },
          success: true,
        });
      } else
        return res.status(200).json({
          data: {
            exists: false,
          },
          success: true,
        });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      let query;
      if (!req.body.user.uid) {
        throw new Error('The requested resource can’t be found');
      }

      if (req.body.user.phone) {
        query = {phone: req.body.user.phone};
      } else if (req.body.user.work_mail) {
        query = {
          work_mail: req.body.user.work_mail,
        };
      }
      const userDetails = await UserDetail.findOneAndUpdate(
        query,
        {updated_at: new Date()},
        {new: true},
      );

      if (!userDetails) {
        const userData = new UserDetail({
          ...req.body.user,
          profileStatus: ProfileStatus.NEW_USER,
        });
        const user = await userData.save();
        if (user) {
          const token = jwt.sign(
            {_id: user._id, name: user.name},
            getEnvironmentVariables().jwt_secret,
          );
          const userAuthData = {
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
            analystPostSignalCount: 0,
            followersCount: 0,
            followingCount: 0,
            traderSaveSignalCount: 0,
          };
          return res.status(200).json({
            data: {
              user: JSON.stringify(userAuthData),
              token,
            },
            success: true,
          });
        } else {
          throw new Error('User Not Found !');
        }
      } else {
        const userId = userDetails._id.toString();
        const user = await UserController.getUserDetailsById(userId);
        if (user) {
          const token = jwt.sign(
            {_id: user._id, name: user.name},
            getEnvironmentVariables().jwt_secret,
          );
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
          return res.status(200).json({
            data: {
              user: JSON.stringify(userAuthData),
              token,
            },
            success: true,
          });
        } else {
          return res.json({
            success: false,
            message: 'User not found !',
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async loginId(req: Request, res: Response, next: NextFunction) {
    try {
      const userinfo = req.body;
      const loginUserId: any = req.user;
      console.log(req.user);
      if (userinfo.id !== loginUserId._id) {
        return res.json({
          success: false,
          message: 'User not found !',
        });
      }
      const user = await UserController.getUserDetailsById(userinfo.id, loginUserId._id);
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
          business_name: user.business_name,
          profileStatus: user.profileStatus,
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

        return res.status(200).json({
          data: {
            user: JSON.stringify(userAuthData),
            token: userinfo.token,
          },
          success: true,
        });
      } else {
        return res.json({
          success: false,
          message: 'User not found !',
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async verifEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserDetail.findOne({work_mail: req.body.userMail});
      if (user) {
        return res.status(200).json({
          data: {
            exists: true,
            otp: 0,
          },
          success: true,
        });
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const response = {
          body: {
            intro:
              "Welcome to Tradycoon! We're very excited to have you on board. Your verification otp is: " +
              otp,
          },
        };
        const mail = MailGenerator.generate(response);
        const message = {
          from: getEnvironmentVariables().email,
          to: req.body.userMail,
          subject: 'Verification',
          html: mail,
        };
        await transporter.sendMail(message);
        return res.json({
          data: {
            exists: false,
            otp: otp,
          },
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async purge(req: Request, res: Response) {
    //purge all user data
    await UserDetail.deleteMany({});
    const user = await UserDetail.find({});
    res.json({
      user,
    });
  }
}
