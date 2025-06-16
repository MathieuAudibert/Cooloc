import React from 'react';
import '../styles/apropos.css';

const APropos = () => (
  <div className="apropos-container">
    <section id="donnees-personnelles">
      <h2>Données personnelles</h2>
      <p>Nous nous engageons à protéger vos données personnelles conformément à la réglementation en vigueur. Vos informations sont utilisées uniquement dans le cadre de nos services et ne sont jamais partagées sans votre consentement.</p>
    </section>
    <section id="mentions-legales">
      <h2>Mentions légales &amp; CGU</h2>
      <p>Consultez nos mentions légales et conditions générales d'utilisation pour en savoir plus sur les règles qui encadrent l'utilisation de notre plateforme.</p>
    </section>
    <section id="aide">
      <h2>Aide</h2>
      <p>Besoin d'assistance ? Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans l'utilisation de nos services.</p>
    </section>
  </div>
);

export default APropos; 