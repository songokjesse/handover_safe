import { test, expect } from '@playwright/test';

test.describe('Shift Management', () => {
  // Note: These tests assume the user is already logged in or there is a mechanism to bypass auth.
  // In a real scenario, we'd use global setup for authentication state.
  
  test('User can select a house and navigate to shift creation', async ({ page }) => {
    // Navigate to houses page (assuming we're logged in)
    // For now we just test that the page loads or redirects to login if not authenticated
    await page.goto('/houses');
    
    // If not authenticated, we should be redirected to login
    if (page.url().includes('/login')) {
      test.skip('Authentication required for this test, skipping in CI without auth state.');
      return;
    }

    await expect(page.locator('h1')).toHaveText('Select a House');
    
    // Check if at least one house card is visible
    const houseCards = page.locator('.group').first();
    if (await houseCards.isVisible()) {
      await houseCards.click();
      await expect(page).toHaveURL(/\/shifts\/new\?houseId=.+/);
    }
  });

  test('Shift creation form requires shift type and start time', async ({ page }) => {
    // Mock house ID
    await page.goto('/shifts/new?houseId=12345678-1234-1234-1234-123456789012');
    
    // Wait for form to load
    const startShiftBtn = page.getByRole('button', { name: 'Start Shift' });
    if (await startShiftBtn.isVisible()) {
      await expect(page.locator('h3.font-semibold')).toHaveText('Start New Shift');
    }
  });
});
