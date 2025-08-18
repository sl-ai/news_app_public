import axios from 'axios';
import { NewsArticle, NewsCategory } from '@/types';
import { getCachedNews, cacheNews, isCacheValid, formatDate } from './databaseService';

const BASE_URL = 'https://newsapi.org/v2';

// Function to get API key from environment or Secret Manager
async function getNewsAPIKey(): Promise<string> {
  // Check if we're in development mode and use environment variable as fallback
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && process.env.NEXT_PUBLIC_NEWS_API_KEY) {
    console.log('Using environment variable for News API key (development mode)');
    return process.env.NEXT_PUBLIC_NEWS_API_KEY;
  }

  try {
    // Try to fetch from API (which uses Secret Manager on server side)
    const response = await fetch('/api/config/firebase');
    if (!response.ok) {
      throw new Error('Failed to fetch config from API');
    }
    const config = await response.json();
    return config.newsAPIKey || '';
  } catch (error) {
    console.error('Failed to fetch News API key from API:', error);
    
    // Fallback to environment variable if API fails
    if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      console.log('Falling back to environment variable for News API key');
      return process.env.NEXT_PUBLIC_NEWS_API_KEY;
    }
    
    throw new Error('Unable to load News API key from API or environment variables');
  }
}

export async function getTopNewsByCategory(
  category: NewsCategory,
  urlDate?: string | null
): Promise<NewsArticle[]> {
  try {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1)
    const currentDateFormatted = formatDate(currentDate)
    const targetDate = urlDate || currentDateFormatted;

    // First, try to get news from cache using the URL date
    const cachedNews = await getCachedNews(category, targetDate);

    if (cachedNews && isCacheValid(cachedNews.lastUpdated)) {
      console.log(`Using cached news for category: ${category}, date: ${targetDate}`);
      return cachedNews.articles;
    }

    // If no valid cache with URL date, and no URL date was provided,
    // try getting today's cached news
    if (!urlDate && targetDate !== currentDateFormatted) {
      const todaysCachedNews = await getCachedNews(category, currentDateFormatted);
      if (todaysCachedNews && isCacheValid(todaysCachedNews.lastUpdated)) {
        console.log(`Using today's cached news for category: ${category}`);
        return todaysCachedNews.articles;
      }
    }

    // If cache is missing or invalid, fetch from API
    console.log(`Fetching fresh news for category: ${category}, date: ${targetDate}`);
    
    // Get API key
    const API_KEY = await getNewsAPIKey();
    
    // Convert date string to Date object for manipulation
    const selectedDate = new Date(targetDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59); // End of the selected day
    
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: category !== 'general' ? category : 'news',
        language: 'en',
        pageSize: 13,
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