import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CookieConsent from './components/CookieConsent';
import './styles/auth.css';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname.replace('/', '') || 'home');

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      setCurrentPage(path);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigate = (path) => {
    const cookieAccepter = localStorage.getItem('cookieAccepter');
    
    if ((path === 'login' || path === 'register') && cookieAccepter !== 'accepted') {
      alert('Veuillez accepter les cookies pour accéder à cette fonctionnalité.');
      return;
    }
    
    window.history.pushState({}, '', `/${path}`);
    setCurrentPage(path);
  };

  const renderPage = () => {
    const cookieAccepter = localStorage.getItem('cookieAccepter');
    
    if ((currentPage === 'login' || currentPage === 'register') && cookieAccepter !== 'accepted') {
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
      />
      {renderPage()}
      <CookieConsent />
    </div>
  );
}

export default App;
