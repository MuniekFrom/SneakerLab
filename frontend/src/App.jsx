import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx"
import CheckoutPage from "./pages/CheckoutPage.jsx"
import CartPanel from "./components/CartPanel.jsx"
import "./App.css"

function App() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("sneakerlab_cart")
        return savedCart ? JSON.parse(savedCart) : []
    })

    const [isCartOpen, setIsCartOpen] = useState(false)

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

    return (
        <div className="app">
            <header className="navbar">
                <Link to="/" className="logo">
                    Sneaker<span>Lab</span>
                </Link>

                <nav>
                    <Link to="/">Produkty</Link>
                    <a href="#">Nowości</a>
                    <a href="#">Kontakt</a>
                </nav>

                <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                    Koszyk: {cartCount}
                </button>
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
                        />
                    }
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