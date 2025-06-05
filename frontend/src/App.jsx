import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/auth.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onRegisterClick={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onLoginClick={() => setCurrentPage('login')} />;
      default:
        return <Login onRegisterClick={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;
