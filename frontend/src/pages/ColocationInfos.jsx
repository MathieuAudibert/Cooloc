import React, { useEffect, useState } from 'react';
import '../styles/creation-colocation.css';

const ColocationInfos = () => {
  const [infos, setInfos] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('Utilisateur non connecté.');
      setLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);
    fetch('http://localhost:8000/profil/voir?token=' + encodeURIComponent(user.token) + '&role=' + encodeURIComponent(user.role) + '&mail=' + encodeURIComponent(user.email))
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && data.infos && data.infos[0]) {
          const profil = data.infos[0];
          localStorage.setItem('user', JSON.stringify({ ...user, id_coloc: profil.id_coloc }));
          if (!profil.id_coloc) {
            setError('Vous n\'êtes dans aucune colocation.');
            setLoading(false);
            return;
          }
          fetch('http://localhost:8000/coloc/voir?mail=' + encodeURIComponent(user.email) + '&role=' + encodeURIComponent(user.role) + '&token=' + encodeURIComponent(user.token) + '&id_colocs=' + encodeURIComponent(profil.id_coloc))
            .then(res => res.json())
            .then(data2 => {
              if (data2.status === 200) {
                setInfos(data2.infos[0]);
              } else {
                setError(data2.message || 'Erreur lors de la récupération des infos.');
              }
              fetch('http://localhost:8000/coloc/utilisateurs/voir?mail=' + encodeURIComponent(user.email) + '&role=' + encodeURIComponent(user.role) + '&token=' + encodeURIComponent(user.token) + '&id_colocs=' + encodeURIComponent(profil.id_coloc) + '&csrf=cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y')
                .then(res => res.json())
                .then(data3 => {
                  if (data3.status === 200 && Array.isArray(data3.infos)) {
                    setUsers(data3.infos);
                  }
                  setLoading(false);
                })
                .catch(() => {
                  setLoading(false);
                });
            })
            .catch(() => {
              setError('Erreur de connexion au serveur.');
              setLoading(false);
            });
        } else {
          setError('Impossible de récupérer le profil utilisateur.');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Erreur de connexion au serveur.');
        setLoading(false);
      });
  }, []);

  const handleEdit = () => setShowEdit(true);
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    fetch('http://localhost:8000/coloc/maj/nom', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mail: storedUser.email,
        role: storedUser.role,
        token: storedUser.token,
        id_coloc: infos.id_coloc || storedUser.id_coloc,
        nom: newName,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setInfos({ ...infos, nom: newName });
          setShowEdit(false);
        } else {
          setError(data.message || 'Erreur lors de la modification.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };
  const handleDelete = () => {
    if (window.confirm('Voulez-vous vraiment supprimer la colocation ?')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      fetch('http://localhost:8000/coloc/supprimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mail: storedUser.email,
          role: storedUser.role,
          token: storedUser.token,
          id_coloc: infos.id_coloc || storedUser.id_coloc,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            setInfos(null);
            setUsers([]);
          } else {
            setError(data.message || 'Erreur lors de la suppression.');
          }
        })
        .catch(() => setError('Erreur de connexion au serveur.'));
    }
  };

  if (loading) return <div className="creation-colocation"><div className="creation-form">Chargement...</div></div>;
  if (error) return <div className="creation-colocation"><div className="creation-form error-message">{error}</div></div>;

  return (
    <div className="creation-colocation">
      <h1>Ma colocation</h1>
      <div className="creation-form">
        <p><strong>Nom :</strong> {infos.nom}</p>
        <p><strong>Date de création :</strong> {infos.date_crea}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <button onClick={handleEdit} className="edit-btn">Modifier</button>
          <button onClick={handleDelete} className="delete-btn">Supprimer</button>
        </div>
        {showEdit && (
          <form onSubmit={handleEditSubmit} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nouveau nom de la colocation"
              required
            />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setShowEdit(false)}>Annuler</button>
          </form>
        )}
        <div style={{marginTop: '2rem'}}>
          <h2>Membres de la colocation</h2>
          {users.length === 0 ? (
            <p>Aucun membre trouvé.</p>
          ) : (
            <div className="member-cards-container">
              {users.map((u, i) => {
                const nom = u.nom || u[0] || '';
                const prenom = u.prenom || u[1] || '';
                return (
                  <div className="member-card" key={i}>
                    <div className="member-avatar">{prenom ? prenom[0] : ''}{nom ? nom[0] : ''}</div>
                    <div className="member-info">
                      <div className="member-name">{prenom ? `${prenom} ${nom}` : nom}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColocationInfos; 