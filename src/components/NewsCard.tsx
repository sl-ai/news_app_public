import { NewsArticle } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const { title, description, url, urlToImage, publishedAt, source } = article;
  const formattedDate = new Date(publishedAt).toLocaleDateString();
  const [imageError, setImageError] = useState(false);

  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBpbWFnZSBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-800">
      <div className="relative h-48 w-full bg-gray-800">
        <Image
          src={imageError ? placeholderImage : (urlToImage || placeholderImage)}
          alt={title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{source.name}</span>
          <span className="text-sm text-gray-400">{formattedDate}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white line-clamp-2">{title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          aria-label={`Read more about ${title} (opens in new tab)`}
        >
          Read More →
        </a>
      </div>
    </div>
  );
} 