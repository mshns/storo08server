export const getPreviousDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);

  const yesterday = now.toISOString().slice(0, 10);

  return yesterday;
};
