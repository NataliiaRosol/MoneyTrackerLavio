import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient, refreshAccessToken } from '@/shared/api'
import './index.css'
import App from './App.tsx'

// відновлюємо сесію з refresh cookie; якщо не вийшло — статус стане "guest"
refreshAccessToken().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
