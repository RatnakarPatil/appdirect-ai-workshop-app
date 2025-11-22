import { useState } from 'react';
import Hero from './components/Hero';
import SessionsSpeakers from './components/SessionsSpeakers';
import RegistrationForm from './components/RegistrationForm';
import Location from './components/Location';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    // Clear cookie by setting it to expire
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  if (isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <SessionsSpeakers />
      <RegistrationForm />
      <Location />
      <Footer onAdminClick={() => setShowAdminLogin(true)} />
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;

