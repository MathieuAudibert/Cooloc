import '../styles/header.css'

const Header = ({ onLoginClick, onRegisterClick, onHomeClick }) => {
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
                    <button onClick={onHomeClick} className="nav-link">Accueil</button>
                    <button className="nav-link">Qui sommes nous</button>
                    <button className="nav-link">Contact</button>
                </nav>
                <div className="header-right">
                    <button onClick={onLoginClick} className="btn btn-login">Se connecter</button>
                    <button onClick={onRegisterClick} className="btn btn-register">S'inscrire</button>
                </div>
            </div>
            <div className="header-divider"></div>
        </header>
    )
}

export default Header