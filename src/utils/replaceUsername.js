import { Player } from '../models/index.js';

export const replaceUsername = async (usernamePlayers) => {
  const nicknames = await Player.find({});

  const nicknameMap = new Map();
  nicknames.forEach((player) => {
    nicknameMap.set(player.login, player.nickname);
  });

  const nicknamePlayers = usernamePlayers.map((player) => {
    const nickname = nicknameMap.get(player.username) || player.username;
    return {
      username: nickname,
      points: player.points,
    };
  });

  return nicknamePlayers;
};
