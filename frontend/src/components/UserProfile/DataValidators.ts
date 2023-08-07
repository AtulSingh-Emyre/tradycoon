export class ProfileValidators {
  static async StringValidator(data: string) {
    if (data.length > 0) return true;
    return false;
  }
  static async PhoneValidator(data: string) {
    if (data.length == 10) return true;
    return false;
  }
  static async emailValidator(data: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(data);
  }
}
