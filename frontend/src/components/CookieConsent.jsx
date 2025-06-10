import { useState, useEffect } from 'react';
import '../styles/CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieAccepter');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepter', 'accepte');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieAccepter', 'refuse');
    setIsVisible(false);
    const currentPath = window.location.pathname.replace('/', '');
    if (currentPath === 'login' || currentPath === 'register') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <p>
          Ce site utilise des cookies permettant de visualiser des contenus et d'améliorer le fonctionnement grâce aux statistiques de navigation. 
          Si vous cliquez sur « Accepter », nos partenaires déposeront ces cookies sur votre terminal lors de votre navigation. 
          Si vous cliquez sur « Refuser », ces cookies ne seront pas déposés. 
          Votre choix est conservé pendant 6 mois et vous pouvez être informé et modifier vos préférences à tout moment sur la page « Gérer les cookies ». 
          <a 
            href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            En apprendre plus sur https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi
          </a>
        </p>
        <div className="cookie-consent-buttons">
          <button onClick={handleAccept} className="accept-button">
            J'accepte
          </button>
          <button onClick={handleDecline} className="decline-button">
            Je refuse
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 