export const removeBoss = (players) => {
  const boss = 'sanchess08';
  return players.filter((player) => player.username !== boss);
};
