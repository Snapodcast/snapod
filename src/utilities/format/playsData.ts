import { getDateNameByInterval } from './date';

export default function formatPlaysData(
  interval: number,
  data: { name: number; plays: number }[]
) {
  const newData: {
    Date: string;
    plays: number;
  }[] = [];
  for (let i = 0; i < data.length; i += 1) {
    newData[i] = {
      Date: getDateNameByInterval(data[i], interval),
      plays: data[i].plays,
    };
  }
  return newData.reverse();
}
