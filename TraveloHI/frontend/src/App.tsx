import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './page/LoginPage'
import { useEffect, useState } from 'react'
import { dayTheme, nightTheme } from './assets/theme'
import { ThemeProvider } from '@emotion/react'

function App() {
  const [theme, setTheme] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? nightTheme : dayTheme)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? nightTheme : dayTheme)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </Router>
    </ThemeProvider>
    
  )
}

export default App
