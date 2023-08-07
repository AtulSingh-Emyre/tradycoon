export const phoneValidator = (phone: string): boolean => {
  if (phone.length == 10) return true;
  return false;
};

export const isNumericalValue = (num: number): boolean => {
  if (typeof num == 'number') return true;
  return false;
};

export const isStockName = (stockName: string): boolean => {
  if (stockName != undefined) return true;
  return false;
};

export const isComparator = (comparator: string): boolean => {
  if (comparator != undefined) return true;
  return false;
};

export const isPrice = (price: number): boolean => {
  if (price > 0) return true;
  return false;
};

export const isSell = (sell: boolean): boolean => {
  if (typeof sell == 'boolean') return true;
  return false;
};

export const isT = (T: Array<number>): boolean => {
  T.forEach((element) => {
    if (typeof element != 'number') return false;
  });
  return true;
};
