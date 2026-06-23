import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function LoginPage({ onLogin }) {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    function handleInputChange(event) {
        const { name, value } = event.target

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setLoading(true)
            setError("")

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Nieprawidłowy email lub hasło.")
            }

            const data = await response.json()

            onLogin(data)

            navigate("/")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-box">
                <h1>Logowanie</h1>
                <p>Zaloguj się, aby złożyć zamówienie lub sprawdzić historię zakupów.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Adres e-mail"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logowanie..." : "Zaloguj się"}
                    </button>
                </form>

                <p className="auth-bottom-text">
                    Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage