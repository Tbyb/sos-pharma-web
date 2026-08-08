import { test, expect } from '@playwright/test';

test('inscription d\'un nouveau patient', async ({ page }) => {
  // Horodatage dans l'email : garantit un email jamais utilisé, à chaque exécution.
  const email = `patient.test.${Date.now()}@sospharma.test`;

  await page.goto('/register');

  await page.getByPlaceholder('Diallo').fill('TestNom');
  await page.getByPlaceholder('Aminata').fill('TestPrenom');
  await page.getByPlaceholder('votre@email.com').fill(email);
  await page.getByPlaceholder('77 123 45 67').fill('771234567');

  // Les deux champs de mot de passe ont le même placeholder (••••••••) :
  // .first() = "Mot de passe", .last() = "Confirmer le mot de passe".
  await page.getByPlaceholder('••••••••').first().fill('MotDePasse123');
  await page.getByPlaceholder('••••••••').last().fill('MotDePasse123');

  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  // On s'arrête à l'étape OTP : la suite nécessiterait d'accéder à la vraie boîte
  // mail pour récupérer le code, ce que le test n'a pas.
  await expect(page.getByText(`Un code à 6 chiffres a été envoyé à ${email}`)).toBeVisible();

  await page.screenshot({ path: 'e2e/captures/inscription-patient.png' });
});
