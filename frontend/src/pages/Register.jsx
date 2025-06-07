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
        <h1>Bienvenue ! <span role="img" aria-label="wave">👋</span></h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email <b class="etoile">*</b></label>
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
            <label htmlFor="confirmEmail">Confirmez l'email <b class="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom <b class="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/person.png" alt="User" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="firstName">Prenom <b class="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/person.png" alt="User" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{paddingLeft: '2.5rem'}}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe <b class="etoile">*</b></label>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmez le mot de passe <b class="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" style={{left: '0.75rem', right: 'auto'}} />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{paddingLeft: '2.5rem'}}
              />
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