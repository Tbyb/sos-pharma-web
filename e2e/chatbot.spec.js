import { test, expect } from '@playwright/test';

test('poser une question au chatbot affiche une réponse', async ({ page }) => {
  await page.goto('/');

  await page.getByTitle('Assistant SOS-Pharma').click();
  await page.getByRole('button', { name: 'Comment comparer les prix d\'un médicament ?' }).click();

  // La question posée apparaît dans l'historique.
  await expect(page.getByText('Comment comparer les prix d\'un médicament ?')).toBeVisible();

  // L'indicateur de saisie doit apparaître, puis disparaître une fois la vraie réponse
  // de Groq arrivée (appel réel à l'API, jusqu'à 15s de marge).
  await expect(page.getByText('En train d\'écrire…')).toBeVisible();
  await expect(page.getByText('En train d\'écrire…')).not.toBeVisible({ timeout: 15000 });

  await page.screenshot({ path: 'e2e/captures/chatbot.png' });
});
