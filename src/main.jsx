import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import { validateGraduationProfiles } from './data/graduationDegreeConfig.js'

// Shown once per browser session so the splash never replays during
// normal client-side navigation between pages.
const SPLASH_SEEN_KEY = 'navora-splash-seen-v1'
// Hard safety net: the splash can never block access to the website.
const SPLASH_SAFETY_MS = 3500

function AppWithSplash() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_SEEN_KEY)
    } catch {
      return true
    }
  })

  useEffect(() => {
    // Already shown in this session — do not flash the splash at all.
    try {
      if (sessionStorage.getItem(SPLASH_SEEN_KEY)) {
        setShowSplash(false)
        return
      }
    } catch {}

    // Never prevent access to the website, even if the animation fails.
    const safetyTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
      } catch {}
      setShowSplash(false)
    }, SPLASH_SAFETY_MS)

    return () => clearTimeout(safetyTimer)
  }, [])

  const handleSplashFinish = () => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {}
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <App />
    </>
  )
}

if (import.meta.env.DEV) {
  const problems = validateGraduationProfiles()
  if (problems.length > 0) {
    console.warn('Graduation profile validation found issues:')
    problems.forEach((p) => console.warn(' -', p))
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWithSplash />
    </ErrorBoundary>
  </StrictMode>,
)
