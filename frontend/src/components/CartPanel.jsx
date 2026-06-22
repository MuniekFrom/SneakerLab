import { Link } from "react-router-dom"

function CartPanel({
                       isOpen,
                       closeCart,
                       cartItems,
                       increaseQuantity,
                       decreaseQuantity,
                       removeFromCart
                   }) {
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <>
            {isOpen && <div className="cart-overlay" onClick={closeCart}></div>}

            <aside className={isOpen ? "cart-panel open" : "cart-panel"}>
                <div className="cart-header">
                    <h2>Koszyk</h2>

                    <button onClick={closeCart}>
                        ✕
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="empty-cart">
                        Koszyk jest pusty.
                    </p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div
                                    className="cart-item"
                                    key={`${item.productId}-${item.selectedSize}`}
                                >
                                    <img src={item.imageUrl} alt={item.name} />

                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        <p>{item.brand}</p>
                                        <p>Rozmiar: {item.selectedSize}</p>

                                        <div className="cart-price-row">
                                            <strong>
                                                {item.price} zł
                                            </strong>

                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(item.productId, item.selectedSize)
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(item.productId, item.selectedSize)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className="remove-button"
                                            onClick={() =>
                                                removeFromCart(item.productId, item.selectedSize)
                                            }
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div>
                                <span>Razem</span>
                                <strong>{totalPrice.toFixed(2)} zł</strong>
                            </div>

                            <Link to="/checkout" className="checkout-button" onClick={closeCart}>
                                Przejdź do zamówienia
                            </Link>
                        </div>
                    </>
                )}
            </aside>
        </>
    )
}

export default CartPanel