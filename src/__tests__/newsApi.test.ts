import { getTopNewsByCategory } from '@/services/newsApi'
import { NewsCategory } from '@/types'

// Mock axios
jest.mock('axios')
const mockAxios = require('axios')

// Mock databaseService
jest.mock('@/services/databaseService', () => ({
  getCachedNews: jest.fn(),
  cacheNews: jest.fn(),
  isCacheValid: jest.fn(),
  formatDate: jest.fn((date: Date) => date.toISOString().split('T')[0]),
}))

// Mock fetch
global.fetch = jest.fn()

describe('newsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock fetch for getNewsAPIKey
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ newsAPIKey: 'test-api-key' }),
    })
  })

  describe('getTopNewsByCategory', () => {
    it('should fetch news from API when no valid cache exists', async () => {
      const mockArticles = [
        {
          title: 'Test Article',
          description: 'Test Description',
          url: 'https://example.com',
          urlToImage: 'https://example.com/image.jpg',
          publishedAt: '2024-01-15T10:00:00Z',
          source: { id: 'test', name: 'Test Source' },
        },
      ]

      const mockResponse = {
        data: {
          articles: mockArticles,
        },
      }

      mockAxios.get.mockResolvedValue(mockResponse)

      // Mock cache functions
      const { getCachedNews, isCacheValid, cacheNews } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue(null)
      isCacheValid.mockReturnValue(false)

      const result = await getTopNewsByCategory('general' as NewsCategory)

      expect(result).toEqual(mockArticles)
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://newsapi.org/v2/everything',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'news',
            language: 'en',
            pageSize: 13,
            apiKey: 'test-api-key',
          }),
        })
      )
      expect(cacheNews).toHaveBeenCalled()
    })

    it('should use cached news when valid cache exists', async () => {
      const mockCachedArticles = [
        {
          title: 'Cached Article',
          description: 'Cached Description',
          url: 'https://example.com/cached',
          urlToImage: 'https://example.com/cached-image.jpg',
          publishedAt: '2024-01-15T10:00:00Z',
          source: { id: 'cached', name: 'Cached Source' },
        },
      ]

      // Mock cache functions
      const { getCachedNews, isCacheValid } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue({
        articles: mockCachedArticles,
        lastUpdated: new Date().toISOString(),
      })
      isCacheValid.mockReturnValue(true)

      const result = await getTopNewsByCategory('business' as NewsCategory)

      expect(result).toEqual(mockCachedArticles)
      expect(mockAxios.get).not.toHaveBeenCalled()
    })

    it('should use expired cache when API call fails', async () => {
      const mockExpiredArticles = [
        {
          title: 'Expired Article',
          description: 'Expired Description',
          url: 'https://example.com/expired',
          urlToImage: 'https://example.com/expired-image.jpg',
          publishedAt: '2024-01-15T10:00:00Z',
          source: { id: 'expired', name: 'Expired Source' },
        },
      ]

      // Mock cache functions
      const { getCachedNews, isCacheValid } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue({
        articles: mockExpiredArticles,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      })
      isCacheValid.mockReturnValue(false)

      // Mock API failure
      mockAxios.get.mockRejectedValue(new Error('API Error'))

      const result = await getTopNewsByCategory('technology' as NewsCategory)

      expect(result).toEqual(mockExpiredArticles)
    })

    it('should return empty array when no cache and API fails', async () => {
      // Mock cache functions
      const { getCachedNews } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue(null)

      // Mock API failure
      mockAxios.get.mockRejectedValue(new Error('API Error'))

      const result = await getTopNewsByCategory('sports' as NewsCategory)

      expect(result).toEqual([])
    })

    it('should use different query for non-general categories', async () => {
      mockAxios.get.mockResolvedValue({
        data: { articles: [] },
      })

      const { getCachedNews, isCacheValid } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue(null)
      isCacheValid.mockReturnValue(false)

      await getTopNewsByCategory('business' as NewsCategory)

      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://newsapi.org/v2/everything',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'business',
          }),
        })
      )
    })

    it('should use "news" query for general category', async () => {
      mockAxios.get.mockResolvedValue({
        data: { articles: [] },
      })

      const { getCachedNews, isCacheValid } = require('@/services/databaseService')
      getCachedNews.mockResolvedValue(null)
      isCacheValid.mockReturnValue(false)

      await getTopNewsByCategory('general' as NewsCategory)

      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://newsapi.org/v2/everything',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'news',
          }),
        })
      )
    })
  })
})
