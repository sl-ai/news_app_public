import { test, expect } from '@playwright/test';

test.describe('News Tiles', () => {
  test('should handle loading state properly', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Check if loading spinner is shown initially
    const loadingSpinner = page.locator('.animate-spin');
    
    // The loading spinner should be visible initially
    await expect(loadingSpinner).toBeVisible({ timeout: 5000 });
    
    // Wait for loading to complete and news to appear
    await page.waitForSelector('.grid .bg-gray-900', { timeout: 15000 });
    
    // Loading spinner should no longer be visible
    await expect(loadingSpinner).not.toBeVisible();
  });

  test('should display news cards with proper content structure', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for news to load
    await page.waitForSelector('.grid .bg-gray-900', { timeout: 15000 });
    
    const newsCards = page.locator('.grid .bg-gray-900');
    
    // Get the first news card
    const firstCard = newsCards.first();
    
    // Verify the card has all the expected elements
    await expect(firstCard.locator('h3')).toBeVisible(); // Title
    await expect(firstCard.locator('p')).toBeVisible(); // Description
    await expect(firstCard.locator('img')).toBeVisible(); // Image
    await expect(firstCard.locator('a[href*="http"]')).toBeVisible(); // Read More link
    
    // Verify the card has source and date information
    await expect(firstCard.locator('.text-sm.text-gray-400')).toHaveCount(2); // Source and date
  });

  test('should display page structure even when authentication is required', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify the main page elements are present
    await expect(page.locator('h1:has-text("Daily Top News")')).toBeVisible();
    
    // Check for authentication elements
    const loginMessage = page.locator('text=Login required to view news content');
    const signInButton = page.locator('button:has-text("Sign in with Google")');
    
    // Either the login message should be visible, or the sign-in button should be present
    const hasLoginMessage = await loginMessage.isVisible();
    const hasSignInButton = await signInButton.isVisible();
    
    expect(hasLoginMessage || hasSignInButton).toBeTruthy();
  });
}); 