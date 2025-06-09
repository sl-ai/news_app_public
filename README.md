# Daily News App

A dynamic news application that shows top 10 news articles from different categories with Google authentication support.

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

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# News API
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

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
   - Copy the configuration values to your `.env.local` file

6. Get a News API key:
   - Sign up at https://newsapi.org
   - Copy your API key to the `.env.local` file

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase
- NextAuth.js
- News API

## License

MIT
