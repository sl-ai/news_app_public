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
    
    // Convert date string to Date object for manipulation
    const selectedDate = new Date(date);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59); // End of the selected day
    
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: category !== 'general' ? category : 'news',
        language: 'en',
        pageSize: 12,
        apiKey: API_KEY,
        from: date,
        to: endDate.toISOString(),
        sortBy: 'relevancy'
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