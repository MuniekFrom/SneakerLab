import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx"
import CheckoutPage from "./pages/CheckoutPage.jsx"
import CartPanel from "./components/CartPanel.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import AccountOrdersPage from "./pages/AccountOrdersPage.jsx"
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AccountPage from "./pages/AccountPage.jsx"
import AdminProductsPage from "./pages/AdminProductsPage.jsx"
import AdminProductFormPage from "./pages/AdminProductFormPage.jsx"
import "./App.css"

function App() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("sneakerlab_cart")
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("sneakerlab_user")
        return savedUser ? JSON.parse(savedUser) : null
    })

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem("sneakerlab_cart", JSON.stringify(cartItems))
    }, [cartItems])

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    function addToCart(product, selectedSize) {
        if (!selectedSize) {
            alert("Wybierz rozmiar przed dodaniem do koszyka.")
            return
        }

        setCartItems(previousItems => {
            const existingItem = previousItems.find(
                item => item.productId === product.id && item.selectedSize === selectedSize
            )

            if (existingItem) {
                return previousItems.map(item =>
                    item.productId === product.id && item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [
                ...previousItems,
                {
                    productId: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    selectedSize: selectedSize,
                    quantity: 1
                }
            ]
        })

        setIsCartOpen(true)
    }

    function increaseQuantity(productId, selectedSize) {
        setCartItems(previousItems =>
            previousItems.map(item =>
                item.productId === productId && item.selectedSize === selectedSize
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )
    }

    function decreaseQuantity(productId, selectedSize) {
        setCartItems(previousItems =>
            previousItems
                .map(item =>
                    item.productId === productId && item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        )
    }

    function removeFromCart(productId, selectedSize) {
        setCartItems(previousItems =>
            previousItems.filter(
                item => !(item.productId === productId && item.selectedSize === selectedSize)
            )
        )
    }

    function clearCart() {
        setCartItems([])
        localStorage.removeItem("sneakerlab_cart")
    }

    function handleLogin(userData) {
        setUser(userData)
        localStorage.setItem("sneakerlab_user", JSON.stringify(userData))
    }

    function handleLogout() {
        setUser(null)
        localStorage.removeItem("sneakerlab_user")
    }

    return (
        <div className="app">
            <header className="navbar">
                <Link to="/" className="logo">
                    Sneaker<span>Lab</span>
                </Link>

                <nav className="main-nav">
                    <Link to="/">Produkty</Link>
                    <a href="#">Nowości</a>
                    <a href="#">Kontakt</a>
                </nav>

                <div className="navbar-actions">
                    <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                        Koszyk: {cartCount}
                    </button>

                    {user ? (
                        <div className="account-menu">
                            <button
                                className="account-button"
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                Konto
                            </button>

                            {isAccountMenuOpen && (
                                <div className="account-dropdown">
                                    <div className="account-dropdown-header">
                                        <strong>
                                            {user.role === "ADMIN" ? "Administrator" : "Klient"}
                                        </strong>
                                        <span>{user.email}</span>
                                    </div>

                                    {user.role === "CUSTOMER" && (
                                        <>
                                            <Link
                                                to="/account/orders"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                            >
                                                Ostatnie zamówienia
                                            </Link>

                                            <Link
                                                to="/account"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                            >
                                                Dane konta
                                            </Link>
                                        </>
                                    )}

                                    {user.role === "ADMIN" && (
                                        <>
                                            <Link
                                                to="/admin/orders"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                            >
                                                Historia zamówień
                                            </Link>

                                            <Link
                                                to="/admin/products"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                            >
                                                Produkty
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        className="dropdown-logout-button"
                                        onClick={() => {
                                            handleLogout()
                                            setIsAccountMenuOpen(false)
                                        }}
                                    >
                                        Wyloguj
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login">Logowanie</Link>
                            <Link to="/register">Rejestracja</Link>
                        </div>
                    )}
                </div>
            </header>

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/products/:id"
                    element={<ProductDetailsPage addToCart={addToCart} />}
                />

                <Route
                    path="/checkout"
                    element={
                        <CheckoutPage
                            cartItems={cartItems}
                            clearCart={clearCart}
                            user={user}
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage onLogin={handleLogin} />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage onLogin={handleLogin} />}
                />

                <Route
                    path="/account/orders"
                    element={<AccountOrdersPage user={user} />}
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrdersPage user={user} />}
                />

                <Route
                    path="/account"
                    element={<AccountPage user={user} />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProductsPage user={user} />}
                />

                <Route
                    path="/admin/products/new"
                    element={<AdminProductFormPage user={user} />}
                />

                <Route
                    path="/admin/products/edit/:id"
                    element={<AdminProductFormPage user={user} />}
                />
            </Routes>

            <CartPanel
                isOpen={isCartOpen}
                closeCart={() => setIsCartOpen(false)}
                cartItems={cartItems}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
            />
        </div>
    )
}

export default App