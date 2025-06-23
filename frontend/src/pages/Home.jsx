import '../styles/home.css';
import { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigate = (page) => {
    window.history.pushState({}, '', '/' + page);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const showColocFeatures = user && (user.role === 'responsable' || user.role === 'colocataire');

  const noColoc = user && !user.id_coloc;

  if (noColoc) {
    return (
      <div className="home">
        <div className="no-coloc-message" style={{margin:'2rem auto', maxWidth:400, textAlign:'center', background:'#fffbe6', border:'1px solid #ffe58f', borderRadius:8, padding:'1.5rem 1rem'}}>
          <div style={{fontWeight:'bold', fontSize:'1.1rem', marginBottom:4}}>Vous n'avez pas de colocations</div>
          <div style={{fontSize:'0.95rem', color:'#888', marginBottom:8}}>
            {user.role === 'colocataire' && (
              <>Demandez au responsable de colocation de vous ajouter</>
            )}
            {user.role === 'responsable' && (
              <>
                Creez votre colocation et ajoutez vos coloc ici :<br/>
                <button style={{marginTop:8, padding:'0.4rem 1.2rem', fontSize:'0.95rem', borderRadius:5, border:'1px solid #d4b106', background:'#fffbe6', cursor:'pointer'}} onClick={() => handleNavigate('creation-colocation')}>
                  Créer une colocation
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {showColocFeatures && (
        <section className="coloc-features-section">
          <div className="content-container coloc-features-grid">
            <div className="coloc-feature-card" onClick={() => handleNavigate('taches')}>
              <img src="/img/icons/edit.png" alt="Mes tâches" className="coloc-feature-icon" />
              <h3>Mes tâches</h3>
              <p>Consulte et gère tes tâches personnelles et de colocation.</p>
            </div>
            <div className="coloc-feature-card" onClick={() => handleNavigate('depenses')}>
              <img src="/img/icons/save.png" alt="Mes dépenses" className="coloc-feature-icon" />
              <h3>Mes dépenses</h3>
              <p>Gère et visualise tes dépenses de colocation.<br /><span style={{color:'#888', fontSize:'0.9em'}}>Fonctionnalité à venir</span></p>
            </div>
            <div className="coloc-feature-card" onClick={() => handleNavigate('colocation')}>
              <img src="/img/icons/users.png" alt="Ma colocation" className="coloc-feature-icon" />
              <h3>Ma colocation</h3>
              <p>Accède aux informations de ta colocation.</p>
            </div>
          </div>
        </section>
      )}

      <section className="landing-section">
        <div className="content-container">
          <h1>
            Grace a <span className="highlight">Cooloc</span>, rendez vos colocations plus facilement gérables !
          </h1>
          <div className="preview-container">
            <div className="preview-placeholder">
              GIF AVEC UNE PREVIEW DE L'APPLICATION
            </div>
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
              <div className="preview-box tasks">Taches</div>
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
              <div className="preview-box members">Gestion des membres</div>
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
    </div>
  );
};

export default Home; 