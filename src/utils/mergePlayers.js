export const mergePlayers = (existingPlayers, newPlayers) => {
  const playersMap = new Map();

  existingPlayers.forEach((player) => {
    playersMap.set(player.username, {
      username: player.username,
      points: player.points,
    });
  });

  newPlayers.forEach(({ username, points }) => {
    if (playersMap.has(username)) {
      const current = playersMap.get(username).points;
      const sum = current + points;
      playersMap.get(username).points = Number(sum.toFixed(2));
    } else {
      playersMap.set(username, { username, points: points });
    }
  });

  const result = Array.from(playersMap.values());

  return result.sort((a, b) => b.points - a.points);
};
