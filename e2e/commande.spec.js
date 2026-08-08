import { test, expect } from '@playwright/test';
import { PATIENT } from './compte.js';

test('un patient peut ajouter un médicament au panier et arriver sur la page de commande', async ({ page }) => {
  // Connexion
  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(PATIENT.email);
  await page.getByPlaceholder('••••••••').fill(PATIENT.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/');

  // Recherche et ouverture de la fiche médicament
  await page.goto('/medicaments');
  await page.getByPlaceholder('Rechercher un médicament (ex: Paracétamol, Amoxicilline...)').fill('Amoxicilline');
  await page.waitForLoadState('networkidle');
  await page.getByText('Amoxicilline 500mg').click();

  // Ajout au panier depuis le comparatif de prix (1ère pharmacie disponible)
  await page.getByRole('button', { name: 'Ajouter' }).first().click();

  // Vérification dans le panier
  await page.goto('/patient/panier');
  await expect(page.getByRole('heading', { name: 'Mon panier' })).toBeVisible();
  await expect(page.getByText('Amoxicilline 500mg')).toBeVisible();

  // Passage à la commande
  await page.getByRole('link', { name: 'Commander' }).click();
  await expect(page).toHaveURL('/patient/commander');
  await expect(page.getByRole('heading', { name: 'Passer commande' })).toBeVisible();

  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'e2e/captures/commande.png' });
});
