import React, { useEffect, useState } from 'react';
import '../styles/creation-colocation.css';
import '../styles/taches.css';
import editIcon from '/img/icons/edit.png';
import cancelIcon from '/img/icons/cancel.png';
import usersIcon from '/img/icons/users.png';

const Taches = () => {
  const [tachesOuvertes, setTachesOuvertes] = useState([]);
  const [tachesCloturees, setTachesCloturees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTache, setNewTache] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    priorite: 'moyenne',
    atribue_a: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingTache, setEditingTache] = useState(null);
  const [members, setMembers] = useState([]);
  const [showClosed, setShowClosed] = useState(false);
  const [clotureEdit, setClotureEdit] = useState({});
  const [attribueEdit, setAttribueEdit] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const id_coloc = user?.id_coloc;

  const fetchTachesOuvertes = () => {
    setLoading(true);
    fetch(`http://localhost:8000/coloc/taches/voir-disponibles?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_coloc=${encodeURIComponent(id_coloc)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && Array.isArray(data.taches)) {
          setTachesOuvertes(data.taches);
        } else {
          setError(data.message || 'Erreur lors de la récupération des tâches ouvertes.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur de connexion au serveur (ouvertes).');
        setLoading(false);
      });
  };

  const fetchTachesCloturees = () => {
    fetch(`http://localhost:8000/coloc/taches/voir-completes?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_coloc=${encodeURIComponent(id_coloc)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && Array.isArray(data.taches)) {
          setTachesCloturees(data.taches);
        } else {
          setError(data.message || 'Erreur lors de la récupération des tâches clôturées.');
        }
      })
      .catch(() => {
        setError('Erreur de connexion au serveur (clôturées).');
      });
  };

  const fetchMembers = () => {
    fetch(`http://localhost:8000/coloc/utilisateurs/voir?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_colocs=${encodeURIComponent(id_coloc)}&csrf=cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && Array.isArray(data.infos)) {
          setMembers(data.infos);
        }
      });
  };

  useEffect(() => {
    if (id_coloc) {
      fetchTachesOuvertes();
      fetchTachesCloturees();
      fetchMembers();
    }
  }, [id_coloc]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTache.nom.trim()) return;
    fetch('http://localhost:8000/coloc/taches/creer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: newTache.nom,
        date_debut: newTache.date_debut || null,
        date_fin: newTache.date_fin || null,
        priorite: newTache.priorite,
        atribue_a: newTache.atribue_a !== '' && newTache.atribue_a !== null ? parseInt(newTache.atribue_a, 10) : null,
        mail: user.email,
        role: user.role,
        token: user.token,
        id_coloc,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setNewTache({ nom: '', date_debut: '', date_fin: '', priorite: 'moyenne', atribue_a: '' });
          fetchTachesOuvertes();
        } else {
          setError(data.message || 'Erreur lors de la création.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  const handleEdit = (tache) => {
    setEditingId(tache.id);
    setEditingTache({
      nom: tache.nom,
      date_debut: tache.date_debut ? tache.date_debut.slice(0, 16) : '',
      date_fin: tache.date_fin ? tache.date_fin.slice(0, 16) : '',
      priorite: tache.priorite || 'moyenne',
      atribue_a: tache.attribue_a || ''
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/coloc/taches/maj/nom', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_tache: editingId,
        nom: editingTache.nom,
        date_debut: editingTache.date_debut || null,
        date_fin: editingTache.date_fin || null,
        priorite: editingTache.priorite,
        atribue_a: editingTache.atribue_a ? parseInt(editingTache.atribue_a, 10) : null,
        mail: user.email,
        role: user.role,
        token: user.token,
        id_coloc,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setEditingId(null);
          setEditingTache(null);
          fetchTachesOuvertes();
        } else {
          setError(data.message || 'Erreur lors de la modification.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    fetch('http://localhost:8000/coloc/taches/supprimer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_tache: parseInt(id, 10),
        mail: user.email,
        role: user.role,
        token: user.token,
        id_coloc,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          fetchTachesOuvertes();
        } else {
          setError(data.message || 'Erreur lors de la suppression.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  const handleClotureChange = (id, value) => {
    setClotureEdit(prev => ({ ...prev, [id]: value }));
  };

  const handleClotureSave = (tache) => {
    fetch('http://localhost:8000/coloc/taches/cloturer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_tache: tache.id,
        cloture: clotureEdit[tache.id] ?? tache.cloture,
        mail: user.email,
        role: user.role,
        token: user.token,
        id_coloc,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          fetchTachesOuvertes();
          fetchTachesCloturees();
        } else {
          setError(data.message || 'Erreur lors de la modification de la clôture.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  const handleAttribueChange = (id, value) => {
    setAttribueEdit(prev => ({ ...prev, [id]: value }));
  };

  const handleAttribueSave = (tache) => {
    fetch('http://localhost:8000/coloc/taches/attribuer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_tache: tache.id,
        attribue_a: attribueEdit[tache.id] !== undefined && attribueEdit[tache.id] !== ''
          ? parseInt(attribueEdit[tache.id], 10)
          : (tache.attribue_a !== undefined && tache.attribue_a !== '' ? parseInt(tache.attribue_a, 10) : null),
        mail: user.email,
        role: user.role,
        token: user.token,
        id_coloc,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          fetchTachesOuvertes();
          fetchTachesCloturees();
        } else {
          setError(data.message || 'Erreur lors de la modification de l\'attribution.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  }

  function isCloturee(val) {
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  if (!id_coloc) {
    return <div className="creation-colocation"><div className="creation-form">Vous n'êtes dans aucune colocation.</div></div>;
  }

  return (
    <div className="creation-colocation">
      <h1>Gestion des tâches</h1>
      <div className="creation-form">
        <h2 className="form-title">Créer une tâche</h2>
        <form onSubmit={handleCreate} className="tache-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={newTache.nom}
              onChange={e => setNewTache({ ...newTache, nom: e.target.value })}
              placeholder="Nom de la tâche"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date de début</label>
              <input
                type="datetime-local"
                className="form-input"
                value={newTache.date_debut}
                onChange={e => setNewTache({ ...newTache, date_debut: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date de fin</label>
              <input
                type="datetime-local"
                className="form-input"
                value={newTache.date_fin}
                onChange={e => setNewTache({ ...newTache, date_fin: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priorité</label>
              <select
                className="form-input"
                value={newTache.priorite}
                onChange={e => setNewTache({ ...newTache, priorite: e.target.value })}
                required
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Attribuer à</label>
              <select
                className="form-input"
                value={newTache.atribue_a}
                onChange={e => setNewTache({ ...newTache, atribue_a: e.target.value })}
                required
              >
                <option value="">Non attribuée</option>
                {members && members.length > 0 && members.map((m, i) => (
                  <option key={m.id || i} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="form-submit-btn">Ajouter</button>
        </form>
        <h2 className="form-title-margin">Liste des tâches</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            <div className="taches-list">
              {tachesOuvertes.length === 0 ? (
                <div>Aucune tâche ouverte trouvée.</div>
              ) : (
                tachesOuvertes.map(tache => {
                  const assigned = members.find(m => m.id === tache.attribue_a);
                  const createur = members.find(m => String(m.id) === String(tache.createur));
                  return (
                    <div key={tache.id} className="tache-card">
                      {editingId === tache.id ? (
                        <form onSubmit={handleEditSubmit} className="tache-form-edit">
                          <input
                            type="text"
                            value={editingTache.nom}
                            onChange={e => setEditingTache({ ...editingTache, nom: e.target.value })}
                            required
                            placeholder="Nom de la tâche"
                          />
                          <div className="form-row">
                            <div className="form-group">
                              <label>Date de début</label>
                              <input
                                type="datetime-local"
                                value={editingTache.date_debut}
                                onChange={e => setEditingTache({ ...editingTache, date_debut: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Date de fin</label>
                              <input
                                type="datetime-local"
                                value={editingTache.date_fin}
                                onChange={e => setEditingTache({ ...editingTache, date_fin: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Priorité</label>
                              <select
                                value={editingTache.priorite}
                                onChange={e => setEditingTache({ ...editingTache, priorite: e.target.value })}
                                required
                              >
                                <option value="basse">Basse</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="haute">Haute</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Attribuer à</label>
                              <select
                                value={editingTache.atribue_a}
                                onChange={e => setEditingTache({ ...editingTache, atribue_a: e.target.value })}
                              >
                                <option value="">Non attribuée</option>
                                {members.map((m, i) => (
                                  <option key={i} value={m.id}>{m.prenom} {m.nom}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="form-actions">
                            <button type="submit">Valider</button>
                            <button type="button" onClick={() => { setEditingId(null); setEditingTache(null); }}>Annuler</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="tache-header">
                            <span className="tache-name">{tache.nom}</span>
                            <span className={`priority-badge priority-${tache.priorite}`}>{tache.priorite}</span>
                          </div>
                          <div className="tache-details">
                            <div><b>Début:</b> {formatDate(tache.date_debut)}</div>
                            <div><b>Fin:</b> {formatDate(tache.date_fin)}</div>
                            <div><b>Créée:</b> {formatDate(tache.date_crea)}</div>
                          </div>
                          <div className="tache-attribution">
                            <img src={usersIcon} alt="user" />
                            <span>{assigned ? `${assigned.prenom} ${assigned.nom}` : 'Non attribuée'}</span>
                            <span className="tache-creator">
                              Créateur : {createur ? `${createur.prenom} ${createur.nom}` : `ID ${tache.createur}`}
                            </span>
                          </div>
                          <div className="tache-actions">
                            <select
                              value={clotureEdit[tache.id] ?? tache.cloture}
                              onChange={e => handleClotureChange(tache.id, e.target.value)}
                            >
                              <option value="false">Ouverte</option>
                              <option value="en cours">En cours</option>
                              <option value="true">Clôturée</option>
                            </select>
                            <button
                              className="save-button save-cloture-button"
                              onClick={() => handleClotureSave(tache)}
                            >
                              Sauvegarder
                            </button>
                          </div>
                          <div className="tache-actions">
                            <select
                              value={attribueEdit[tache.id] ?? tache.attribue_a ?? ''}
                              onChange={e => handleAttribueChange(tache.id, e.target.value)}
                            >
                              <option value="">Non attribuée</option>
                              {members && members.length > 0 && members.map((m, i) => (
                                <option key={m.id || i} value={m.id}>{m.prenom} {m.nom}</option>
                              ))}
                            </select>
                            <button
                              className="save-button save-attribue-button"
                              onClick={() => handleAttribueSave(tache)}
                            >
                              Sauvegarder
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(tache.id)}
                            className="delete-button"
                            title="Supprimer"
                          >
                            <img src={cancelIcon} alt="delete" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {/* Menu déroulant pour tâches clôturées */}
            <div className="closed-tasks-container">
              <button
                type="button"
                onClick={() => setShowClosed(v => !v)}
                className="closed-tasks-toggle"
              >
                {showClosed ? '▼' : '►'} Tâches clôturées ({tachesCloturees.length})
              </button>
              {showClosed && (
                <div className="taches-list">
                  {tachesCloturees.length === 0 ? (
                    <div>Aucune tâche clôturée.</div>
                  ) : (
                    tachesCloturees.map(tache => {
                      const assigned = members.find(m => m.id === tache.attribue_a);
                      const createur = members.find(m => String(m.id) === String(tache.createur));
                      return (
                        <div key={tache.id} className="tache-card tache-card-closed">
                          <div className="tache-header">
                            <span className="tache-name">{tache.nom}</span>
                            <span className={`priority-badge priority-${tache.priorite}`}>{tache.priorite}</span>
                          </div>
                          <div className="tache-details">
                            <div><b>Début:</b> {formatDate(tache.date_debut)}</div>
                            <div><b>Fin:</b> {formatDate(tache.date_fin)}</div>
                            <div><b>Créée:</b> {formatDate(tache.date_crea)}</div>
                          </div>
                          <div className="tache-attribution">
                            <img src={usersIcon} alt="user" />
                            <span>{assigned ? `${assigned.prenom} ${assigned.nom}` : 'Non attribuée'}</span>
                            <span className="tache-creator">
                              Créateur : {createur ? `${createur.prenom} ${createur.nom}` : `ID ${tache.createur}`}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(tache.id)}
                            className="delete-button"
                            title="Supprimer"
                          >
                            <img src={cancelIcon} alt="delete" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Taches; 