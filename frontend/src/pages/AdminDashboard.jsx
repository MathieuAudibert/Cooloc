import { useState, useEffect } from 'react';
import '../styles/admin.css';

function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('logs');
  const [newUser, setNewUser] = useState({
    mail: '',
    mdp: '',
    prenom: '',
    nom: '',
    num_telephone: '',
    role: 'colocataire'
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ mail: '', prenom: '', nom: '', role: '', num_telephone: '', mdp: '' });
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const fetchLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8000/adm/logs?token=${user.token}&role=${user.role}&mail=${user.email}`);
      const data = await response.json();
      if (data.status === 200) {
        const sortedLogs = [...data.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sortedLogs);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8000/adm/utilisateurs/voir?token=${user.token}`);
      const data = await response.json();
      if (data.status === 200) {
        setUsers(data.utilisateurs);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const admin = JSON.parse(localStorage.getItem('user'));
      const body = {
        mail: newUser.mail,
        mdp: newUser.mdp,
        prenom: newUser.prenom,
        nom: newUser.nom,
        num_telephone: newUser.num_telephone,
        role: newUser.role,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y',
        token: admin.token
      };
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === 200) {
        fetchUsers();
        setNewUser({ mail: '', mdp: '', prenom: '', nom: '', num_telephone: '', role: 'colocataire' });
      } else {
        alert(data.message || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      const admin = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:8000/adm/utilisateurs/supprimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mail: admin.email,
          role: admin.role,
          token: admin.token,
          id_utilisateur_supprime: id,
          csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        fetchUsers();
      } else {
        alert(data.message || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      mail: user.mail,
      prenom: user.prenom || '',
      nom: user.nom || '',
      role: user.role || 'colocataire',
      num_telephone: user.num_telephone || '',
      mdp: ''
    });
    setEditError('');
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const admin = JSON.parse(localStorage.getItem('user'));
      const body = {
        mail: admin.email,
        csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y',
        token: admin.token,
        role: admin.role,
        id_utilisateur: editUser.id,
        id_utilisateur_modifie: editUser.id,
        nom: editForm.nom,
        prenom: editForm.prenom,
        mail_modifie: editForm.mail,
        role_modifie: editForm.role,
        num_telephone: editForm.num_telephone
      };
      if (editForm.mdp) {
        body.mdp = editForm.mdp;
      }
      const response = await fetch('http://localhost:8000/adm/utilisateurs/maj', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.status === 200) {
        setEditModalOpen(false);
        setEditUser(null);
        fetchUsers();
      } else {
        setEditError(data.message || 'Erreur lors de la modification.');
      }
    } catch (err) {
      setEditError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Tableau de Bord Administrateur</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
      </div>

      {activeTab === 'logs' && (
        <div className="logs-section">
          <h2>Logs</h2>
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className="log-entry">
                <span className="log-timestamp">{log.date}</span>
                <span className="log-action">{log.action}</span>
                <div className="log-details">
                  <p>ID Colocation: {log.infos.id_coloc || 'N/A'}</p>
                  <p>ID Utilisateur: {log.infos.id_utilisateur || 'N/A'}</p>
                  <p>ID Log: {log.infos.id_logs || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Gestion des Utilisateurs</h2>
          
          <form onSubmit={handleCreateUser} className="create-user-form">
            <h3>Créer un Nouvel Utilisateur</h3>
            <input
              type="email"
              placeholder="Email"
              value={newUser.mail}
              onChange={(e) => setNewUser({...newUser, mail: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.mdp}
              onChange={(e) => setNewUser({...newUser, mdp: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={newUser.prenom}
              onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Nom"
              value={newUser.nom}
              onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Téléphone (optionnel)"
              value={newUser.num_telephone}
              onChange={(e) => setNewUser({...newUser, num_telephone: e.target.value.slice(0, 10)})}
              maxLength={10}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="colocataire">Colocataire</option>
              <option value="responsable">Responsable</option>
              <option value="aucun">Aucun</option>
              <option value="admin">Administrateur</option>
            </select>
            <button type="submit">Créer l'utilisateur</button>
          </form>

          <div className="users-list">
            <h3>Utilisateurs Existants</h3>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td data-label="Email">{user.mail}</td>
                    <td data-label="Rôle">{user.role}</td>
                    <td data-label="Actions">
                      <button onClick={() => handleEditClick(user)}>Modifier</button>
                      <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal-overlay admin-modal-overlay">
          <div className="modal admin-modal">
            <h2 className="modal-title">Modifier l'utilisateur</h2>
            <form onSubmit={handleEditSubmit} className="edit-user-form">
              <label className="modal-label">Email</label>
              <input type="email" name="mail" value={editForm.mail} onChange={handleEditFormChange} required className="modal-input" />
              <label className="modal-label">Prénom</label>
              <input type="text" name="prenom" value={editForm.prenom} onChange={handleEditFormChange} required className="modal-input" />
              <label className="modal-label">Nom</label>
              <input type="text" name="nom" value={editForm.nom} onChange={handleEditFormChange} required className="modal-input" />
              <label className="modal-label">Rôle</label>
              <select name="role" value={editForm.role} onChange={handleEditFormChange} required className="modal-input">
                <option value="colocataire">Colocataire</option>
                <option value="responsable">Responsable</option>
                <option value="aucun">Aucun</option>
                <option value="admin">Administrateur</option>
              </select>
              <label className="modal-label">Téléphone</label>
              <input type="tel" name="num_telephone" value={editForm.num_telephone} onChange={handleEditFormChange} className="modal-input" maxLength={10} />
              <label className="modal-label">Mot de passe (optionnel)</label>
              <input type="password" name="mdp" value={editForm.mdp} onChange={handleEditFormChange} className="modal-input" autoComplete="new-password" />
              {editError && <div className="error-message modal-error">{editError}</div>}
              <div className="modal-actions">
                <button type="submit" className="modal-btn modal-btn-save">Enregistrer</button>
                <button type="button" className="modal-btn modal-btn-cancel" onClick={() => setEditModalOpen(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 