import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

function AdminProductFormPage({ user }) {
    const { id } = useParams()
    const navigate = useNavigate()

    const isEditMode = Boolean(id)
    const [uploadingImage, setUploadingImage] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
        stockQuantity: ""
    })

    const [loading, setLoading] = useState(isEditMode)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!isEditMode) {
            return
        }

        fetch(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać produktu.")
                }

                return response.json()
            })
            .then(data => {
                setFormData({
                    name: data.name || "",
                    brand: data.brand || "",
                    category: data.category || "",
                    price: data.price || "",
                    description: data.description || "",
                    imageUrl: data.imageUrl || "",
                    stockQuantity: data.stockQuantity || ""
                })

                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [id, isEditMode])

    function handleInputChange(event) {
        const { name, value } = event.target

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }))
    }

    function getImageSrc(imageUrl) {
        if (!imageUrl) {
            return ""
        }

        if (imageUrl.startsWith("/uploads")) {
            return `http://localhost:8080${imageUrl}`
        }

        return imageUrl
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0]

        if (!file) {
            return
        }

        const uploadData = new FormData()
        uploadData.append("file", file)

        try {
            setUploadingImage(true)
            setError("")

            const response = await fetch("http://localhost:8080/api/uploads/product-image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                },
                body: uploadData
            })

            if (!response.ok) {
                throw new Error("Nie udało się przesłać zdjęcia.")
            }

            const data = await response.json()

            setFormData(previousData => ({
                ...previousData,
                imageUrl: data.imageUrl
            }))
        } catch (error) {
            setError(error.message)
        } finally {
            setUploadingImage(false)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!user || user.role !== "ADMIN") {
            setError("Brak uprawnień administratora.")
            return
        }

        const productData = {
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            price: Number(formData.price),
            description: formData.description,
            imageUrl: formData.imageUrl,
            stockQuantity: Number(formData.stockQuantity)
        }

        try {
            setSaving(true)
            setError("")

            const url = isEditMode
                ? `http://localhost:8080/api/products/${id}`
                : "http://localhost:8080/api/products"

            const method = isEditMode ? "PUT" : "POST"

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            })

            if (!response.ok) {
                throw new Error(
                    isEditMode
                        ? "Nie udało się zapisać zmian produktu."
                        : "Nie udało się dodać produktu."
                )
            }

            navigate("/admin/products")
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return (
            <main className="admin-product-form-page">
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
            <main className="admin-product-form-page">
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
            <main className="admin-product-form-page">
                <h1>{isEditMode ? "Edycja produktu" : "Dodaj produkt"}</h1>
                <p>Ładowanie danych produktu...</p>
            </main>
        )
    }

    return (
        <main className="admin-product-form-page">
            <section className="admin-product-form-card">
                <div className="admin-product-form-header">
                    <div>
                        <p className="admin-small-label">Panel administratora</p>

                        <h1>
                            {isEditMode ? "Edytuj produkt" : "Dodaj produkt"}
                        </h1>

                        <p>
                            {isEditMode
                                ? "Zmień podstawowe dane produktu w sklepie."
                                : "Dodaj nowy produkt do katalogu sklepu."}
                        </p>
                    </div>

                    <Link to="/admin/products" className="checkout-back-button">
                        Wróć do produktów
                    </Link>
                </div>

                <form className="admin-product-form" onSubmit={handleSubmit}>
                    <div className="admin-product-form-grid">
                        <label>
                            Nazwa produktu
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Np. Nike Air Max Pulse"
                                required
                            />
                        </label>

                        <label>
                            Marka
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                placeholder="Np. Nike"
                                required
                            />
                        </label>

                        <label>
                            Kategoria
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="Np. Lifestyle"
                                required
                            />
                        </label>

                        <label>
                            Cena
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                placeholder="599.99"
                                required
                            />
                        </label>

                        <label>
                            Stan magazynowy
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                min="0"
                                step="1"
                                placeholder="8"
                                required
                            />
                        </label>

                        <label>
                            Zdjęcie produktu
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>

                        <label>
                            Ścieżka zdjęcia
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="/uploads/products/nazwa-zdjecia.jpg"
                                required
                            />
                        </label>

                        {uploadingImage && (
                            <p className="upload-info">
                                Przesyłanie zdjęcia...
                            </p>
                        )}
                    </div>

                    <label className="admin-product-description-field">
                        Opis produktu
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Opis produktu..."
                            rows="5"
                            required
                        />
                    </label>

                    {formData.imageUrl && (
                        <div className="admin-product-preview">
                            <span>Podgląd zdjęcia</span>
                            <img src={getImageSrc(formData.imageUrl)} alt="Podgląd produktu" />
                        </div>
                    )}

                    {error && <p className="error-text admin-error">{error}</p>}

                    <div className="admin-product-form-actions">
                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Zapisywanie..."
                                : isEditMode
                                    ? "Zapisz zmiany"
                                    : "Dodaj produkt"}
                        </button>

                        <Link to="/admin/products">
                            Anuluj
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default AdminProductFormPage