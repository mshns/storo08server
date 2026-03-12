import axios from 'axios';

const API_URL = process.env.API_URL;
const AFFILIATE_KEY = process.env.AFFILIATE_KEY;

const transformTournament = (item, tournamentType) => {
  const baseData = {
    username: item.username,
    tournament: item.tournament_name,
    buyin: item.buyin,
  };

  let type = 'sng';
  if (tournamentType === 'mtts') {
    type = 'mtt';
  } else if (item.tournament_name?.includes('Twister')) {
    type = 'twister';
  }

  return { ...baseData, type };
};

const fetchPage = async (tournamentType, date, page) => {
  try {
    const response = await axios.get(`${API_URL}/${tournamentType}`, {
      params: { date, page },
      headers: { 'X-Affiliate-Key': AFFILIATE_KEY },
    });

    const tournaments = response.data.data.map((item) =>
      transformTournament(item, tournamentType),
    );

    return {
      tournaments,
      totalPages: response.data.meta.total_pages,
      currentPage: page,
    };
  } catch (error) {
    console.error(`❌ error: ${error.message}`);
    throw error;
  }
};

const fetchAllPages = async (tournamentType, date) => {
  const firstPage = await fetchPage(tournamentType, date, 1);
  let allTournaments = [...firstPage.tournaments];
  const totalPages = firstPage.totalPages;

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    pagePromises.push(fetchPage(tournamentType, date, page));
  }

  const remainingPages = await Promise.all(pagePromises);

  remainingPages.forEach((page) => {
    allTournaments = [...allTournaments, ...page.tournaments];
  });

  return allTournaments;
};

export const getTournaments = async (date) => {
  try {
    const [sngTournaments, mttTournaments] = await Promise.all([
      fetchAllPages('sngs', date),
      fetchAllPages('mtts', date),
    ]);

    const allTournaments = [...sngTournaments, ...mttTournaments];

    return allTournaments;
  } catch (error) {
    console.error(`❌ error: ${error.message}`);
    throw error;
  }
};
