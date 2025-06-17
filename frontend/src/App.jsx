import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
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
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Redirect admin to dashboard on login/refresh if not already there
      if (parsedUser.role === 'admin' && currentPage !== 'admin') {
        window.history.pushState({}, '', '/admin');
        setCurrentPage('admin');
      }
    }
  }, []);

  const navigate = (path) => {
    const cookieAccepter = localStorage.getItem('cookieAccepter');
    
    if ((path === 'login' || path === 'register') && cookieAccepter !== 'accepte') {
      alert('Veuillez accepter les cookies pour accéder à cette fonctionnalité.');
      return;
    }

    if (user && user.role === 'admin' && path !== 'admin') {
        alert('En tant qu\'administrateur, vous n\'avez accès qu\'au tableau de bord.');
        window.history.pushState({}, '', '/admin');
        setCurrentPage('admin');
        return;
    }

    if (path === 'profile' && !user) {
      alert('Veuillez vous connecter pour accéder à votre profil.');
      return;
    }

    if (path === 'admin' && (!user || user.role !== 'admin')) {
      alert('Vous n\'avez pas les droits d\'accès à cette page.');
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

    if (user && user.role === 'admin' && currentPage !== 'admin') {
        window.history.pushState({}, '', '/admin');
        return <AdminDashboard />;
    }

    if (currentPage === 'profile' && !user) {
      window.history.pushState({}, '', '/');
      return <Home />;
    }

    if (currentPage === 'admin' && (!user || user.role !== 'admin')) {
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
      case 'admin':
        return <AdminDashboard />;
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
        onAdminClick={() => navigate('admin')}
        user={user}
      />
      {renderPage()}
      <CookieConsent />
      <Footer />
    </div>
  );
}

export default App;
