import { useState } from 'react';
import '../styles/auth.css';

const Login = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Heureux de vous revoir ! <span role="img" aria-label="wave">👍</span></h1>
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
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Se connecter
          </button>
          <p className="auth-switch">
            Pas encore de compte ?{' '}
            <button type="button" onClick={onRegisterClick} className="link-button">
              S'inscrire
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 