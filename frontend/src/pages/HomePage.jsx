import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard.jsx"

function HomePage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać produktów")
                }

                return response.json()
            })
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setError("Błąd połączenia z backendem")
                setLoading(false)
            })
    }, [])

    return (
        <main>
            <section className="hero">
                <div>
                    <p className="label">Strona e-commerce</p>

                    <h1>
                        Odkryj sneakersy stworzone do codziennego stylu.
                    </h1>

                    <p>
                        Odkryj modne sneakersy na każdą okazję.<br/>
                        Wybierz model dopasowany do swojego stylu.
                    </p>

                    <a className="main-button" href="#products">
                        Zobacz produkty
                    </a>
                </div>

                <div className="hero-box">
                    👟
                </div>
            </section>

            <section className="products-section" id="products">
                <h2>Buty</h2>

                {loading && <p>Ładowanie produktów...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default HomePage