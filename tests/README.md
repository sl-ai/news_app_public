# Playwright Tests

This directory contains end-to-end tests for the news app using Playwright.

## Test Files

- `news-tiles.spec.ts` - Tests for news tile functionality and content structure

## Running Tests

### Prerequisites

Make sure you have the required dependencies installed:

```bash
npm install
```

### Available Commands

1. **Run all tests in headless mode:**
   ```bash
   npm test
   ```

2. **Run tests with UI mode (interactive):**
   ```bash
   npm run test:ui
   ```

3. **Run tests in headed mode (see browser):**
   ```bash
   npm run test:headed
   ```

4. **Run specific test file:**
   ```bash
   npx playwright test news-tiles.spec.ts
   ```

5. **Run tests in a specific browser:**
   ```bash
   npx playwright test --project=chromium
   ```

## Test Coverage

### News Tiles Tests

The `news-tiles.spec.ts` file contains tests that verify:

1. **Loading state handling** - Verifies that loading spinners appear and disappear appropriately
2. **News card structure** - Validates that each news card has the expected elements (title, description, image, read more link)
3. **Page structure verification** - Ensures the page displays correctly even when authentication is required

### Test Structure

Each test:
- Navigates to the home page
- Waits for content to load
- Verifies the presence and structure of news tiles
- Uses appropriate timeouts for network requests
- Handles authentication requirements gracefully

### Authentication Handling

The tests are designed to work with the app's authentication system:
- When authentication is required, tests verify that login messages and sign-in buttons are displayed
- When authenticated, tests verify that news content loads properly
- Tests gracefully handle both authenticated and unauthenticated states

## Configuration

The tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:3000`
- Automatic dev server startup
- Support for Chrome, Firefox, and Safari
- HTML reporter for test results

## GitHub Actions Integration

The tests are automatically run on:
- Push to main/master branch
- Pull requests to main/master branch

The GitHub Actions workflow:
- Sets up Node.js environment
- Installs dependencies and Playwright browsers
- Builds the application
- Runs all Playwright tests
- Uploads test reports as artifacts

## Debugging

If tests fail, you can:

1. **View test reports:**
   ```bash
   npx playwright show-report
   ```

2. **Debug with UI mode:**
   ```bash
   npm run test:ui
   ```

3. **Run in headed mode to see the browser:**
   ```bash
   npm run test:headed
   ```

4. **Generate traces for debugging:**
   ```bash
   npx playwright test --trace on
   ```

5. **Run specific test:**
   ```bash
   npx playwright test -g "should handle loading state properly"
   ``` 