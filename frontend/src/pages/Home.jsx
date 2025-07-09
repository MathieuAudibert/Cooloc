import '../styles/home.css';
import { useEffect, useState } from 'react';

const fetchMesTaches = async (user, id_coloc) => {
  const res = await fetch(`http://localhost:8000/coloc/taches/voir-miennes?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_coloc=${encodeURIComponent(id_coloc)}&csrf=cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y`);
  return res.json();
};

const fetchTachesDisponibles = async (user, id_coloc) => {
  const res = await fetch(`http://localhost:8000/coloc/taches/voir-disponibles?mail=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}&token=${encodeURIComponent(user.token)}&id_coloc=${encodeURIComponent(id_coloc)}`);
  return res.json();
};

const fetchUserId = async (email, token) => {
  const res = await fetch(`http://localhost:8000/profil/voir?mail=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
  const data = await res.json();
  if (data.status === 200 && data.infos && data.infos[0] && data.infos[0].id) {
    return data.infos[0].id;
  }
  return null;
};

const assignTaskToMe = async (user, tacheId, id_coloc, refresh) => {
  if (!userId) return;
  await fetch('http://localhost:8000/coloc/taches/attribuer', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mail: user.email,
      role: user.role,
      token: user.token,
      id_coloc: id_coloc,
      id_tache: tacheId,
      attribue_a: userId,
      csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
    })
  });
  refresh();
};

const cloturerTask = async (user, tacheId, id_coloc, refresh) => {
  await fetch('http://localhost:8000/coloc/taches/cloturer', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mail: user.email,
      role: user.role,
      token: user.token,
      id_coloc: id_coloc,
      id_tache: tacheId,
      cloture: 'true',
      csrf: 'cz6hyCmAUIU7D1htACJKe2HwfE6bqAiksEOYJABM3-Y'
    })
  });
  refresh();
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mesTaches, setMesTaches] = useState([]);
  const [tachesDisponibles, setTachesDisponibles] = useState([]);
  const [tachesLoading, setTachesLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.email && user.token) {
      fetchUserId(user.email, user.token).then(id => setUserId(id));
    }
  }, [user]);

  useEffect(() => {
    refreshTasks();
  }, [user]);

  const refreshTasks = () => {
    if (user && user.id_coloc) {
      setTachesLoading(true);
      Promise.all([
        fetchMesTaches(user, user.id_coloc),
        fetchTachesDisponibles(user, user.id_coloc)
      ]).then(([mes, dispo]) => {
        setMesTaches(Array.isArray(mes.taches) ? mes.taches : []);
        setTachesDisponibles(Array.isArray(dispo.taches) ? dispo.taches.filter(t => !t.attribue_a) : []);
        setTachesLoading(false);
      });
    }
  };

  const handleNavigate = (page) => {
    window.history.pushState({}, '', '/' + page);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const showColocFeatures = user && (user.role === 'responsable' || user.role === 'colocataire');

  const noColoc = user && !user.id_coloc;

  if (noColoc) {
    return (
      <div className="home">
        <div className="no-coloc-message">
          <div className="no-coloc-title">Vous n'avez pas de colocations</div>
          <div className="no-coloc-text">
            {user.role === 'colocataire' && (
              <>Demandez au responsable de colocation de vous ajouter</>
            )}
            {user.role === 'responsable' && (
              <>
                Creez votre colocation et ajoutez vos coloc ici :<br/>
                <button className="create-coloc-button" onClick={() => handleNavigate('creation-colocation')}>
                  Créer une colocation
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const showTasks = user && user.id_coloc;

  return (
    <div className="home">
      {showTasks && (
        <div className="tasks-container">
          <h2 className="tasks-title">Mes tâches</h2>
          {tachesLoading ? <div>Chargement...</div> : (
            <ul className="tasks-list">
              {mesTaches.length === 0 ? <li>Aucune tâche assignée.</li> : mesTaches.map(t => (
                <li key={t.id} className="tasks-list-item">
                  {t.nom}
                  <button style={{marginLeft:8}} onClick={() => cloturerTask(user, t.id, user.id_coloc, refreshTasks)}>
                    Clôturer
                  </button>
                </li>
              ))}
            </ul>
          )}
          <hr className="tasks-divider" />
          <h2 className="tasks-subtitle">Tâches disponibles</h2>
          {tachesLoading ? <div>Chargement...</div> : (
            <ul className="tasks-list">
              {tachesDisponibles.length === 0 ? <li>Aucune tâche disponible.</li> : tachesDisponibles.map(t => (
                <li key={t.id} className="tasks-list-item">
                  {t.nom}
                  <button style={{marginLeft:8}} onClick={() => assignTaskToMe(user, t.id, user.id_coloc, refreshTasks)}>
                    Me l'attribuer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showColocFeatures && (
        <section className="coloc-features-section">
          <div className="coloc-features-title">Accès rapide</div>
          <div className="content-container coloc-features-grid">
            <div className="coloc-feature-card" onClick={() => handleNavigate('taches')}>
              <img src="/img/icons/edit.png" alt="Mes tâches" className="coloc-feature-icon" />
              <h3>Mes tâches</h3>
              <p>Consulte et gère tes tâches personnelles et de colocation.</p>
            </div>
            <div className="coloc-feature-card" onClick={() => handleNavigate('depenses')}>
              <img src="/img/icons/save.png" alt="Mes dépenses" className="coloc-feature-icon" />
              <h3>Mes dépenses</h3>
              <p>Gère et visualise tes dépenses de colocation.<br /><span className="task-todo">A FAIRE</span></p>
            </div>
            <div className="coloc-feature-card" onClick={() => handleNavigate('colocation')}>
              <img src="/img/icons/users.png" alt="Ma colocation" className="coloc-feature-icon" />
              <h3>Ma colocation</h3>
              <p>Accède aux informations de ta colocation.</p>
            </div>
          </div>
        </section>
      )}

      {(!user) && (
        <>
          <section className="landing-section">
            <div className="content-container">
              <h1>
                Grace a <span className="highlight">Cooloc</span>, rendez vos colocations plus facilement gérables !
              </h1>
              <div className="preview-container">
                <img src="/img/previews/gif_preview.gif" alt="Aperçu Cooloc" className="preview-image" style={{maxWidth: '100%', borderRadius: '16px', boxShadow: '0 2px 16px #0002'}} />
              </div>
              <p className="description">
                Rencontrez Cooloc, votre plateforme de gestion de colocation intéractive ;
                Cooloc a pour but de simplifier les relations et les devoirs des colocataires en leur proposant une
                interface simple pour la gestion des taches personnelles/communes et dépenses personnelles/communes.
              </p>
            </div>
          </section>

          <section className="tasks-section">
            <div className="content-container">
              <div className="section-grid">
                <div className="text-content">
                  <h2>Taches</h2>
                  <p className="subtitle">Organisez vos taches entre colocs !</p>
                  <div className="feature-block">
                    <h3>Fini les disputes sur qui fait quoi ! 👊</h3>
                    <p>
                      Ajoute des tâches, attribue-les aux colocataires ou laisse-les se répartir
                      librement. Chaque tâche peut être commune ou assignée, et une fois
                      terminée, elle disparaît de la liste.
                    </p>
                  </div>
                  <div className="feature-block">
                    <h3>Ne rate plus aucun événement important ! ⏰</h3>
                    <p>
                      Planifie les réunions de coloc, note les échéances de paiement et
                      ajoute des rappels pour les tâches importantes. Un calendrier partagé
                      pour une meilleure organisation !
                    </p>
                  </div>
                </div>
                <div className="preview-grid">
                  <img src="/img/previews/taches.png" alt="Aperçu tâches" className="preview-image" style={{width: '100%', borderRadius: '12px', marginBottom: '1rem'}} />
                  <div className="preview-box events">Evenements</div>
                </div>
              </div>
            </div>
          </section>

          <section className="management-section">
            <div className="content-container">
              <div className="section-grid">
                <div className="preview-grid">
                  <div className="preview-box finances">Finances</div>
                  <img src="/img/previews/gestion_coloc.png" alt="Aperçu membres" className="preview-image" style={{width: '100%', borderRadius: '12px'}} />
                </div>
                <div className="text-content">
                  <h2>Gestion</h2>
                  <p className="subtitle">Gere et organise ta coloc comme un chef !</p>
                  <div className="feature-block">
                    <h3>Gère les membres de ta coloc facilement ! 👥</h3>
                    <p>
                      Ajoute ou supprime des colocataires, consulte leurs profils et vois en un
                      clin d'œil qui participe aux différentes tâches et dépenses.
                    </p>
                  </div>
                  <div className="feature-block">
                    <h3>Garde un œil sur les finances de la coloc ! 💸</h3>
                    <p>
                      Ajoute facilement des dépenses, répartis-les entre les colocataires et
                      consulte la balance pour voir qui doit combien à qui. Tout est
                      automatisé pour éviter les calculs compliqués.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home; 