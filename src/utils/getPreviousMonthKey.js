export const getPreviousMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;

  return `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
};
