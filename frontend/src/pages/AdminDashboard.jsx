import { useState, useEffect } from 'react';
import '../styles/admin.css';

function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('logs');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const fetchLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8000/adm/logs?token=${user.token}&mail=${user.email}&role=${user.role}`);
      const data = await response.json();
      if (data.status === 200) {
        setLogs(data.logs);
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
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          token: user.token
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        fetchUsers();
        setNewUser({ email: '', password: '', role: 'user' });
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
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
          <h2>Logs Système</h2>
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
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">Utilisateur</option>
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
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => {/* TODO: Implémenter l'édition */}}>Modifier</button>
                      <button onClick={() => {/* TODO: Implémenter la suppression */}}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 