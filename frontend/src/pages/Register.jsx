import { useState } from 'react';
import '../styles/auth.css';

const Register = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (email !== confirmEmail) {
      setError('Les adresses email ne correspondent pas');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 14) {
      setError('Le mot de passe doit contenir au moins 14 caractères');
      return;
    }

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChars.test(password)) {
      setError('Le mot de passe doit contenir au moins un caractère spécial');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          nom: nom,
          prenom: prenom,
          mdp: password,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setEmail('');
        setConfirmEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Bienvenue ! <span role="img" aria-label="wave">👋</span></h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" />
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmEmail">Confirmez l'email <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/mail.png" alt="Email" className="input-icon" />
              <input
                type="email"
                id="confirmEmail"
                className="form-input"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="nom">Nom <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/person.png" alt="User" className="input-icon" />
              <input
                type="text"
                id="nom"
                className="form-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prenom <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/person.png" alt="User" className="input-icon" />
              <input
                type="text"
                id="prenom"
                className="form-input"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmez le mot de passe <b className="etoile">*</b></label>
            <div className="input-container">
              <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
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