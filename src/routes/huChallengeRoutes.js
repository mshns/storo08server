import express from 'express';
import axios from 'axios';

const API_URL = process.env.API_URL;
const AFFILIATE_KEY = process.env.AFFILIATE_KEY;

const router = express.Router();

router.get('/hu-challenge', async (_, res) => {
  try {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    let targetDate = new Date(now);

    if (currentDay === 5 && currentHour < 21) {
      targetDate.setDate(targetDate.getDate() - 7);
    } else if (currentDay !== 5) {
      const daysToSubtract = (currentDay + (7 - 5)) % 7 || 7;
      targetDate.setDate(targetDate.getDate() - daysToSubtract);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    const response = await axios.get(`${API_URL}/mtts`, {
      params: { date },
      headers: { 'X-Affiliate-Key': AFFILIATE_KEY },
    });

    const players = response.data.data
      .filter(item => item.tournament_name === "Storo08 HU CHALLENGE Freeroll")
      .map(item => item.username)
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json(players);

  } catch (error) {
    console.error('❌ error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;