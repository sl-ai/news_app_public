# Jest Unit Tests

This directory contains unit tests for the news app using Jest and React Testing Library.

## Test Files

- `NewsCard.test.tsx` - Tests for the NewsCard component
- `CategoryFilter.test.tsx` - Tests for the CategoryFilter component  
- `DatePicker.test.tsx` - Tests for the DatePicker component
- `newsApi.test.ts` - Tests for the newsApi service

## Running Unit Tests

### Available Commands

1. **Run all unit tests:**
   ```bash
   npm run test:unit
   ```

2. **Run unit tests in watch mode:**
   ```bash
   npm run test:unit:watch
   ```

3. **Run unit tests with coverage:**
   ```bash
   npm run test:unit:coverage
   ```

4. **Run specific test file:**
   ```bash
   npx jest NewsCard.test.tsx
   ```

5. **Run tests matching a pattern:**
   ```bash
   npx jest --testNamePattern="renders"
   ```

## Test Coverage

### Component Tests

**NewsCard.test.tsx:**
- Renders article information correctly (title, description, source, date)
- Displays image with correct alt text
- Renders "Read More" link with proper attributes
- Handles articles without image URLs
- Formats dates correctly

**CategoryFilter.test.tsx:**
- Renders all categories as buttons
- Highlights the selected category
- Calls onCategoryChange when categories are clicked
- Capitalizes category names correctly
- Updates selected category when props change
- Has correct accessibility attributes

**DatePicker.test.tsx:**
- Renders date picker with label
- Displays the selected date
- Calls onDateChange when date is changed
- Updates displayed date when props change
- Has correct date constraints
- Has proper accessibility attributes

### Service Tests

**newsApi.test.ts:**
- Fetches news from API when no valid cache exists
- Uses cached news when valid cache exists
- Uses expired cache when API call fails
- Returns empty array when no cache and API fails
- Uses different queries for different categories

## Test Structure

Each test file follows these patterns:
- Uses React Testing Library for component testing
- Mocks external dependencies (axios, fetch, etc.)
- Tests both success and error scenarios
- Verifies accessibility attributes
- Tests user interactions and state changes

## Configuration

The tests are configured in `jest.config.js` with:
- Next.js Jest configuration
- jsdom test environment
- Path mapping for `@/` imports
- Coverage thresholds (70% for all metrics)
- Setup file for global mocks and configurations

## Mocking Strategy

- **Next.js components**: Mocked Image component and router
- **External APIs**: Mocked axios and fetch
- **Firebase**: Mocked authentication functions
- **Environment variables**: Set test values in setup file

## Best Practices

1. **Test user behavior**: Focus on what users see and do
2. **Test accessibility**: Verify ARIA attributes and keyboard navigation
3. **Mock external dependencies**: Don't test third-party libraries
4. **Test error scenarios**: Ensure graceful error handling
5. **Use descriptive test names**: Make it clear what each test verifies
