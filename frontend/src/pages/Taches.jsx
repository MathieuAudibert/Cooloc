import React, { useEffect, useState } from 'react';
import '../styles/creation-colocation.css';

const Taches = () => {
  const [taches, setTaches] = useState([]);
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

  const user = JSON.parse(localStorage.getItem('user'));
  const id_coloc = user?.id_coloc;

  const fetchTaches = () => {
    setLoading(true);
    fetch(`http://localhost:8000/coloc/taches/voir-disponibles?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_coloc=${encodeURIComponent(id_coloc)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && Array.isArray(data.taches)) {
          setTaches(data.taches);
        } else {
          setError(data.message || 'Erreur lors de la récupération des tâches.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur de connexion au serveur.');
        setLoading(false);
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
      fetchTaches();
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
          fetchTaches();
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
          fetchTaches();
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
          fetchTaches();
        } else {
          setError(data.message || 'Erreur lors de la suppression.');
        }
      })
      .catch(() => setError('Erreur de connexion au serveur.'));
  };

  if (!id_coloc) {
    return <div className="creation-colocation"><div className="creation-form">Vous n'êtes dans aucune colocation.</div></div>;
  }

  return (
    <div className="creation-colocation">
      <h1>Gestion des tâches</h1>
      <div className="creation-form">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
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
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {taches.length === 0 ? (
              <li>Aucune tâche trouvée.</li>
            ) : (
              taches.map(tache => (
                <li key={tache.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {editingId === tache.id ? (
                    <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
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
                      <span style={{ flex: 1 }}>{tache.nom}</span>
                      <button onClick={() => handleEdit(tache)}>Modifier</button>
                      <button onClick={() => handleDelete(tache.id)}>Supprimer</button>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Taches; 