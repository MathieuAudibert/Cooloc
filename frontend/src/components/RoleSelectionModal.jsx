import { useState, useEffect } from 'react';
import '../styles/RoleSelectionModal.css';

const RoleSelectionModal = ({ onRoleSelect }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setStep(2);
  };

  const handleRoleSelect = (role) => {
    onRoleSelect(role, phoneNumber);
  };

  return (
    <div className="role-modal-overlay">
      <div className="role-modal">
        {step === 1 ? (
          <div className="phone-step">
            <h2>Complétez votre profil</h2>
            <p>Veuillez entrer votre numéro de téléphone pour continuer</p>
            <form onSubmit={handlePhoneSubmit}>
              <div className="input-container">
                <img src="/img/icons/phone.png" alt="Phone" className="input-icon" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Numéro de téléphone"
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="submit-button">
                Continuer
              </button>
            </form>
          </div>
        ) : (
          <div className="role-step">
            <h2>Choisissez votre rôle</h2>
            <p>Comment souhaitez-vous utiliser Cooloc ?</p>
            <div className="role-buttons">
              <button 
                className="role-button colocataire"
                onClick={() => handleRoleSelect('colocataire')}
              >
                <img src="/img/icons/users.png" alt="Colocataire" />
                <span>Je suis un colocataire</span>
                <p>Je veux rejoindre une colocation existante</p>
              </button>
              <button 
                className="role-button responsable"
                onClick={() => handleRoleSelect('responsable')}
              >
                <img src="/img/icons/crown.png" alt="Responsable" />
                <span>Je suis un responsable</span>
                <p>Je veux créer une nouvelle colocation</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionModal; 