import '../styles/header.css'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()

    const handleLoginClick = () => {
        navigate('/login')
    }

    return (
        <header className="header">
            <div ckassName="gauche">
                <a href="/"><img src="/img/logo.png" alt="Logo" className="logo-image" /></a>
                <h1 className="title">Cooloc</h1>
            </div>
            <div className="droite">
                <button className="login" onClick={handleLoginClick}>Login</button>
                <a href="/register" className="register">Register</a>
            </div>
            <hr id="ligneHeader"></hr>
        </header>
    )
}

export default Header