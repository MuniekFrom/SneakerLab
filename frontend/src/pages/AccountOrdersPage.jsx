import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function getStatusLabel(status) {
    switch (status) {
        case "NEW":
            return "Nowe"
        case "PREPARING":
            return "W przygotowaniu"
        case "READY":
            return "Gotowe"
        case "SHIPPED":
            return "Wysłane"
        case "COMPLETED":
            return "Zakończone"
        case "CANCELLED":
            return "Anulowane"
        default:
            return status
    }
}

function AccountOrdersPage({ user }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        fetch("http://localhost:8080/api/orders/my", {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać zamówień.")
                }

                return response.json()
            })
            .then(data => {
                setOrders(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [user])

    if (!user) {
        return (
            <main className="account-orders-page">
                <h1>Ostatnie zamówienia</h1>
                <p>Musisz się zalogować, aby zobaczyć swoje zamówienia.</p>

                <Link to="/login" className="checkout-back-button">
                    Zaloguj się
                </Link>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="account-orders-page">
                <h1>Ostatnie zamówienia</h1>
                <p>Ładowanie zamówień...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="account-orders-page">
                <h1>Ostatnie zamówienia</h1>
                <p className="error-text">{error}</p>
            </main>
        )
    }

    return (
        <main className="account-orders-page">
            <div className="account-orders-header">
                <div>
                    <h1>Ostatnie zamówienia</h1>
                    <p>Lista zamówień przypisanych do Twojego konta.</p>
                </div>

                <Link to="/" className="checkout-back-button">
                    Wróć do sklepu
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders-box">
                    <h2>Brak zamówień</h2>
                    <p>Nie masz jeszcze żadnych zamówień.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <section className="order-card" key={order.id}>
                            <div className="order-card-top">
                                <div>
                                    <h2>Zamówienie #{order.id}</h2>
                                    <p>{new Date(order.createdAt).toLocaleString("pl-PL")}</p>
                                </div>

                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            <div className="order-details-grid">
                                <div>
                                    <span>Klient</span>
                                    <strong>{order.customerName}</strong>
                                </div>

                                <div>
                                    <span>Email</span>
                                    <strong>{order.email}</strong>
                                </div>

                                <div>
                                    <span>Telefon</span>
                                    <strong>{order.phone}</strong>
                                </div>

                                <div>
                                    <span>Adres</span>
                                    <strong>
                                        {order.address}, {order.city}, {order.postalCode}
                                    </strong>
                                </div>
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="order-items">
                                    <h3>Produkty</h3>

                                    {order.items.map(item => (
                                        <div className="order-item-row" key={item.id}>
                                            <div>
                                                <strong>
                                                    {item.product?.name || "Produkt"}
                                                </strong>
                                                <p>
                                                    Rozmiar: {item.selectedSize} | Ilość: {item.quantity}
                                                </p>
                                            </div>

                                            <strong>
                                                {Number(item.priceAtPurchase).toFixed(2)} zł
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="order-card-bottom">
                                <span>Razem</span>
                                <strong>{Number(order.totalPrice).toFixed(2)} zł</strong>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    )
}

export default AccountOrdersPage