import { useState, useEffect } from 'react';
import '../styles/header.css'

const Header = ({ onLoginClick, onRegisterClick, onHomeClick, onProfileClick, onAdminClick, user }) => {
    const [localUser, setLocalUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setLocalUser(JSON.parse(storedUser));
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setLocalUser(null);
        window.location.href = '/';
    };

    const handleAuthClick = (action) => {
        const cookieAccepter = localStorage.getItem('cookieAccepter');
        if (cookieAccepter !== 'accepte') {
            alert('Veuillez accepter les cookies pour accéder à cette fonctionnalité.');
            return;
        }
        action();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <button onClick={onHomeClick} className="logo-link">
                        <img src="/img/logo.png" alt="Logo" className="logo-image" />
                        <h1 className="title">Cooloc</h1>
                    </button>
                </div>
                <nav className="header-center">
                    {localUser && localUser.role === 'admin' ? (
                        null
                    ) : (
                        <>
                            <button onClick={onHomeClick} className="nav-link">Accueil</button>
                            <button className="nav-link">Qui sommes nous</button>
                            <button className="nav-link">Contact</button>
                        </>
                    )}
                </nav>
                <div className="header-right">
                    {localUser ? (
                        <div className="user-info">
                            {localUser.role === 'admin' && (
                                <button onClick={onAdminClick} className="btn btn-admin">
                                    Tableau de Bord Admin
                                </button>
                            )}
                            {localUser.role !== 'admin' && (
                                <button onClick={onProfileClick} className="profile-button">
                                    <img src="/img/icons/person.png" alt="Profile" className="profile-icon" />
                                </button>
                            )}
                            <span className="welcome-text">Bienvenue, {localUser.prenom}</span>
                            <button onClick={handleLogout} className="btn btn-logout">Déconnexion</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => handleAuthClick(onLoginClick)} className="btn btn-login">Se connecter</button>
                            <button onClick={() => handleAuthClick(onRegisterClick)} className="btn btn-register">S'inscrire</button>
                        </>
                    )}
                </div>
                <button className="burger-menu" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>
            {isMobileMenuOpen && (
                <div className="mobile-nav">
                    <nav className="mobile-nav-links">
                        {localUser && localUser.role === 'admin' ? (
                            null
                        ) : (
                            <>
                                <button onClick={onHomeClick} className="nav-link">Accueil</button>
                                <button className="nav-link">Qui sommes nous</button>
                                <button className="nav-link">Contact</button>
                            </>
                        )}
                    </nav>
                    <div className="mobile-nav-auth">
                        {localUser ? (
                            <div className="user-info">
                                {localUser.role === 'admin' && (
                                    <button onClick={onAdminClick} className="btn btn-admin">
                                        Tableau de Bord Admin
                                    </button>
                                )}
                                {localUser.role !== 'admin' && (
                                    <button onClick={onProfileClick} className="profile-button">
                                        <img src="/img/icons/person.png" alt="Profile" className="profile-icon" />
                                    </button>
                                )}
                                <span className="welcome-text">Bienvenue, {localUser.prenom}</span>
                                <button onClick={handleLogout} className="btn btn-logout">Déconnexion</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => handleAuthClick(onLoginClick)} className="btn btn-login">Se connecter</button>
                                <button onClick={() => handleAuthClick(onRegisterClick)} className="btn btn-register">S'inscrire</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="header-divider"></div>
        </header>
    )
}

export default Header