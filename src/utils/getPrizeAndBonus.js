const PRIZES = [
  { max: 1, prize: 'T€750' },
  { max: 2, prize: 'T€600' },
  { max: 3, prize: 'T€400' },
  { max: 4, prize: 'T€350' },
  { max: 5, prize: 'T€250' },
  { max: 6, prize: 'T€200' },
  { max: 7, prize: 'T€150' },
  { max: 8, prize: 'T€140' },
  { max: 9, prize: 'T€130' },
  { max: 10, prize: 'T€120' },
  { max: 20, prize: 'T€85' },
  { max: 30, prize: 'T€60' },
  { max: 45, prize: 'T€40' },
  { max: 61, prize: 'T€25' },
  { max: 75, prize: 'T€15' },
  { max: 100, prize: 'T€10' },
];

const getPrize = (position) => {
  if (position < 1) return '';

  const rule = PRIZES.find((rule) => position <= rule.max);
  return rule ? rule.prize : '';
};

const getBonus = (points) => Math.floor(points / 10000000);

export const getPrizeAndBonus = (players) => {
  return players
    .sort((a, b) => b.points - a.points)
    .map((player, index) => {
      const position = index + 1; // ← добавляем position
      const bonus = getBonus(player.points);

      return {
        username: player.username,
        points: player.points,
        position, // ← ДОБАВЛЯЕМ position!
        prize: getPrize(position),
        bonus,
      };
    });
};
