import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Port fixe : le backend redirige vers ce port après paiement PayTech
  // (voir FRONTEND_URL dans sospharma-backend/.env). Si le port est déjà pris,
  // on préfère une erreur explicite plutôt qu'un glissement silencieux vers 5174+.
  server: {
    port: 5173,
    strictPort: true,
  },
})
