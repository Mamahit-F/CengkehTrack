import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Gardens } from './pages/Gardens';
import { Harvests } from './pages/Harvests';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { Sprout } from 'lucide-react';
import bgImage from './assets/background.jpg';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1E0F]/75 backdrop-blur-[1px] text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-white/10 bg-[#0F1E0F]/80 backdrop-blur-md py-6 text-center text-xs text-[#AA8BAD]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#47C826]" />
            <span className="font-bold text-white tracking-wider">CENGKIHTRACK</span>
            <span>— Sistem Pencatatan Kebun & Panen Cengkih</span>
          </div>
          <div>
            <span>Desain Dark Nature Glassmorphism • Satuan Produksi: <strong>LITER</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen text-white">
        {/* Global Fixed Plantation Background Layer */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `radial-gradient(at 0% 0%, rgba(71, 200, 38, 0.16) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(217, 119, 6, 0.08) 0px, transparent 50%), linear-gradient(180deg, rgba(15, 30, 15, 0.68) 0%, rgba(15, 30, 15, 0.82) 100%), url(${bgImage})`,
            backgroundColor: '#0F1E0F',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Gardens />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/harvests"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Harvests />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Sales />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
