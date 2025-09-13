# Daily Top News App

A dynamic news application that shows top news articles from different categories with Google authentication support. Built with ReactJS, NextJS on GCP.
![App Screenshot](https://github.com/sl-ai/news_app_public/raw/main/public/topNews.png)


## Features

- Display top 10 news articles from 5 different categories:
  - U.S.
  - Business
  - Technology
  - Sports
  - Health
- Google authentication for user login
- Save user preferences for news categories
- Responsive design
- Real-time category filtering
- **Secure configuration management using Google Secret Manager**

## Setup

### Option 1: Using Google Secret Manager (Recommended for Production)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Google Secret Manager:
   - Follow the instructions in [SECRET_MANAGER_SETUP.md](./SECRET_MANAGER_SETUP.md)
   - Create secrets for your Firebase configuration
   - Set the `GOOGLE_CLOUD_PROJECT` environment variable

4. Set up Google OAuth:
   - Go to the Google Cloud Console
   - Create a new project
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google (for development)
     - https://your-domain.com/api/auth/callback/google (for production)

5. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Store configuration in Google Secret Manager

6. Get a News API key:
   - Sign up at https://newsapi.org
   - Copy your API key to the `.env.local` file

7. Run the development server:
   ```bash
   npm run dev
   ```

### Option 2: Using Environment Variables (Development)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:

```env
# Google Cloud Project ID (required for Secret Manager)
GOOGLE_CLOUD_PROJECT=your_project_id

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000?date=2025-06-08&category=technology
NEXTAUTH_SECRET=your_nextauth_secret

# News API
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key

# Firebase (fallback for development)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Follow the same OAuth and Firebase setup steps as above

5. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security Features

- **Google Secret Manager Integration**: Firebase configuration is securely stored in Google Secret Manager
- **Environment Fallback**: Development mode automatically falls back to environment variables
- **No Hardcoded Secrets**: All sensitive configuration is externalized
- **IAM-based Access Control**: Secret access is controlled via Google Cloud IAM

## Testing & Automation

This project includes comprehensive testing and automation setup to ensure code quality and reliability.

### Testing Framework

#### Unit Tests (Jest + React Testing Library)
- **Location**: `src/__tests__/`
- **Coverage**: Components, services, and utilities
- **Test Files**:
  - `NewsCard.test.tsx` - News card component functionality
  - `CategoryFilter.test.tsx` - Category filtering logic
  - `DatePicker.test.tsx` - Date picker interactions
  - `newsApi.test.ts` - API service layer

**Running Unit Tests:**
```bash
# Run all unit tests
npm run test:unit

# Run with coverage report
npm run test:unit:coverage

# Watch mode for development
npm run test:unit:watch
```

#### End-to-End Tests (Playwright)
- **Location**: `tests/`
- **Coverage**: Full user workflows and browser compatibility
- **Test Files**:
  - `news-tiles.spec.ts` - News display and authentication flows

**Running E2E Tests:**
```bash
# Run all tests (headless)
npm test

# Interactive UI mode
npm run test:ui

# Run with browser visible
npm run test:headed
```

### Continuous Integration/Deployment

#### GitHub Actions Workflow
- **File**: `.github/workflows/playwright.yml`
- **Triggers**: Push/PR to main/master branches
- **Process**:
  1. Node.js 18 setup with npm caching
  2. Dependency installation
  3. Application build
  4. Unit test execution with coverage
  5. Test report artifact upload

#### Coverage Requirements
- **Minimum Thresholds**: 50% for branches, functions, lines, statements
- **Report Generation**: HTML and LCOV formats
- **Artifact Storage**: 10-day retention in GitHub Actions

#### Browser Compatibility
- **Supported Browsers**: Chrome, Firefox, Safari
- **Test Environment**: Ubuntu Latest (GitHub Actions)
- **Local Development**: Cross-platform support

### Quality Assurance

#### Code Quality Tools
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Type safety and compile-time checks
- **Prettier**: Code formatting (via ESLint integration)

#### Testing Best Practices
- **Unit Tests**: Focus on component behavior and service logic
- **E2E Tests**: Verify complete user workflows
- **Mocking Strategy**: External APIs and dependencies mocked
- **Accessibility**: ARIA attributes and keyboard navigation tested

#### Performance Monitoring
- **Build Optimization**: Next.js production builds
- **Bundle Analysis**: Automatic size monitoring
- **Test Performance**: Parallel test execution

### Development Workflow

#### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run all tests
npm run test:unit && npm test

# Build for production
npm run build
```

#### Pre-commit Checklist
1. Run unit tests: `npm run test:unit`
2. Run linting: `npm run lint`
3. Build application: `npm run build`
4. Run E2E tests: `npm test`

#### CI/CD Pipeline
- **Automatic Testing**: Every push and PR
- **Build Verification**: Ensures production readiness
- **Artifact Management**: Test reports and coverage data
- **Deployment Ready**: Passes all checks before merge

## Technologies Used

- React.js
- Next.js 15
- TypeScript
- Tailwind CSS
- Firebase
- NextAuth.js
- News API
- Google Secret Manager
- **Testing**: Jest, React Testing Library, Playwright
- **CI/CD**: GitHub Actions
- **Quality**: ESLint, TypeScript

## License

MIT
