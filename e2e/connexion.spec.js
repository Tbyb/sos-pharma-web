import { test, expect } from '@playwright/test';
import { PATIENT } from './compte.js';

test('un patient peut se connecter', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('votre@email.com').fill(PATIENT.email);
  await page.getByPlaceholder('••••••••').fill(PATIENT.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Après connexion, un patient est redirigé vers l'accueil.
  await expect(page).toHaveURL('/');

  // Capture nommée, pour le mémoire.
  await page.screenshot({ path: 'e2e/captures/connexion-patient.png' });
});

test('un mauvais mot de passe affiche une erreur en ligne', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('votre@email.com').fill(PATIENT.email);
  await page.getByPlaceholder('••••••••').fill('mauvaisMotDePasse123');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // L'erreur doit s'afficher en ligne (pas en toast), et on doit rester sur /login.
  await expect(page.getByText('Identifiants incorrects')).toBeVisible();
  await expect(page).toHaveURL('/login');

  await page.screenshot({ path: 'e2e/captures/connexion-echec.png' });
});
