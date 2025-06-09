export type NewsCategory = 'general' | 'business' | 'technology' | 'sports' | 'health';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface UserPreferences {
  userId: string;
  categories: NewsCategory[];
}

export interface NewsCache {
  articles: NewsArticle[];
  lastUpdated: Date;
  category: NewsCategory;
  date: string; // ISO date string
}

export interface DateRange {
  from: Date;
  to: Date;
} 