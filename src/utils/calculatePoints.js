const MULTIPLIER = {
  twister: 1,
  sng: 1.5,
  mtt: 5,
};

export const calculatePoints = (tournaments) => {
  const pointsMap = new Map();

  tournaments.forEach((tournament) => {
    const { username, buyin, type } = tournament;

    const buyinValue = parseFloat(buyin);

    if (buyinValue <= 0) return;

    const multiplier = MULTIPLIER[type] || 1;
    const points = Math.round(buyinValue * 100 * multiplier);

    pointsMap.set(username, (pointsMap.get(username) || 0) + points);
  });

  const result = Array.from(pointsMap, ([username, points]) => ({
    username,
    points,
  }));

  return result;
};
