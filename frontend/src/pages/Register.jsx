import { useState } from 'react';
import '../styles/auth.css';

const Register = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Bienvenue ! 👋</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmEmail">Confirmez l'email *</label>
            <div className="input-container">
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
              />
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nom *</label>
            <div className="input-container">
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <img src="/img/icons/user.png" alt="User" className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Prénom *</label>
            <div className="input-container">
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <img src="/img/icons/user.png" alt="User" className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmez le mot de passe *</label>
            <div className="input-container">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
            </div>
          </div>

          <button type="submit" className="submit-button">
            S'inscrire
          </button>

          <p className="auth-switch">
            Déjà un compte ?{' '}
            <button type="button" onClick={onLoginClick} className="link-button">
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 