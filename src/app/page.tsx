'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NewsArticle, NewsCategory } from '@/types';
import { getTopNewsByCategory } from '@/services/newsApi';
import { formatDate } from '@/services/databaseService';
import NewsCard from '@/components/NewsCard';
import CategoryFilter from '@/components/CategoryFilter';
import DatePicker from '@/components/DatePicker';

const categories: NewsCategory[] = ['general', 'business', 'technology', 'sports', 'health'];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters or use defaults
  const urlDate = searchParams.get('date');
  const urlCategory = searchParams.get('category') as NewsCategory;
  
  const initialDate = urlDate && isValidDate(urlDate) ? urlDate : formatDate(new Date());
  const initialCategory = urlCategory && isValidCategory(urlCategory) ? urlCategory : 'general';
  
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(initialCategory);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to validate date string
  function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Function to validate category
  function isValidCategory(category: string): boolean {
    return categories.includes(category as NewsCategory);
  }

  // Update URL with both parameters
  const updateURL = (params: { date?: string; category?: string }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (params.date) {
      newParams.set('date', params.date);
    }
    if (params.category) {
      newParams.set('category', params.category);
    }
    
    router.push(`?${newParams.toString()}`);
  };

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    updateURL({ date: newDate });
  };

  // Handle category change
  const handleCategoryChange = (newCategory: NewsCategory) => {
    setSelectedCategory(newCategory);
    updateURL({ category: newCategory });
  };

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const articles = await getTopNewsByCategory(selectedCategory, searchParams.get('date'));
      setNews(articles);
      setLoading(false);
    }

    fetchNews();
  }, [selectedCategory, selectedDate, searchParams]);

  return (
    <main className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Daily Top News</h1>
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-white">Welcome, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
