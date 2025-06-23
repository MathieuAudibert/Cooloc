import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <nav className="footer-nav">
          <a href="/a-propos" className="footer-link">Données personnelles</a>
          <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi" className="footer-link" target="_blank" rel="noopener noreferrer">Gestion des cookies</a>
          <a href="/a-propos" className="footer-link">Mentions légales &amp; CGU</a>
          <a href="http://localhost:8000/docs" className="footer-link" target="_blank" rel="noopener noreferrer">Documentation technique</a>
          <a href="/a-propos" className="footer-link">Aide</a>
        </nav>
        <hr className="footer-divider" />
      </div>
      <div className="footer-bottom">
        <div className="footer-address">
          16 allée de la Marche, 92380 Garches, Hauts-De-Seine, France
        </div>
        <div className="footer-icons">
          <a href="mailto:contact@cooloc.fr" className="footer-icon-link" aria-label="Mail">
            <img src="/img/icons/mail.png" alt="Mail" className="footer-icon" />
          </a>
          <a href="https://www.instagram.com/" className="footer-icon-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src="/img/icons/insta.png" alt="Instagram" className="footer-icon" />
          </a>
          <a href="https://www.linkedin.com/" className="footer-icon-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src="/img/icons/linkedin.png" alt="LinkedIn" className="footer-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 