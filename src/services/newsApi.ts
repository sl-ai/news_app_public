import axios from 'axios';
import { NewsArticle, NewsCategory } from '@/types';
import { getCachedNews, cacheNews, isCacheValid, formatDate } from './databaseService';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function getTopNewsByCategory(
  category: NewsCategory,
  date: string = formatDate(new Date())
): Promise<NewsArticle[]> {
  try {
    // First, try to get news from cache
    const cachedNews = await getCachedNews(category, date);
    
    if (cachedNews && isCacheValid(cachedNews.lastUpdated)) {
      console.log(`Using cached news for category: ${category}, date: ${date}`);
      return cachedNews.articles;
    }

    // If cache is missing or invalid, fetch from API
    console.log(`Fetching fresh news for category: ${category}, date: ${date}`);
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: 'us',
        category: category.toLowerCase(),
        pageSize: 12,
        apiKey: API_KEY,
        // Note: Free NewsAPI plan doesn't support historical data
        // If you have a paid plan, uncomment the following line:
        // from: date,
        // to: date
      },
    });

    const articles = response.data.articles;

    // Cache the fresh news
    await cacheNews(category, date, articles);

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // If API call fails but we have cached news, return it regardless of age
    const cachedNews = await getCachedNews(category, date);
    if (cachedNews) {
      console.log(`Using expired cache for category: ${category}, date: ${date} due to API error`);
      return cachedNews.articles;
    }
    
    return [];
  }
} 