import { Link } from "react-router-dom"

function ProductCard({ product }) {
    return (
        <article className="product-card">
            <div className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                ) : (
                    <span>👟</span>
                )}
            </div>

            <p className="product-category">{product.category}</p>
            <h3>{product.name}</h3>
            <p className="product-brand">{product.brand}</p>
            <p className="product-stock">Dostępne sztuki: {product.stockQuantity}</p>

            <div className="product-footer">
                <strong>{product.price} zł</strong>

                <Link className="details-button" to={`/products/${product.id}`}>
                    Zobacz buty
                </Link>
            </div>
        </article>
    )
}

export default ProductCard