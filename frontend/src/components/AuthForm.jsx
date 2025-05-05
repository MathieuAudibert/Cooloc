import { useState, useCallback } from "react"

export default function AuthForm({ mode }){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        mail: "",
        mdp: "",
        nom: "",
        prenom: "",
    })

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const endpoint = isLogin ? "" : ""
        const body = isLogin ? { mail: email, mdp: password } : { mail: email, mdp: password, nom: formData.nom, prenom: formData.prenom }
        
        try {
            const response = fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            })

            const data = response.json()

            if (!response.ok) {setError(data.message || "Erreur")}

            if (isLogin){
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                window.location.reload()
                window.location.href = "/"
            } else {
                window.location.href = "/login"
            }
        } catch (e) {
            setError("Erreur de connexion")
        }
    }, [formData, isLogin])

    return (
        <div className="auth-container">
            <div className="etage1">
                <h1>{isLogin ? "Hereux de vous revoir ! 🤙" : "Bienvenue ! 👋"}</h1>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="mail" placeholder="Email" value={formData.mail} onChange={handleChange} required aria-label="mail"></input>
                    {!isLogin && (
                        <>
                            <input type="email" name="confirmMail" placeholder="Confirmer l'email" value={formData.mail} onChange={handleChange} required aria-label="confirmMail"></input>
                            <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required aria-label="nom"></input>
                            <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required aria-label="prenom"></input>
                        </>
                    )}
                    <input type="password" name="mdp" placeholder="Mot de passe" value={formData.mdp} onChange={handleChange} required aria-label="mdp"></input>
                    {!isLogin && (
                        <>
                            <input type="password" name="confirmMdp" placeholder="Confirmez le mot de passe" value={formData.mdp} onChange={handleChange} required aria-abel="mdp"></input>
                        </>
                    )}
                    <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
                    {error && <p className="error">{error}</p>}
                    {loading && <p className="loading">Chargement...</p>}
                    <p className="switch-mode">{isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                        <a href={isLogin ? "/register" : "/login"} className="switch-link">{isLogin ?"Inscrivez-vous" : "Connectez-vous"}</a>
                    </p>
                </form>
            </div>
        </div>
    )
}