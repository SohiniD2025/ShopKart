import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";

const ProductDetails = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoading(true);

                const response = await fetchProductById(id);

                setProduct(response.data.product);

            } catch (err) {

                console.log(err);

                setError(
                    "Something went wrong while loading the product."
                );

            } finally {

                setLoading(false);

            }
        };

        loadProduct();

    }, [id]);


    if (loading) {
        return (
            <p className="mt-10 text-center">
                Loading product...
            </p>
        );
    }


    if (error) {
        return (
            <p className="mt-10 text-center text-red-600">
                {error}
            </p>
        );
    }


    if (!product) {
        return (
            <p className="mt-10 text-center">
                Product not found.
            </p>
        );
    }


    return (
        <main className="min-h-screen bg-stone-50 px-6 py-10">

            <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2">

                <img
                    src={product.image}
                    alt={product.name}
                    className="h-[500px] w-full rounded-2xl object-cover"
                />


                <div className="flex flex-col justify-center">

                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                        {product.category}
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-stone-900">
                        {product.name}
                    </h1>

                    <p className="mt-6 text-stone-600">
                        {product.description}
                    </p>

                    <p className="mt-6 text-3xl font-bold text-emerald-700">
                        ₹{product.price}
                    </p>

                    <p className="mt-3 text-stone-500">
                        {product.stock} units available
                    </p>

                    <button
                        className="mt-8 rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </main>
    );
};

export default ProductDetails;
