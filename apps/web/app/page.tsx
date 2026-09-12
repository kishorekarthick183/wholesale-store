"use client";

import { useEffect, useState } from "react";
import type { Product } from "@wholesale/types";
import { getProducts } from "../lib/api";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<Product[]>([]);

    function addToCart(product: Product) {
        setCart((current) => [...current, product]);
    }

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts();

                setProducts(data);
            } catch {
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <main className="p-8">
                Loading products...
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-8">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Wholesale Store
                </h1>

                <p className="font-medium">
                    Cart: {cart.length}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="rounded-lg border p-4 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">
                                {product.name}
                            </h2>

                            {product.description && (
                                <p className="mt-2 text-gray-600">
                                    {product.description}
                                </p>
                            )}

                            <p className="mt-4 font-medium">
                                ₹{product.price}
                            </p>

                            <p className="text-sm text-gray-500">
                                {product.stock} in stock
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50 w-full"
                        >
                            {product.stock === 0 ? "Out of stock" : "Add to Cart"}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}
