import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

function getImageSrc(imageUrl) {
    if (!imageUrl) {
        return ""
    }

    if (imageUrl.startsWith("/uploads")) {
        return `http://localhost:8080${imageUrl}`
    }

    return imageUrl
}

function ProductDetailsPage({ addToCart }) {
    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState("")
    const [selectedSize, setSelectedSize] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać produktu")
                }

                return response.json()
            })
            .then(data => {
                setProduct(data)

                if (data.imageUrls && data.imageUrls.length > 0) {
                    setSelectedImage(data.imageUrls[0])
                } else {
                    setSelectedImage(data.imageUrl)
                }

                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setError("Błąd pobierania produktu")
                setLoading(false)
            })
    }, [id])

    if (loading) {
        return <main className="details-page">Ładowanie produktu...</main>
    }

    if (error) {
        return <main className="details-page error-message">{error}</main>
    }

    if (!product) {
        return <main className="details-page">Nie znaleziono produktu.</main>
    }

    const galleryImages =
        product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls
            : [product.imageUrl]

    const productSizes =
        product.sizes && product.sizes.length > 0
            ? product.sizes
            : product.availableSizes && product.availableSizes.length > 0
                ? product.availableSizes.map(size => ({
                    id: size,
                    sizeNumber: size,
                    stockQuantity: null
                }))
                : []

    function getSelectedSizeStock() {
        if (!selectedSize || !productSizes || productSizes.length === 0) {
            return null
        }

        const selectedSizeData = productSizes.find(
            size => Number(size.sizeNumber) === Number(selectedSize)
        )

        if (!selectedSizeData || selectedSizeData.stockQuantity === null || selectedSizeData.stockQuantity === undefined) {
            return null
        }

        return Number(selectedSizeData.stockQuantity)
    }

    function handleAddToCart() {
        if (!selectedSize) {
            alert("Wybierz rozmiar produktu.")
            return
        }

        const selectedSizeData = productSizes.find(
            size => Number(size.sizeNumber) === Number(selectedSize)
        )

        if (
            selectedSizeData &&
            selectedSizeData.stockQuantity !== null &&
            selectedSizeData.stockQuantity !== undefined &&
            Number(selectedSizeData.stockQuantity) <= 0
        ) {
            alert("Ten rozmiar jest niedostępny.")
            return
        }

        addToCart(product, selectedSize)
    }

    return (
        <main className="details-page">
            <Link className="back-link" to="/">
                ← Wróć do produktów
            </Link>

            <section className="details-layout">
                <div className="details-gallery">
                    <div className="main-product-image">
                        <img src={getImageSrc(selectedImage)} alt={product.name} />
                    </div>

                    <div className="thumbnail-list">
                        {galleryImages.map((imageUrl, index) => (
                            <button
                                key={index}
                                className={selectedImage === imageUrl ? "thumbnail active" : "thumbnail"}
                                onClick={() => setSelectedImage(imageUrl)}
                            >
                                <img src={getImageSrc(imageUrl)} alt={`${product.name} ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="details-info">
                    <p className="product-category">{product.category}</p>

                    <h1>{product.name}</h1>

                    <p className="details-brand">{product.brand}</p>

                    <strong className="details-price">
                        {Number(product.price).toFixed(2)} zł
                    </strong>

                    <p className="details-description">
                        {product.description}
                    </p>

                    <div className="details-params">
                        <div>
                            <span>
                                {selectedSize ? `Dostępność rozmiaru ${selectedSize}` : "Dostępność"}
                            </span>

                            <strong>
                                {selectedSize && getSelectedSizeStock() !== null
                                    ? `${getSelectedSizeStock()} szt.`
                                    : `${product.stockQuantity} szt.`}
                            </strong>
                        </div>

                        <div>
                            <span>Kategoria</span>
                            <strong>{product.category}</strong>
                        </div>

                        <div>
                            <span>Marka</span>
                            <strong>{product.brand}</strong>
                        </div>
                    </div>

                    <div className="sizes-section">
                        <h3>Wybierz rozmiar</h3>

                        <div className="sizes-grid">
                            {productSizes.length > 0 ? (
                                productSizes.map(size => {
                                    const isUnavailable =
                                        size.stockQuantity !== null &&
                                        size.stockQuantity !== undefined &&
                                        Number(size.stockQuantity) <= 0

                                    return (
                                        <button
                                            key={size.id || size.sizeNumber}
                                            className={
                                                Number(selectedSize) === Number(size.sizeNumber)
                                                    ? "size-button active"
                                                    : "size-button"
                                            }
                                            disabled={isUnavailable}
                                            onClick={() => setSelectedSize(size.sizeNumber)}
                                        >
                                            {size.sizeNumber}
                                        </button>
                                    )
                                })
                            ) : (
                                <p>Brak rozmiarów dla tego produktu.</p>
                            )}
                        </div>
                        
                    </div>

                    <button
                        className="add-cart-details-button"
                        onClick={handleAddToCart}
                    >
                        Dodaj do koszyka
                    </button>
                </div>
            </section>
        </main>
    )
}

export default ProductDetailsPage