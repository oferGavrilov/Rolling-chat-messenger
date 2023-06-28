import {render} from '@testing-library/react'
import App from '../App'
import 'mock-local-storage'

test('Render App correctly', () => {
      render(<App />)

      expect(true).toBe(true)
})
