//获取随机数
export const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
//获取随机字符串
export const randomStr = (chars: string, length: number) => {
  let str: string = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * length));
  }
  return str;
};
