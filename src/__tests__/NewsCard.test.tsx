import { render, screen } from '@testing-library/react'
import NewsCard from '@/components/NewsCard'
import { NewsArticle } from '@/types'

const mockArticle: NewsArticle = {
  title: 'Test News Article',
  description: 'This is a test news article description that should be displayed in the card.',
  url: 'https://example.com/test-article',
  urlToImage: 'https://example.com/test-image.jpg',
  publishedAt: '2024-01-15T10:30:00Z',
  source: {
    id: 'test-source',
    name: 'Test News Source'
  }
}

describe('NewsCard', () => {
  it('renders article information correctly', () => {
    render(<NewsCard article={mockArticle} />)
    
    // Check if title is rendered
    expect(screen.getByText('Test News Article')).toBeInTheDocument()
    
    // Check if description is rendered
    expect(screen.getByText('This is a test news article description that should be displayed in the card.')).toBeInTheDocument()
    
    // Check if source name is rendered
    expect(screen.getByText('Test News Source')).toBeInTheDocument()
    
    // Check if formatted date is rendered (2024-01-15)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    
    // Check if "Read More" link is rendered
    expect(screen.getByRole('link', { name: /read more about test news article/i })).toBeInTheDocument()
  })

  it('renders image with correct alt text', () => {
    render(<NewsCard article={mockArticle} />)
    
    const image = screen.getByAltText('Test News Article')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg')
  })

  it('renders "Read More" link with correct attributes', () => {
    render(<NewsCard article={mockArticle} />)
    
    const readMoreLink = screen.getByRole('link', { name: /read more about test news article/i })
    expect(readMoreLink).toHaveAttribute('href', 'https://example.com/test-article')
    expect(readMoreLink).toHaveAttribute('target', '_blank')
    expect(readMoreLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles article without image URL', () => {
    const articleWithoutImage: NewsArticle = {
      ...mockArticle,
      urlToImage: null
    }
    
    render(<NewsCard article={articleWithoutImage} />)
    
    const image = screen.getByAltText('Test News Article')
    expect(image).toBeInTheDocument()
    // Should use placeholder image when urlToImage is null
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))
  })

  it('handles article with empty image URL', () => {
    const articleWithEmptyImage: NewsArticle = {
      ...mockArticle,
      urlToImage: ''
    }
    
    render(<NewsCard article={articleWithEmptyImage} />)
    
    const image = screen.getByAltText('Test News Article')
    expect(image).toBeInTheDocument()
    // Should use placeholder image when urlToImage is empty
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))
  })

  it('formats date correctly', () => {
    const articleWithDifferentDate: NewsArticle = {
      ...mockArticle,
      publishedAt: '2024-12-25T15:45:30Z'
    }
    
    render(<NewsCard article={articleWithDifferentDate} />)
    
    // Should display only the date part (YYYY-MM-DD)
    expect(screen.getByText('2024-12-25')).toBeInTheDocument()
  })
})
