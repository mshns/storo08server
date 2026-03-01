import express from 'express';
import 'dotenv/config';
import { routes } from './src/routes/index.js';
import {
  cronJobs,
  sendLeaderboard,
  sendLeaderboardReport,
} from './src/services/index.js';
import { connectDatabase, connectBot, noCORS } from './src/utils/index.js';

const app = express();

app.use(express.json());
app.use(noCORS);
app.use(express.static('public'));

routes.forEach((router) => app.use('/', router));

connectDatabase();

connectBot();

// cronJobs();

// await sendLeaderboard();

await sendLeaderboardReport();

const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`🟩 listening on => http://localhost:${PORT}`);
});
