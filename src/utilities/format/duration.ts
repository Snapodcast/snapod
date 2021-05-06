const pad = (num: number) => {
  const paddedString = `0${num}`;
  return paddedString.substring(paddedString.length - 2);
};

const toDurationString = (seconds: number) => {
  if (typeof seconds !== 'number') {
    return seconds;
  }
  const hh = Math.floor(seconds / (60 * 60));
  const remain = seconds % (60 * 60);
  const mm = Math.floor(remain / 60);
  const ss = Math.floor(remain % 60);
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
};

export default toDurationString;
