import { route } from '../../shared/route';
import scrapeAndRankPapers from '../scripts/scrape';

async function scrapePapers(request: any, h: any){
  const { date } = request.payload;

  scrapeAndRankPapers(date)
  
  return { message: 'Scraping started!' };
}

export default [
  route.post('/scrape', scrapePapers),
  // route.post('/generateContent', generateContent),
  // route.post('/generateVideo', generateVideo),
  // route.post('/uploadToYouTube', uploadToYouTube),
]
