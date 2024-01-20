import { describe, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App, { AppRoutes } from './App'
import { MemoryRouter } from 'react-router-dom'


describe('App', () => {
      it('renders without crashing', () => {
            render(<App />)
      })

      it('renders home page header text - Rolling', async () => {
            render(
                  <MemoryRouter initialEntries={['/']}>
                        <AppRoutes />
                  </MemoryRouter>
            )
            await waitFor(() => {
                  screen.getByRole('heading', { level: 1 })
            })
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rolling')
      })

      it('renders login page', async () => {
            render(
                  <MemoryRouter initialEntries={['/auth']}>
                        <AppRoutes />
                  </MemoryRouter>
            )
            await waitFor(() => {
                  screen.getByTestId('login-page')
            })
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
})
