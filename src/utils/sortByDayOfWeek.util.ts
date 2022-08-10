const sortByDayOfWeek = (a: { day: number }, b: { day: number }, startDayDate: number) => {
  if (a.day === b.day) return 0;
  if (a.day >= startDayDate && b.day < startDayDate) return -1;
  if (a.day < startDayDate && b.day >= startDayDate) return 1;

  return a.day - b.day;
};

export { sortByDayOfWeek };
