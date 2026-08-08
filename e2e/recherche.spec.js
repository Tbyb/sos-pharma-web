import { test, expect } from '@playwright/test';

test('rechercher un médicament filtre les résultats', async ({ page }) => {
  await page.goto('/medicaments');

  // État initial : plusieurs médicaments visibles, dont un qu'on va faire disparaître.
  await expect(page.getByText('Spasfon Lyoc')).toBeVisible();

  await page.getByPlaceholder('Rechercher un médicament (ex: Paracétamol, Amoxicilline...)').fill('Amoxicilline');

  // Après la recherche : le médicament recherché apparaît...
 await expect(page.getByText('Amoxicilline 500mg')).toBeVisible();
  await expect(page.getByText('Spasfon Lyoc')).not.toBeVisible();

  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'e2e/captures/recherche-medicament.png' });
});

test('la fiche médicament affiche le comparatif de prix par pharmacie', async ({ page }) => {
  await page.goto('/medicaments');

  await page.getByPlaceholder('Rechercher un médicament (ex: Paracétamol, Amoxicilline...)').fill('Amoxicilline');
  await page.waitForLoadState('networkidle');

  await page.getByText('Amoxicilline 500mg').click();

  // On doit arriver sur la fiche détail (URL /medicaments/{id})
  await expect(page).toHaveURL(/\/medicaments\/\d+/);
  await expect(page.getByRole('heading', { name: 'Amoxicilline 500mg' })).toBeVisible();

  // Le tableau comparatif doit lister au moins une vraie pharmacie
  await expect(page.getByText('Pharmacie Dalal Jaam')).toBeVisible();

  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'e2e/captures/fiche-medicament.png' });
});
