import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const orderStatuses = [
    { value: "NEW", label: "Nowe" },
    { value: "PREPARING", label: "W przygotowaniu" },
    { value: "READY", label: "Gotowe" },
    { value: "SHIPPED", label: "Wysłane" },
    { value: "COMPLETED", label: "Zakończone" },
    { value: "CANCELLED", label: "Anulowane" }
]

function getStatusLabel(status) {
    const foundStatus = orderStatuses.find(item => item.value === status)
    return foundStatus ? foundStatus.label : status
}

function AdminOrdersPage({ user }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!user || user.role !== "ADMIN") {
            setLoading(false)
            return
        }

        fetch("http://localhost:8080/api/orders", {
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
                const sortedOrders = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                setOrders(sortedOrders)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [user])

    async function updateOrderStatus(orderId, newStatus) {
        try {
            setUpdatingOrderId(orderId)
            setError("")

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    status: newStatus
                })
            })

            if (!response.ok) {
                throw new Error("Nie udało się zmienić statusu zamówienia.")
            }

            const updatedOrder = await response.json()

            setOrders(previousOrders =>
                previousOrders.map(order =>
                    order.id === updatedOrder.id ? updatedOrder : order
                )
            )
        } catch (error) {
            setError(error.message)
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const filteredOrders = orders.filter(order => {
        const selectedStatusMatches =
            statusFilter === "ALL" || order.status === statusFilter

        const searchValue = searchTerm.trim().toLowerCase()

        if (!searchValue) {
            return selectedStatusMatches
        }

        const productsText = order.items
            ? order.items
                .map(item => item.product?.name || "")
                .join(" ")
                .toLowerCase()
            : ""

        const orderText = `
            ${order.id}
            ${order.customerName || ""}
            ${order.email || ""}
            ${order.phone || ""}
            ${order.address || ""}
            ${order.city || ""}
            ${order.postalCode || ""}
            ${order.status || ""}
            ${productsText}
        `.toLowerCase()

        return selectedStatusMatches && orderText.includes(searchValue)
    })

    if (!user) {
        return (
            <main className="admin-orders-page">
                <section className="admin-access-box">
                    <h1>Panel admina</h1>
                    <p>Musisz się zalogować jako administrator.</p>

                    <Link to="/login" className="checkout-back-button">
                        Zaloguj się
                    </Link>
                </section>
            </main>
        )
    }

    if (user.role !== "ADMIN") {
        return (
            <main className="admin-orders-page">
                <section className="admin-access-box">
                    <h1>Brak dostępu</h1>
                    <p>Ta strona jest dostępna tylko dla administratora.</p>

                    <Link to="/" className="checkout-back-button">
                        Wróć do sklepu
                    </Link>
                </section>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="admin-orders-page">
                <h1>Historia zamówień</h1>
                <p>Ładowanie zamówień...</p>
            </main>
        )
    }

    return (
        <main className="admin-orders-page">
            <section className="admin-orders-hero">
                <div>
                    <p className="admin-small-label">Panel administratora</p>
                    <h1>Historia zamówień</h1>
                    <p>Przeglądaj zamówienia klientów i aktualizuj ich status realizacji.</p>
                </div>

                <div className="admin-orders-stats">
                    <div>
                        <span>Liczba zamówień</span>
                        <strong>{orders.length}</strong>
                    </div>

                    <div>
                        <span>Nowe</span>
                        <strong>{orders.filter(order => order.status === "NEW").length}</strong>
                    </div>

                    <div>
                        <span>Wysłane</span>
                        <strong>{orders.filter(order => order.status === "SHIPPED").length}</strong>
                    </div>
                </div>
            </section>

            <section className="admin-filters">
                <div className="admin-search-box">
                    <label>Szukaj zamówienia</label>

                    <input
                        type="text"
                        placeholder="Wpisz imię, email, telefon, miasto, produkt..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <div className="admin-status-filters">
                    <button
                        className={statusFilter === "ALL" ? "active" : ""}
                        onClick={() => setStatusFilter("ALL")}
                    >
                        Wszystkie
                    </button>

                    {orderStatuses.map(status => (
                        <button
                            key={status.value}
                            className={statusFilter === status.value ? "active" : ""}
                            onClick={() => setStatusFilter(status.value)}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>

                <div className="admin-filter-summary">
                    <span>
                        Pokazano: <strong>{filteredOrders.length}</strong> z <strong>{orders.length}</strong> zamówień
                    </span>

                    {(searchTerm || statusFilter !== "ALL") && (
                        <button
                            className="clear-filters-button"
                            onClick={() => {
                                setSearchTerm("")
                                setStatusFilter("ALL")
                            }}
                        >
                            Wyczyść filtry
                        </button>
                    )}
                </div>
            </section>

            {error && (
                <p className="error-text admin-error">
                    {error}
                </p>
            )}

            {filteredOrders.length === 0 ? (
                <div className="empty-orders-box">
                    <h2>Brak pasujących zamówień</h2>
                    <p>Nie znaleziono zamówień dla wybranych filtrów.</p>
                </div>
            ) : (
                <div className="admin-orders-list">
                    {filteredOrders.map(order => (
                        <section className="admin-order-card" key={order.id}>
                            <div className="admin-order-top">
                                <div>
                                    <p className="admin-order-number">
                                        Zamówienie #{order.id}
                                    </p>

                                    <h2>{order.customerName}</h2>

                                    <p className="admin-order-date">
                                        {new Date(order.createdAt).toLocaleString("pl-PL")}
                                    </p>
                                </div>

                                <div className="admin-status-box">
                                    <span className={`admin-status-badge status-${order.status.toLowerCase()}`}>
                                        {getStatusLabel(order.status)}
                                    </span>

                                    <select
                                        value={order.status}
                                        disabled={updatingOrderId === order.id}
                                        onChange={(event) =>
                                            updateOrderStatus(order.id, event.target.value)
                                        }
                                    >
                                        {orderStatuses.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-order-info-grid">
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

                                <div>
                                    <span>Wartość zamówienia</span>
                                    <strong>{Number(order.totalPrice).toFixed(2)} zł</strong>
                                </div>
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="admin-order-products">
                                    <h3>Produkty</h3>

                                    {order.items.map(item => (
                                        <div className="admin-order-product-row" key={item.id}>
                                            <div>
                                                <strong>
                                                    {item.product?.name || "Produkt"}
                                                </strong>

                                                <p>
                                                    Rozmiar: {item.selectedSize} · Ilość: {item.quantity}
                                                </p>
                                            </div>

                                            <strong>
                                                {Number(item.priceAtPurchase).toFixed(2)} zł
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </main>
    )
}

export default AdminOrdersPage