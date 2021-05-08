export const toDateString = (date: Date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const toWeekNumber = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const date1 = new Date(year, 0, 1);
  const date2 = new Date(year, month - 1, day, 1);
  const dayMS = 24 * 60 * 60 * 1000;
  const firstDay = (7 - date1.getDay()) * dayMS;
  const weekMS = 7 * dayMS;
  return Math.ceil((date2.getTime() - date1.getTime() - firstDay) / weekMS) + 1;
};

export const getDateNameByInterval = (item: any, interval: number): string => {
  if (interval === 86400000) {
    return toDateString(new Date(item.name));
  }

  if (interval === 86400000 * 7) {
    return `${new Date(item.name).getFullYear()} / Week ${toWeekNumber(
      new Date(item.name)
    )}`;
  }
  return `${new Date(item.name).getFullYear()}/${
    new Date(item.name).getMonth() + 1
  }`;
};
