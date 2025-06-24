import React, { useEffect, useState } from 'react';
import '../styles/creation-colocation.css';

const ColocationInfos = () => {
  const [infos, setInfos] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const [addEmail, setAddEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleAddMember = (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    setActionLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    fetch('http://localhost:8000/coloc/utilisateurs/ajouter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mail: storedUser.email,
        role: storedUser.role,
        token: storedUser.token,
        id_coloc: infos.id_coloc || storedUser.id_coloc,
        id_utilisateur_ajoute: addEmail,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setAddSuccess('Membre ajouté !');
          setAddEmail("");
          setLoading(true);
          window.location.reload();
        } else {
          setAddError(data.message || 'Erreur lors de l\'ajout.');
        }
        setActionLoading(false);
      })
      .catch(() => {
        setAddError('Erreur de connexion au serveur.');
        setActionLoading(false);
      });
  };

  const handleRemoveMember = (id_utilisateur) => {
    if (!window.confirm('Voulez-vous vraiment retirer ce membre de la colocation ?')) return;
    setActionLoading(true);
    setAddError("");
    setAddSuccess("");
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Suppression membre', { id_utilisateur });
    const body = {
      mail: storedUser.email,
      role: storedUser.role,
      token: storedUser.token,
      id_coloc: infos.id_coloc || storedUser.id_coloc,
      id_utilisateur_supprime: id_utilisateur,
      csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
    };
    console.log('Body envoyé', body);
    fetch('http://localhost:8000/coloc/utilisateurs/supprimer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setAddSuccess('Membre retiré !');
          setLoading(true);
          window.location.reload();
        } else {
          setAddError(data.message || 'Erreur lors du retrait.');
        }
        setActionLoading(false);
      })
      .catch(() => {
        setAddError('Erreur de connexion au serveur.');
        setActionLoading(false);
      });
  };

  if (loading) return <div className="creation-colocation"><div className="creation-form">Chargement...</div></div>;
  if (error) return <div className="creation-colocation"><div className="creation-form error-message">{error}</div></div>;

  return (
    <div className="creation-colocation">
      <h1>Ma colocation</h1>
      <div className="creation-form">
        <div className="coloc-section">
          <div className="coloc-info-row">
            <span className="coloc-label">Nom :</span>
            <span className="coloc-value">{infos.nom}</span>
          </div>
          <div className="coloc-info-row">
            <span className="coloc-label">Date de création :</span>
            <span className="coloc-value">{infos.date_crea}</span>
          </div>
          <div className="coloc-actions">
            <button onClick={handleEdit} className="edit-btn">Modifier</button>
            <button onClick={handleDelete} className="delete-btn">Supprimer</button>
          </div>
          {showEdit && (
            <form onSubmit={handleEditSubmit} className="coloc-edit-form">
              <input
                type="text"
                className="form-input"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nouveau nom de la colocation"
                required
              />
              <button type="submit" className="form-submit-btn">Valider</button>
              <button type="button" className="delete-btn" onClick={() => setShowEdit(false)}>Annuler</button>
            </form>
          )}
        </div>
        <div className="coloc-section coloc-section-margin-top">
          <h2>Membres de la colocation</h2>
          <form onSubmit={handleAddMember} className="coloc-add-member-form">
            <input
              type="email"
              className="form-input add-member-input"
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              placeholder="Email du membre à ajouter"
              required
              disabled={actionLoading}
            />
            <button type="submit" className="form-submit-btn" disabled={actionLoading || !addEmail}>Ajouter</button>
          </form>
          {addError && <div className="error-message">{addError}</div>}
          {addSuccess && <div className="success-message">{addSuccess}</div>}
          {users.length === 0 ? (
            <p>Aucun membre trouvé.</p>
          ) : (
            <div className="member-cards-container">
              {users.map((u, i) => {
                const nom = u.nom || u[0] || '';
                const prenom = u.prenom || u[1] || '';
                const id_utilisateur = u.id;
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const isSelf = storedUser && (storedUser.email === u.mail);
                return (
                  <div className="member-card" key={i}>
                    <div className="member-avatar">{prenom ? prenom[0] : ''}{nom ? nom[0] : ''}</div>
                    <div className="member-info">
                      <div className="member-name">{prenom ? `${prenom} ${nom}` : nom}</div>
                      {u.mail && <div className="member-mail">{u.mail}</div>}
                    </div>
                    {!isSelf && (
                      <button className="delete-btn" style={{marginLeft: '1rem'}} onClick={() => handleRemoveMember(id_utilisateur)} disabled={actionLoading}>Retirer de la colocation</button>
                    )}
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