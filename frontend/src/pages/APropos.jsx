import React from 'react';
import '../styles/apropos.css';

const APropos = () => (
  <div className="apropos-container">
    <section id="donnees-personnelles">
      <div className="section-header">
        <i className="fas fa-shield-alt" style={{ fontSize: '14px', color: '#4b5e2e' }}></i>
        <h2>Données personnelles</h2>
      </div>
      <p>
        Nous nous engageons à protéger vos données personnelles conformément à la réglementation en vigueur. 
        Vos informations sont utilisées uniquement dans le cadre de nos services et ne sont jamais partagées 
        sans votre consentement explicite.
      </p>
    </section>

    <section id="mentions-legales">
      <div className="section-header">
        <i className="fas fa-file-contract" style={{ fontSize: '14px', color: '#4b5e2e' }}></i>
        <h2>Mentions légales &amp; CGU</h2>
      </div>
      <p>
        Consultez nos mentions légales et conditions générales d'utilisation pour en savoir plus sur les 
        règles qui encadrent l'utilisation de notre plateforme. Nous nous efforçons de maintenir une 
        transparence totale dans nos relations avec nos utilisateurs.
      </p>
    </section>

    <section id="aide">
      <div className="section-header">
        <i className="fas fa-question-circle" style={{ fontSize: '14px', color: '#4b5e2e' }}></i>
        <h2>Aide</h2>
      </div>
      <p>
        Besoin d'assistance ? Notre équipe est à votre disposition pour répondre à toutes vos questions 
        et vous accompagner dans l'utilisation de nos services. N'hésitez pas à nous contacter pour 
        toute demande d'aide.
      </p>
    </section>
  </div>
);

export default APropos; 