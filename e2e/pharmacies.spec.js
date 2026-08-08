import { test, expect } from '@playwright/test';

test('rechercher et sélectionner une pharmacie sur la carte', async ({ page }) => {
  await page.goto('/pharmacies');

  await expect(page.getByText('Pharmacie Dalal Jaam')).toBeVisible();

  await page.getByText('Pharmacie Dalal Jaam').click();

  // La sélection se reflète dans l'URL, et le bouton d'itinéraire apparaît.
  await expect(page).toHaveURL(/\?id=\d+/);
  await expect(page.getByRole('button', { name: 'Obtenir l\'itinéraire' })).toBeVisible();

  await page.screenshot({ path: 'e2e/captures/pharmacies-carte.png' });
});
