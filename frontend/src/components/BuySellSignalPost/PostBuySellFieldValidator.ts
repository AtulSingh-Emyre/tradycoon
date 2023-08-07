export class PostBuySellFieldValidator {
  static entryIsEmpty = (data: string) => {
    if (data)
      if (data.length > 0) return false;
      else return true;
    else return true;
  };
}
