import { test, expect } from '@playwright/test';
import { ADMIN } from './compte.js';

test('un admin voit son tableau de bord après connexion', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(ADMIN.email);
  await page.getByPlaceholder('••••••••').fill(ADMIN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page).toHaveURL('/admin/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

   await expect(page.getByText('Total Patients')).toBeVisible();

  // Laisse le temps à Recharts de mesurer son conteneur avant de dessiner le camembert
  // (sinon la légende apparaît mais pas les parts, un souci connu de cette librairie).
  await page.waitForTimeout(1800);

  await page.screenshot({ path: 'e2e/captures/dashboard-admin.png' });
});

test('un admin peut gérer les pharmacies (liste + filtre par statut)', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(ADMIN.email);
  await page.getByPlaceholder('••••••••').fill(ADMIN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/admin/dashboard');

  await page.goto('/admin/pharmacies');
  await expect(page.getByRole('heading', { name: 'Gestion Pharmacies' })).toBeVisible();

  // Par défaut, l'onglet "Certifiées" est actif : une vraie pharmacie active doit apparaître.
  await expect(page.getByText('Pharmacie Dalal Jaam')).toBeVisible();

  // Capture sur l'état par défaut — le plus représentatif pour le mémoire.
  await page.screenshot({ path: 'e2e/captures/admin-pharmacies.png' });

  // Vérification du filtre : la pharmacie certifiée doit disparaître sous "En attente".
  await page.getByRole('button', { name: 'En attente' }).click();
  await expect(page.getByText('Pharmacie Dalal Jaam')).not.toBeVisible();
});

test('un admin peut ajouter un livreur', async ({ page }) => {
  const email = `livreur.test.${Date.now()}@sospharma.test`;

  await page.goto('/login');
  await page.getByPlaceholder('votre@email.com').fill(ADMIN.email);
  await page.getByPlaceholder('••••••••').fill(ADMIN.motDePasse);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/admin/dashboard');

  await page.goto('/admin/livreurs');
  await expect(page.getByRole('heading', { name: 'Gestion Livreurs' })).toBeVisible();

  await page.getByRole('button', { name: 'Ajouter un livreur' }).click();

  await page.locator('input[name="prenom"]').fill('Moussa');
  await page.locator('input[name="nom"]').fill('Fall');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="telephone"]').fill('771112233');

  await page.getByRole('button', { name: 'Créer le livreur' }).click();

  // Le nouveau livreur apparaît dans le tableau, identifié par son email unique.
  await expect(page.getByText(email)).toBeVisible();

  await page.screenshot({ path: 'e2e/captures/admin-livreurs.png' });
});

