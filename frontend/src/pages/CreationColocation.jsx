import React, { useState, useEffect } from 'react';
import '../styles/creation-colocation.css';

const CreationColocation = () => {
  const [nom, setNom] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setAccessDenied(true);
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'responsable' && user.role !== 'admin') {
      setAccessDenied(true);
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('Utilisateur non connecté.');
      setLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);
    if (!nom.trim()) {
      setError('Le nom de la colocation est requis.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/coloc/creer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          mail: user.email,
          role: user.role,
          token: user.token,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y',
        }),
      });
      const data = await response.json();
      if (response.ok && data.status === 200) {
        setSuccess('Colocation créée avec succès !');
        setNom('');
      } else {
        setError(data.message || 'Erreur lors de la création de la colocation.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
    setLoading(false);
  };

  if (accessDenied) {
    return (
      <div className="creation-colocation">
        <div className="creation-form">
          <div className="error-message">Accès refusé. Redirection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="creation-colocation">
      <h1>Créer une colocation</h1>
      <div className="creation-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom de la colocation</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Entrez le nom de la colocation"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreationColocation; 