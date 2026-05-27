import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicForm from './components/PublicForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

const AppContent: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isLoggedIn, isAdmin } = useAuth();

  // If admin is logged in and wants to see admin panel
  if (showAdminPanel && isLoggedIn && isAdmin) {
    return <AdminPanel onBackToForm={() => setShowAdminPanel(false)} />;
  }

  return (
    <>
      <PublicForm onAdminClick={() => setShowAdminLogin(true)} />
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          setShowAdminPanel(true);
          setShowAdminLogin(false);
        }}
      />
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;