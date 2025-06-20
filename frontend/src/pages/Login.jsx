import { useState } from 'react';
import '../styles/auth.css';

const Login = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; 
    
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          mdp: password,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
        }),
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`erreur: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200) {
        localStorage.setItem('user', JSON.stringify({
          email: data.data.mail,
          role: data.data.role,
          prenom: data.data.prenom,
          nom: data.data.nom,
          token: data.token
        }));
        
        window.location.href = '/';
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Heureux de vous revoir ! <span role="img" aria-label="wave">👍</span></h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-container">
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          <p className="auth-switch">
            Pas encore de compte ?{' '}
            <button type="button" onClick={onRegisterClick} className="link-button" disabled={isLoading}>
              S'inscrire
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 