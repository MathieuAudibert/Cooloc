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
import CreationColocation from './pages/CreationColocation';
import RoleSelectionModal from './components/RoleSelectionModal';
import './styles/auth.css';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname.replace('/', '') || 'home');
  const [user, setUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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
      
      if (parsedUser.role === 'aucun') {
        setShowRoleModal(true);
      }
      
      if (parsedUser.role === 'admin' && currentPage !== 'admin') {
        window.history.pushState({}, '', '/admin');
        setCurrentPage('admin');
      }
    }
  }, []);

  const handleRoleSelect = async (role, phoneNumber) => {
    try {
      const response = await fetch('http://localhost:8000/profil/maj', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: user.email,
          role_modifie: role,
          num_telephone: phoneNumber,
          token: user.token,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...user,
          role: role,
          phone: phoneNumber
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowRoleModal(false);

        if (role === 'responsable') {
          window.history.pushState({}, '', '/creation-colocation');
          setCurrentPage('creation-colocation');
        } else {
          window.history.pushState({}, '', '/');
          setCurrentPage('home');
        }
      } else {
        alert(data.message || 'Une erreur est survenue lors de la mise à jour du rôle');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

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
      case 'creation-colocation':
        return <CreationColocation />;
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
      {showRoleModal && <RoleSelectionModal onRoleSelect={handleRoleSelect} />}
    </div>
  );
}

export default App;
