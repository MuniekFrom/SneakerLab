import { useState } from "react"
import { Link } from "react-router-dom"

const countryCodes = [
    { code: "+48", country: "Polska", maxLength: 9 },
    { code: "+49", country: "Niemcy", maxLength: 11 },
    { code: "+44", country: "Wielka Brytania", maxLength: 10 },
    { code: "+420", country: "Czechy", maxLength: 9 },
    { code: "+421", country: "Słowacja", maxLength: 9 },
    { code: "+33", country: "Francja", maxLength: 9 },
    { code: "+34", country: "Hiszpania", maxLength: 9 },
    { code: "+39", country: "Włochy", maxLength: 10 },
    { code: "+31", country: "Holandia", maxLength: 9 },
    { code: "+1", country: "USA / Kanada", maxLength: 10 }
]

function CheckoutPage({ cartItems, clearCart, user }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        phonePrefix: "+48",
        phone: "",
        address: "",
        city: "",
        postalCode: ""
    })

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    function handleInputChange(event) {
        const { name, value } = event.target

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }))
    }

    function handlePhoneChange(event) {
        const onlyNumbers = event.target.value.replace(/\D/g, "")

        const selectedCountry = countryCodes.find(
            country => country.code === formData.phonePrefix
        )

        const maxLength = selectedCountry ? selectedCountry.maxLength : 15

        setFormData(previousData => ({
            ...previousData,
            phone: onlyNumbers.slice(0, maxLength)
        }))
    }

    async function handleOrderSubmit(event) {
        event.preventDefault()

        if (!user) {
            setError("Musisz się zalogować, aby złożyć zamówienie.")
            return
        }

        if (cartItems.length === 0) {
            setError("Koszyk jest pusty.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(formData.email)) {
            setError("Podaj poprawny adres e-mail.")
            return
        }

        const selectedCountry = countryCodes.find(
            country => country.code === formData.phonePrefix
        )

        if (selectedCountry && formData.phone.length !== selectedCountry.maxLength) {
            setError(
                `Numer telefonu dla kraju ${selectedCountry.country} powinien mieć ${selectedCountry.maxLength} cyfr.`
            )
            return
        }

        const orderData = {
            customerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: `${formData.phonePrefix} ${formData.phone}`,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                selectedSize: item.selectedSize
            }))
        }

        console.log("Wysyłane zamówienie:", orderData)

        try {
            setLoading(true)
            setError("")
            setMessage("")

            const response = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            })

            if (!response.ok) {
                throw new Error("Nie udało się złożyć zamówienia.")
            }

            clearCart()
            setMessage("Zamówienie zostało złożone poprawnie.")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (cartItems.length === 0 && !message) {
        return (
            <main className="checkout-page">
                <h1>Koszyk jest pusty</h1>
                <p>Dodaj produkt do koszyka, aby złożyć zamówienie.</p>

                <Link to="/" className="checkout-back-button">
                    Wróć do sklepu
                </Link>
            </main>
        )
    }

    if (!user && !message) {
        return (
            <main className="checkout-page">
                <h1>Musisz się zalogować</h1>
                <p>Aby złożyć zamówienie, zaloguj się na konto klienta.</p>

                <div className="checkout-auth-actions">
                    <Link to="/login" className="checkout-back-button">
                        Zaloguj się
                    </Link>

                    <Link to="/register" className="checkout-register-link">
                        Utwórz konto
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="checkout-page">
            <h1>Finalizacja zamówienia</h1>

            {message && (
                <div className="success-box">
                    <h2>{message}</h2>
                    <p>Dziękujemy za zakupy w SneakerLab.</p>

                    <Link to="/" className="checkout-back-button">
                        Wróć do sklepu
                    </Link>
                </div>
            )}

            {!message && (
                <>
                    <section className="checkout-summary">
                        <h2>Twoje zamówienie</h2>

                        {cartItems.map(item => (
                            <div
                                className="checkout-item"
                                key={`${item.productId}-${item.selectedSize}`}
                            >
                                <img src={item.imageUrl} alt={item.name} />

                                <div>
                                    <h3>{item.name}</h3>
                                    <p>{item.brand}</p>
                                    <p>Rozmiar: {item.selectedSize}</p>
                                    <p>Ilość: {item.quantity}</p>
                                    <strong>{item.price} zł</strong>
                                </div>
                            </div>
                        ))}

                        <div className="checkout-total">
                            <span>Razem:</span>
                            <strong>{totalPrice.toFixed(2)} zł</strong>
                        </div>
                    </section>

                    <form className="checkout-form" onSubmit={handleOrderSubmit}>
                        <h2>Dane do zamówienia</h2>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="Imię"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Nazwisko"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Adres e-mail"
                            value={formData.email}
                            onChange={handleInputChange}
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            required
                        />

                        <div className="phone-row">
                            <select
                                name="phonePrefix"
                                value={formData.phonePrefix}
                                onChange={handleInputChange}
                                required
                            >
                                {countryCodes.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.country} {country.code}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Numer telefonu"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>

                        <input
                            type="text"
                            name="address"
                            placeholder="Adres dostawy"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />

                        <input
                            type="text"
                            name="city"
                            placeholder="Miasto"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />

                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Kod pocztowy"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="payment-info">
                            <strong>Płatność:</strong> zamówienie testowe bez płatności online
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={loading}
                        >
                            {loading ? "Składanie zamówienia..." : "Złóż zamówienie"}
                        </button>
                    </form>
                </>
            )}
        </main>
    )
}

export default CheckoutPage