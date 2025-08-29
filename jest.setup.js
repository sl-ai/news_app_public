import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Filter out Next.js specific props that cause warnings
    const { fill, priority, sizes, ...imgProps } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} />
  },
}))

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  getAuthInstance: jest.fn().mockResolvedValue({}),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-domain'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
