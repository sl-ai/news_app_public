import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NewsArticle, NewsCategory, NewsCache } from '@/types';

const NEWS_COLLECTION = 'news_cache';

export async function getCachedNews(category: NewsCategory, date: string): Promise<NewsCache | null> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, `${category}_${date}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated.toDate(),
        date: data.date
      } as NewsCache;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached news:', error);
    return null;
  }
}

export async function cacheNews(category: NewsCategory, date: string, articles: NewsArticle[]): Promise<void> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, `${category}_${date}`);
    await setDoc(docRef, {
      articles,
      lastUpdated: Timestamp.now(),
      category,
      date
    });
  } catch (error) {
    console.error('Error caching news:', error);
  }
}

export function isCacheValid(lastUpdated: Date): boolean {
  const now = new Date();
  const cacheAge = now.getTime() - lastUpdated.getTime();
  // Cache is valid for 6 hours (21600000 milliseconds)
  return cacheAge < 21600000;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
} 