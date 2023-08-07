import {UserCompleteData} from '../models/user/UserProfile';
export class Validators {
  static emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    if (!email || email.length <= 0) return true;
    if (!re.test(email)) return true;
    return false;
  };
  static urlValidator = (email: string) => {
    const re =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (!email || email.length <= 0) return true;
    if (!re.test(email)) return true;

    return false;
  };
  static passwordValidator = (password: string) => {
    if (!password || password.length <= 0) return 'Password cannot be empty.';

    return '';
  };

  static namesValidator = (name: string) => {
    if (!name || name.length <= 0) return true;

    return false;
  };

  static descriptionValidator = (name: string) => {
    if (!name || name.length <= 0 || name.length > 500) return true;

    return false;
  };

  static userValidator = (user: UserCompleteData) => {
    if (
      Validators.namesValidator(user.name) ||
      Validators.emailValidator(user.work_mail) ||
      Validators.namesValidator(user.prof_pic)
    )
      return true;
    if (user.Analyst)
      if (Validators.namesValidator(user.experience)) return true;

    if (user.Analyst && user.business_account)
      if (
        Validators.namesValidator(user.business_name) ||
        Validators.urlValidator(user.website_url) ||
        Validators.descriptionValidator(user.description)
      )
        return true;
    return false;
  };

  static phoneValidator(phone: string) {
    if (phone.length === 10) return true;
    return false;
  }
}
