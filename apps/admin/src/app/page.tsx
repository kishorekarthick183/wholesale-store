"use client";

import { useEffect, useState } from "react";
import type { Product } from "@wholesale/types";
import { createProduct, getProducts, deleteProduct } from "@/lib/api";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const product = await createProduct({
                name,
                description: description || undefined,
                price: Number(price),
                stock: Number(stock),
            });
            setProducts((current) => [product, ...current]);
            setName("");
            setDescription("");
            setPrice("");
            setStock("");
        } catch(error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    }
    
    async function handleDelete(id :string) {
        setError(null);

        try {
            await deleteProduct(id);

            setProducts((current) => current.filter((product) => product.id !== id));
        } catch (error) {
            setError("Failed to delete product");
        }
    }

    if (loading) {
        return <main className="p-8">Loading products...</main>;
    }

    if (error) {
        return <main className="p-8 text-red-600">{error}</main>;
    }

    return (
        <main className="p-8">
            <h1 className="mb-6 text-2xl font-bold">
                Product Management
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-8 max-w-md space-y-4 rounded-lg border p-6"
            >
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {submitting ? "Adding..." : "Add Product"}
                </button>

                <input
                    className="w-full rounded border p-2"
                    placeholder="Product name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <textarea
                    className="w-full rounded border p-2"
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <input
                    className="w-full rounded border p-2"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                />

                <input
                    className="w-full rounded border p-2"
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Add Product
                </button>
            </form>

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}
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
                            <p>Stock: {product.stock}</p>

                            <button
                                type="button"
                                onClick={() => handleDelete(product.id)}
                                className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}