import { test, expect } from '@playwright/test';
import { PHARMACIEN } from './compte.js';

test('un pharmacien peut se connecter et accéder à son tableau de bord', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(PHARMACIEN.email);
  await page.getByPlaceholder('••••••••').fill(PHARMACIEN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();

   await expect(page).toHaveURL('/pharmacien/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // On attend une vraie statistique affichée, pas juste le titre de la page.
  await expect(page.getByText('Commandes en attente')).toBeVisible();

  await page.screenshot({ path: 'e2e/captures/dashboard-pharmacien.png' });
});

test('un pharmacien peut ajouter un nouveau médicament à son catalogue', async ({ page }) => {
  const suffixe = Date.now();
  const designation = `Vitamine C  Test${suffixe}`;
  const cip = `CIPTEST${suffixe}`;

  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(PHARMACIEN.email);
  await page.getByPlaceholder('••••••••').fill(PHARMACIEN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/pharmacien/dashboard');

  await page.goto('/pharmacien/catalogue');
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await page.getByRole('button', { name: 'Nouveau médicament' }).click();

  await page.locator('input[name="designation"]').fill(designation);
  await page.locator('input[name="CIP"]').fill(cip);
  await page.locator('input[name="prix_de_vente"]').fill('2000');
  await page.locator('input[name="quantite"]').fill('40');
  await page.locator('input[name="prix_unitaire"]').fill('2500');

  await page.getByRole('button', { name: 'Créer et ajouter au catalogue' }).click();

  await expect(page.getByText(designation)).toBeVisible();

  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'e2e/captures/ajout-catalogue.png' });
});

test('un pharmacien peut voir la liste de ses commandes', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(PHARMACIEN.email);
  await page.getByPlaceholder('••••••••').fill(PHARMACIEN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/pharmacien/dashboard');

  await page.goto('/pharmacien/commandes');
  await expect(page.getByRole('heading', { name: 'Mes Commandes' })).toBeVisible();

  // Des commandes en attente existent déjà pour ce compte de test.
  await expect(page.getByRole('button', { name: 'Accepter' }).first()).toBeVisible();

  await page.screenshot({ path: 'e2e/captures/commandes-pharmacien.png' });
});

