import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import APropos from './pages/APropos';
import './styles/auth.css';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname.replace('/', '') || 'home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      setCurrentPage(path);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navigate = (path) => {
    const cookieAccepter = localStorage.getItem('cookieAccepter');
    
    if ((path === 'login' || path === 'register') && cookieAccepter !== 'accepte') {
      alert('Veuillez accepter les cookies pour accéder à cette fonctionnalité.');
      return;
    }

    if (path === 'profile' && !user) {
      alert('Veuillez vous connecter pour accéder à votre profil.');
      return;
    }
    
    window.history.pushState({}, '', `/${path}`);
    setCurrentPage(path);
  };

  const renderPage = () => {
    const cookieAccepter = localStorage.getItem('cookieAccepter');
    
    if ((currentPage === 'login' || currentPage === 'register') && cookieAccepter !== 'accepte') {
      window.history.pushState({}, '', '/');
      return <Home />;
    }

    if (currentPage === 'profile' && !user) {
      window.history.pushState({}, '', '/');
      return <Home />;
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login onRegisterClick={() => navigate('register')} />;
      case 'register':
        return <Register onLoginClick={() => navigate('login')} />;
      case 'profile':
        return <Profile />;
      case 'a-propos':
        return <APropos />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Header 
        onLoginClick={() => navigate('login')} 
        onRegisterClick={() => navigate('register')}
        onHomeClick={() => navigate('home')}
        onProfileClick={() => navigate('profile')}
      />
      {renderPage()}
      <CookieConsent />
      <Footer />
    </div>
  );
}

export default App;
