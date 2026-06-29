import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function AdminProductsPage({ user }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [deletingProductId, setDeletingProductId] = useState(null)

    useEffect(() => {
        if (!user || user.role !== "ADMIN") {
            setLoading(false)
            return
        }

        fetch("http://localhost:8080/api/products")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać produktów.")
                }

                return response.json()
            })
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [user])

    const filteredProducts = products.filter(product => {
        const searchValue = searchTerm.trim().toLowerCase()

        if (!searchValue) {
            return true
        }

        const productText = `
            ${product.id}
            ${product.name || ""}
            ${product.brand || ""}
            ${product.category || ""}
            ${product.description || ""}
        `.toLowerCase()

        return productText.includes(searchValue)
    })

    const totalStock = products.reduce(
        (sum, product) => sum + Number(product.stockQuantity || 0),
        0
    )

    const lowStockProducts = products.filter(
        product => Number(product.stockQuantity || 0) > 0 && Number(product.stockQuantity || 0) <= 3
    ).length

    const outOfStockProducts = products.filter(
        product => Number(product.stockQuantity || 0) === 0
    ).length

    async function deleteProduct(productId) {
        const confirmed = window.confirm("Czy na pewno chcesz usunąć ten produkt?")

        if (!confirmed) {
            return
        }

        try {
            setDeletingProductId(productId)
            setError("")

            const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })

            if (!response.ok) {
                throw new Error("Nie udało się usunąć produktu. Produkt może być powiązany z zamówieniem.")
            }

            setProducts(previousProducts =>
                previousProducts.filter(product => product.id !== productId)
            )
        } catch (error) {
            setError(error.message)
        } finally {
            setDeletingProductId(null)
        }
    }

    function getStockLabel(stockQuantity) {
        const stock = Number(stockQuantity || 0)

        if (stock === 0) {
            return "Brak"
        }

        if (stock <= 3) {
            return "Niski stan"
        }

        return "Dostępny"
    }

    function getStockClass(stockQuantity) {
        const stock = Number(stockQuantity || 0)

        if (stock === 0) {
            return "stock-empty"
        }

        if (stock <= 3) {
            return "stock-low"
        }

        return "stock-ok"
    }

    if (!user) {
        return (
            <main className="admin-products-page">
                <section className="admin-access-box">
                    <h1>Panel produktów</h1>
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
            <main className="admin-products-page">
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
            <main className="admin-products-page">
                <h1>Produkty</h1>
                <p>Ładowanie produktów...</p>
            </main>
        )
    }

    return (
        <main className="admin-products-page">
            <section className="admin-products-hero">
                <div>
                    <p className="admin-small-label">Panel administratora</p>
                    <h1>Produkty</h1>
                    <p>Zarządzaj produktami, cenami i stanem magazynowym sklepu SneakerLab.</p>
                </div>

                <div className="admin-products-stats">
                    <div>
                        <span>Liczba produktów</span>
                        <strong>{products.length}</strong>
                    </div>

                    <div>
                        <span>Łączny stock</span>
                        <strong>{totalStock}</strong>
                    </div>

                    <div>
                        <span>Niski stan</span>
                        <strong>{lowStockProducts}</strong>
                    </div>

                    <div>
                        <span>Brak</span>
                        <strong>{outOfStockProducts}</strong>
                    </div>
                </div>
            </section>

            <section className="admin-products-toolbar">
                <div className="admin-product-search">
                    <label>Szukaj produktu</label>

                    <input
                        type="text"
                        placeholder="Wpisz nazwę, markę, kategorię..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <Link to="/admin/products/new" className="admin-add-product-button">
                    Dodaj produkt
                </Link>
            </section>

            {error && (
                <p className="error-text admin-error">
                    {error}
                </p>
            )}

            <div className="admin-products-summary">
                Pokazano: <strong>{filteredProducts.length}</strong> z <strong>{products.length}</strong> produktów

                {searchTerm && (
                    <button
                        className="clear-filters-button"
                        onClick={() => setSearchTerm("")}
                    >
                        Wyczyść
                    </button>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <section className="empty-orders-box">
                    <h2>Brak produktów</h2>
                    <p>Nie znaleziono produktów pasujących do wyszukiwania.</p>
                </section>
            ) : (
                <section className="admin-products-grid">
                    {filteredProducts.map(product => (
                        <article className="admin-product-card" key={product.id}>
                            <div className="admin-product-image">
                                <img src={product.imageUrl} alt={product.name} />
                            </div>

                            <div className="admin-product-content">
                                <div className="admin-product-main">
                                    <div>
                                        <p className="admin-product-id">
                                            Produkt #{product.id}
                                        </p>

                                        <h2>{product.name}</h2>

                                        <p className="admin-product-brand">
                                            {product.brand}
                                        </p>
                                    </div>

                                    <span className={`admin-stock-badge ${getStockClass(product.stockQuantity)}`}>
                                        {getStockLabel(product.stockQuantity)}
                                    </span>
                                </div>

                                <div className="admin-product-info-grid">
                                    <div>
                                        <span>Kategoria</span>
                                        <strong>{product.category}</strong>
                                    </div>

                                    <div>
                                        <span>Cena</span>
                                        <strong>{Number(product.price).toFixed(2)} zł</strong>
                                    </div>

                                    <div>
                                        <span>Stan</span>
                                        <strong>{product.stockQuantity} szt.</strong>
                                    </div>

                                    <div>
                                        <span>Rozmiary</span>
                                        <strong>
                                            {product.availableSizes && product.availableSizes.length > 0
                                                ? product.availableSizes.join(", ")
                                                : "Brak"}
                                        </strong>
                                    </div>
                                </div>

                                <p className="admin-product-description">
                                    {product.description}
                                </p>

                                <div className="admin-product-actions">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="admin-preview-button"
                                    >
                                        Podgląd
                                    </Link>

                                    <Link
                                        to={`/admin/products/edit/${product.id}`}
                                        className="admin-edit-button"
                                    >
                                        Edytuj
                                    </Link>

                                    <button
                                        className="admin-delete-button"
                                        disabled={deletingProductId === product.id}
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        {deletingProductId === product.id ? "Usuwanie..." : "Usuń"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    )
}

export default AdminProductsPage