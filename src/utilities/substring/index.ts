export default function subString(str: string, n: number) {
  if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
    return str;
  }
  let len = 0;
  let tmpStr = '';
  for (let i = 0; i < str.length; i += 1) {
    if (/[\u4e00-\u9fa5]/.test(str[i])) {
      len += 2;
    } else {
      len += 1;
    }
    if (len > n) {
      break;
    } else {
      tmpStr += str[i];
    }
  }
  return `${tmpStr} ...`;
}
