import React, { useEffect, useState } from 'react';
import '../styles/creation-colocation.css';
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
        atribue_a: newTache.atribue_a ? parseInt(newTache.atribue_a, 10) : null,
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
        id_tache: id,
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

  const priorityColors = {
    basse: '#8bc34a',
    moyenne: '#ffc107',
    haute: '#e53935',
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
        <h2 style={{marginBottom: 8}}>Créer une tâche</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            value={newTache.nom}
            onChange={e => setNewTache({ ...newTache, nom: e.target.value })}
            placeholder="Nom de la tâche"
            required
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Date de début</label>
              <input
                type="datetime-local"
                value={newTache.date_debut}
                onChange={e => setNewTache({ ...newTache, date_debut: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Date de fin</label>
              <input
                type="datetime-local"
                value={newTache.date_fin}
                onChange={e => setNewTache({ ...newTache, date_fin: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Priorité</label>
              <select
                value={newTache.priorite}
                onChange={e => setNewTache({ ...newTache, priorite: e.target.value })}
                required
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Attribuer à</label>
              <select
                value={newTache.atribue_a}
                onChange={e => setNewTache({ ...newTache, atribue_a: e.target.value })}
              >
                <option value="">Non attribuée</option>
                {members.map((m, i) => (
                  <option key={i} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit">Ajouter</button>
        </form>
        <h2 style={{margin:'2rem 0 1rem 0', textAlign:'left'}}>Liste des tâches</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            <div className="taches-list" style={{display:'grid', gap: '1.5rem'}}>
              {tachesOuvertes.length === 0 ? (
                <div>Aucune tâche ouverte trouvée.</div>
              ) : (
                tachesOuvertes.map(tache => {
                  const assigned = members.find(m => m.id === tache.attribue_a);
                  return (
                    <div key={tache.id} className="tache-card" style={{background:'#f8f8f8', borderRadius:16, boxShadow:'0 2px 8px #0001', padding:'1.2rem 1.5rem', display:'flex', flexDirection:'column', gap:8, position:'relative'}}>
                      {editingId === tache.id ? (
                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <input
                            type="text"
                            value={editingTache.nom}
                            onChange={e => setEditingTache({ ...editingTache, nom: e.target.value })}
                            required
                            placeholder="Nom de la tâche"
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: 13 }}>Date de début</label>
                              <input
                                type="datetime-local"
                                value={editingTache.date_debut}
                                onChange={e => setEditingTache({ ...editingTache, date_debut: e.target.value })}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: 13 }}>Date de fin</label>
                              <input
                                type="datetime-local"
                                value={editingTache.date_fin}
                                onChange={e => setEditingTache({ ...editingTache, date_fin: e.target.value })}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: 13 }}>Priorité</label>
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
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: 13 }}>Attribuer à</label>
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
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button type="submit">Valider</button>
                            <button type="button" onClick={() => { setEditingId(null); setEditingTache(null); }}>Annuler</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:4}}>
                            <span style={{fontWeight:600, fontSize:'1.1rem', flex:1}}>{tache.nom}</span>
                            <span className="priority-badge" style={{background:priorityColors[tache.priorite], color:'#fff', borderRadius:8, padding:'2px 10px', fontSize:13, fontWeight:500}}>{tache.priorite}</span>
                          </div>
                          <div style={{display:'flex', gap:16, fontSize:13, color:'#555', flexWrap:'wrap'}}>
                            <div><b>Début:</b> {formatDate(tache.date_debut)}</div>
                            <div><b>Fin:</b> {formatDate(tache.date_fin)}</div>
                            <div><b>Créée:</b> {formatDate(tache.date_crea)}</div>
                          </div>
                          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#555'}}>
                            <img src={usersIcon} alt="user" style={{width:18, height:18, opacity:0.7}} />
                            <span>{assigned ? `${assigned.prenom} ${assigned.nom}` : 'Non attribuée'}</span>
                          </div>
                          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                            <span style={{fontSize:12, color:tache.cloture ? '#388e3c' : '#e53935', fontWeight:600}}>
                              {tache.cloture ? 'Clôturée' : 'Ouverte'}
                            </span>
                            <button onClick={() => handleEdit(tache)} style={{background:'none', border:'none', cursor:'pointer'}} title="Modifier">
                              <img src={editIcon} alt="edit" style={{width:20, height:20}} />
                            </button>
                            <button onClick={() => handleDelete(tache.id)} style={{background:'none', border:'none', cursor:'pointer'}} title="Supprimer">
                              <img src={cancelIcon} alt="delete" style={{width:20, height:20}} />
                            </button>
                            {!tache.cloture && (
                              <button style={{marginLeft:12, background:'#388e3c', color:'#fff', border:'none', borderRadius:6, padding:'2px 10px', fontSize:13, cursor:'pointer'}} onClick={() => {/* TODO: cloture logic */}}>Clôturer</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {/* Menu déroulant pour tâches clôturées */}
            <div style={{marginTop: '2rem'}}>
              <button
                type="button"
                onClick={() => setShowClosed(v => !v)}
                style={{background:'#eee', border:'1px solid #ccc', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontWeight:600, fontSize:15}}
              >
                {showClosed ? '▼' : '►'} Tâches clôturées ({tachesCloturees.length})
              </button>
              {showClosed && (
                <div className="taches-list" style={{display:'grid', gap: '1.5rem', marginTop:12}}>
                  {tachesCloturees.length === 0 ? (
                    <div>Aucune tâche clôturée.</div>
                  ) : (
                    tachesCloturees.map(tache => {
                      const assigned = members.find(m => m.id === tache.attribue_a);
                      return (
                        <div key={tache.id} className="tache-card" style={{background:'#f0f0f0', borderRadius:16, boxShadow:'0 2px 8px #0001', padding:'1.2rem 1.5rem', display:'flex', flexDirection:'column', gap:8, position:'relative', opacity:0.7}}>
                          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:4}}>
                            <span style={{fontWeight:600, fontSize:'1.1rem', flex:1}}>{tache.nom}</span>
                            <span className="priority-badge" style={{background:priorityColors[tache.priorite], color:'#fff', borderRadius:8, padding:'2px 10px', fontSize:13, fontWeight:500}}>{tache.priorite}</span>
                          </div>
                          <div style={{display:'flex', gap:16, fontSize:13, color:'#555', flexWrap:'wrap'}}>
                            <div><b>Début:</b> {formatDate(tache.date_debut)}</div>
                            <div><b>Fin:</b> {formatDate(tache.date_fin)}</div>
                            <div><b>Créée:</b> {formatDate(tache.date_crea)}</div>
                          </div>
                          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#555'}}>
                            <img src={usersIcon} alt="user" style={{width:18, height:18, opacity:0.7}} />
                            <span>{assigned ? `${assigned.prenom} ${assigned.nom}` : 'Non attribuée'}</span>
                          </div>
                          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                            <span style={{fontSize:12, color:'#388e3c', fontWeight:600}}>
                              Clôturée
                            </span>
                          </div>
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