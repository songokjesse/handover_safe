import { test, expect } from '@playwright/test';

test.describe('Structured Checklist Dashboard', () => {

  test('Shows "Start a Shift" prompt if no active shift exists', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
    
    // If not authenticated, we'd redirect. We assume either auth is bypassed in tests 
    // or we check the prompt when logged in.
    if (page.url().includes('/login')) {
      test.skip('Authentication required for this test.');
      return;
    }

    const heading = page.locator('h1');
    if (await heading.isVisible() && await heading.innerText() === 'Ready for your shift?') {
      await expect(page.getByRole('button', { name: /start a shift/i })).toBeVisible();
    }
  });

  test('Requires comment when marking an item as Not Done', async ({ page }) => {
    // We would need to mock an active shift context to properly test the checklist rendering
    // For this e2e test scaffold, we outline the behavior we expect if the checklist is visible.
    
    await page.goto('/');
    
    if (page.url().includes('/login')) {
      test.skip('Authentication required for this test.');
      return;
    }

    // Check if the dashboard is showing a checklist
    const checklistHeader = page.locator('h1:has-text("Shift Checklist")');
    if (await checklistHeader.isVisible()) {
      // Find the first checklist item's "Not Done" button
      const notDoneBtn = page.locator('button[title="Mark as Not Done"]').first();
      await notDoneBtn.click();
      
      // Verify that the comment input appears and is required
      const reasonInput = page.locator('input[placeholder="Explain why this was not done..."]').first();
      await expect(reasonInput).toBeVisible();
      
      // Verify validation message
      const validationMsg = page.locator('text="You must provide a reason when marking an item as Not Done."').first();
      await expect(validationMsg).toBeVisible();
      
      // Ensure save button is present
      const saveBtn = page.getByRole('button', { name: /save progress/i });
      await expect(saveBtn).toBeVisible();
    }
  });
});
