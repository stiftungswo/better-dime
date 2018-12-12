// tslint:disable-next-line:no-any
export const empty = (value: any) => {
  if (!value) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }
  return false;
};

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
