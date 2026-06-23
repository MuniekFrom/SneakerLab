import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function RegisterPage({ onLogin }) {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: "",
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

            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Nie udało się utworzyć konta.")
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
                <h1>Rejestracja</h1>
                <p>Utwórz konto klienta, aby składać zamówienia w SneakerLab.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Imię i nazwisko"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />

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
                        {loading ? "Tworzenie konta..." : "Zarejestruj się"}
                    </button>
                </form>

                <p className="auth-bottom-text">
                    Masz już konto? <Link to="/login">Zaloguj się</Link>
                </p>
            </section>
        </main>
    )
}

export default RegisterPage