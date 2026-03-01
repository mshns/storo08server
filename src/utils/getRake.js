import axios from 'axios';

const API_URL = process.env.API_URL;
const AFFILIATE_KEY = process.env.AFFILIATE_KEY;

export const getRake = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/hands`, {
      params: { date },
      headers: { 'X-Affiliate-Key': AFFILIATE_KEY },
    });

    const hands = response.data.data;

    const rake = hands
      .map((player) => {
        const totalRake = (player.rake || 0) + (player.fees || 0);
        if (totalRake <= 0) return null;
        return {
          username: player.username,
          points: Number(totalRake.toFixed(2)),
        };
      })
      .filter((player) => player !== null);

    return rake;
  } catch (error) {
    console.error(`❌ error: ${error.message}`);
    throw error;
  }
};
