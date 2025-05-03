import '../styles/header.css'

const Header = () => {
    return (
        <header className="header">
            <div ckassName="gauche">
                <a href="/"><img src="/img/logo.png" alt="Logo" className="logo-image" /></a>
                <h1 className="title">Cooloc</h1>
            </div>
            <hr id="ligneHeader"></hr>
        </header>
    )
}

export default Header