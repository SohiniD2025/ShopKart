
import { useCallback, useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

import { fetchProducts } from "../services/api";

const Products = () => {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const loadProducts = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetchProducts({
                search,
                category
            });


            const uniqueProducts = response.data.products.filter(
                (product, index, products) =>
                    index === products.findIndex((candidate) =>
                        candidate.name === product.name &&
                        candidate.price === product.price &&
                        candidate.category === product.category
                    )
            );


            setProducts(uniqueProducts);

        } catch (err) {

            console.log(err);

            setError(
                "Something went wrong while loading products."
            );

        } finally {

            setLoading(false);

        }
    }, [category, search]);


    useEffect(() => {

        const timeoutId = window.setTimeout(() => {
            loadProducts();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };

    }, [loadProducts]);


    return (

        <main className="min-h-screen bg-stone-50 px-6 py-10">

            <div className="mx-auto max-w-7xl">


                {/* SEARCH + FILTER */}

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">

                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                    />


                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-stone-300 bg-white px-4 py-3"
                    >

                        <option value="">
                            All Categories
                        </option>

                        <option value="Electronics">
                            Electronics
                        </option>

                        <option value="Fashion">
                            Fashion
                        </option>

                        <option value="Books">
                            Books
                        </option>

                        <option value="Home">
                            Home
                        </option>

                    </select>

                </div>

                {loading && (

                    <p className="mt-10 text-center">
                        Loading products...
                    </p>

                )}

                {!loading && error && (

                    <p className="mt-10 text-center text-red-600">
                        {error}
                    </p>

                )}

                {!loading && !error && products.length === 0 && (

                    <p className="mt-10 text-center text-stone-500">
                        No products found.
                    </p>

                )}

                {!loading && !error && products.length > 0 && (

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {products.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                )}

            </div>

        </main>

    );
};
export default Products;

