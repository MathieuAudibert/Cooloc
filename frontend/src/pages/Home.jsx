import '../styles/home.css';

const Home = () => {
  return (
    <div className="home">
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