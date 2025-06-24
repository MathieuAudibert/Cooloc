import { useState, useEffect } from 'react';
import '../styles/profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    prenom: '',
    nom: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        email: userData.email,
        prenom: userData.prenom,
        nom: userData.nom,
        password: '',
        confirmPassword: ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password && formData.password.length < 14) {
      setError('Le mot de passe doit contenir au moins 14 caractères');
      return;
    }

    if (formData.password) {
      const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
      if (!specialChars.test(formData.password)) {
        setError('Le mot de passe doit contenir au moins un caractère spécial');
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:8000/profil/maj', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: user.email,
          mail_modifie: formData.email,
          prenom: formData.prenom,
          nom: formData.nom,
          mdp: formData.password || undefined,
          token: user.token,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profil mis à jour avec succès');
        const updatedUser = {
          ...user,
          email: formData.email,
          prenom: formData.prenom,
          nom: formData.nom
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        setError(data.message || 'Une erreur est survenue lors de la mise à jour du profil');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  if (!user) {
    return <div className="profile-container">Chargement...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/img/icons/person.png" alt="Profile" className="avatar-image" />
            {isEditing && (
              <div className="avatar-overlay">
                <span>Modifier</span>
              </div>
            )}
          </div>
          <h1>Mon Profil</h1>
          <p className="profile-subtitle">Gérez vos informations personnelles</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Informations personnelles</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-container">
                  <img src="/img/icons/mail.png" alt="Email" className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <div className="input-container">
                  <img src="/img/icons/person.png" alt="User" className="input-icon" />
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <div className="input-container">
                  <img src="/img/icons/person.png" alt="User" className="input-icon" />
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-section">
              <h2>Sécurité</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="password">Nouveau mot de passe (optionnel)</label>
                  <div className="input-container">
                    <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <div className="input-container">
                    <img src="/img/icons/lock.png" alt="Password" className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="submit" className="submit-button">
                  <img src="/img/icons/save.png" alt="Save" className="button-icon" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...formData,
                      password: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  <img src="/img/icons/cancel.png" alt="Cancel" className="button-icon" />
                  Annuler
                </button>
              </>
            ) : null}
          </div>
        </form>
        {!isEditing && (
          <div className="button-group">
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              <img src="/img/icons/edit.png" alt="Edit" className="button-icon" />
              Modifier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 