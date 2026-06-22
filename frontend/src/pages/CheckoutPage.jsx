import { useState } from "react"
import { Link } from "react-router-dom"

function CheckoutPage({ cartItems, clearCart }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
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

    async function handleOrderSubmit(event) {
        event.preventDefault()

        if (cartItems.length === 0) {
            setError("Koszyk jest pusty.")
            return
        }

        const orderData = {
            customerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
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
                    "Content-Type": "application/json"
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
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Telefon"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />

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