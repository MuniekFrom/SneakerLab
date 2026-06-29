import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function AccountPage({ user }) {
    const [accountData, setAccountData] = useState(null)
    const [fullName, setFullName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const savedAvatar = localStorage.getItem(`sneakerlab_avatar_${user.email}`)
        if (savedAvatar) {
            setAvatar(savedAvatar)
        }

        fetch("http://localhost:8080/api/users/me", {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych konta.")
                }

                return response.json()
            })
            .then(data => {
                setAccountData(data)
                setFullName(data.fullName || "")
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [user])

    function handleAvatarChange(event) {
        const file = event.target.files[0]

        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            const imageBase64 = reader.result
            setAvatar(imageBase64)
            localStorage.setItem(`sneakerlab_avatar_${user.email}`, imageBase64)
        }

        reader.readAsDataURL(file)
    }

    async function handleSave(event) {
        event.preventDefault()

        try {
            setSaving(true)
            setError("")
            setMessage("")

            const response = await fetch("http://localhost:8080/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    fullName: fullName
                })
            })

            if (!response.ok) {
                throw new Error("Nie udało się zapisać danych konta.")
            }

            const updatedUser = await response.json()

            setAccountData(updatedUser)
            setMessage("Dane konta zostały zapisane.")
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return (
            <main className="account-page">
                <section className="account-card">
                    <h1>Dane konta</h1>
                    <p>Musisz się zalogować, aby zobaczyć dane konta.</p>

                    <Link to="/login" className="checkout-back-button">
                        Zaloguj się
                    </Link>
                </section>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="account-page">
                <h1>Dane konta</h1>
                <p>Ładowanie danych konta...</p>
            </main>
        )
    }

    return (
        <main className="account-page">
            <section className="account-card">
                <div className="account-card-header">
                    <div>
                        <p className="account-small-label">Moje konto</p>
                        <h1>Dane konta</h1>
                        <p>Zarządzaj podstawowymi danymi swojego profilu.</p>
                    </div>

                    <Link to="/" className="checkout-back-button">
                        Wróć do sklepu
                    </Link>
                </div>

                <div className="account-profile-section">
                    <div className="avatar-box">
                        <div className="avatar-circle">
                            {avatar ? (
                                <img src={avatar} alt="Zdjęcie profilowe" />
                            ) : (
                                <span>
                                    {(fullName || accountData?.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <label className="avatar-upload-button">
                            Wybierz zdjęcie
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>

                    <form className="account-form" onSubmit={handleSave}>
                        <label>
                            Imię i nazwisko
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Adres e-mail
                            <input
                                type="email"
                                value={accountData?.email || ""}
                                disabled
                            />
                        </label>

                        <label>
                            Rola
                            <input
                                type="text"
                                value={accountData?.role === "ADMIN" ? "Administrator" : "Klient"}
                                disabled
                            />
                        </label>

                        {message && <p className="success-text">{message}</p>}
                        {error && <p className="error-text">{error}</p>}

                        <button type="submit" disabled={saving}>
                            {saving ? "Zapisywanie..." : "Zapisz dane"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default AccountPage