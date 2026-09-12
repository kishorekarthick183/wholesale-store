"use client";

import { useEffect, useState } from "react";
import type { Product } from "@wholesale/types";
import { getProducts } from "@/lib/api";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        return <main className="p-8">Loading products...</main>;
    }

    if (error) {
        return <main className="p-8 text-red-600">{error}</main>;
    }

    return (
        <main className="p-8">
            <h1 className="mb-6 text-2xl font-bold">
                Products
            </h1>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-lg border p-4"
                        >
                            <h2 className="font-semibold">
                                {product.name}
                            </h2>

                            {product.description && (
                                <p className="text-gray-600">
                                    {product.description}
                                </p>
                            )}

                            <p>Price: ₹{product.price}</p>
                            <p>Stock: {product.stock}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}