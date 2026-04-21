import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import Navbar from './components/ui/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ATSPage from './pages/ATSPage'
import BuilderPage from './pages/BuilderPage'
import CoverLetterPage from './pages/CoverLetterPage'
import { PrivacyPage, TermsPage } from './pages/LegalPages'

function Protected({ children }) {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 rounded-full spin" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--brand)' }} />
    </div>
  )
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function Shell() {
  const { isLoading } = useAuth()
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 rounded-full spin" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--brand)' }} />
    </div>
  )
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ats" element={<ATSPage />} />
        <Route path="/cover-letter" element={<CoverLetterPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/builder" element={<Protected><BuilderPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
