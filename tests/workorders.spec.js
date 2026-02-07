import { test, expect } from '@playwright/test';

test('workorders list loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Workorders' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Add Workorder' })).toBeVisible();
});
