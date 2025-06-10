import axios from 'axios';
import { NewsArticle, NewsCategory } from '@/types';
import { getCachedNews, cacheNews, isCacheValid, formatDate } from './databaseService';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function getTopNewsByCategory(
  category: NewsCategory,
  urlDate?: string | null
): Promise<NewsArticle[]> {
  try {
    const currentDate = formatDate(new Date());
    const targetDate = urlDate || currentDate;

    // First, try to get news from cache using the URL date
    const cachedNews = await getCachedNews(category, targetDate);

    if (cachedNews && isCacheValid(cachedNews.lastUpdated)) {
      console.log(`Using cached news for category: ${category}, date: ${targetDate}`);
      return cachedNews.articles;
    }

    // If no valid cache with URL date, and no URL date was provided,
    // try getting today's cached news
    if (!urlDate && targetDate !== currentDate) {
      const todaysCachedNews = await getCachedNews(category, currentDate);
      if (todaysCachedNews && isCacheValid(todaysCachedNews.lastUpdated)) {
        console.log(`Using today's cached news for category: ${category}`);
        return todaysCachedNews.articles;
      }
    }

    // If cache is missing or invalid, fetch from API
    console.log(`Fetching fresh news for category: ${category}, date: ${targetDate}`);
    
    // Convert date string to Date object for manipulation
    const selectedDate = new Date(targetDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59); // End of the selected day
    
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: category !== 'general' ? category : 'news',
        language: 'en',
        pageSize: 12,
        apiKey: API_KEY,
        from: targetDate,
        to: endDate.toISOString(),
        sortBy: 'relevancy'
      },
    });

    const articles = response.data.articles;

    // Cache the fresh news
    await cacheNews(category, targetDate, articles);

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // If API call fails but we have cached news, return it regardless of age
    const cachedNews = await getCachedNews(category, urlDate || formatDate(new Date()));
    if (cachedNews) {
      console.log(`Using expired cache for category: ${category} due to API error`);
      return cachedNews.articles;
    }
    
    return [];
  }
} 