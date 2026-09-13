"use client";

import { useEffect, useState } from "react";
import type { Product } from "@wholesale/types";
import { createProduct, getProducts, deleteProduct, updateProduct,  getOrders, type Order } from "@/lib/api";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);

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
        async function fetchData() {
            try {
                const [products, orders] = await Promise.all([
                    getProducts(),
                    getOrders(),
                ]);

                setProducts(products);
                setOrders(orders);
            } catch {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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

    function startEditing(product: Product) {
        setEditingId(product.id);
        setEditName(product.name);
        setEditDescription(product.description ?? "");
        setEditPrice(product.price);
        setEditStock(String(product.stock));
    }

    async function handleUpdate(id: string) {
        setError(null);

        try {
            const product = await updateProduct(id, {
                name: editName,
                description: editDescription || undefined,
                price: Number(editPrice),
                stock: Number(editStock),
            });

            setProducts((current) => current.map((item) => item.id === id ? product : item));

            setEditingId(null);
        } catch {
            setError("Failed to update product");
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
                    min="0.01"
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
                            {editingId === product.id ? (
                                <div className="space-y-3">
                                    <input
                                        className="w-full rounded border p-2"
                                        value={editName}
                                        onChange={(event) =>
                                            setEditName(event.target.value)
                                        }
                                    />

                                    <textarea
                                        className="w-full rounded border p-2"
                                        value={editDescription}
                                        onChange={(event) =>
                                            setEditDescription(event.target.value)
                                        }
                                    />

                                    <input
                                        className="w-full rounded border p-2"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editPrice}
                                        onChange={(event) =>
                                            setEditPrice(event.target.value)
                                        }
                                    />

                                    <input
                                        className="w-full rounded border p-2"
                                        type="number"
                                        min="0"
                                        value={editStock}
                                        onChange={(event) =>
                                            setEditStock(event.target.value)
                                        }
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdate(product.id)}
                                            className="rounded bg-black px-3 py-1 text-white"
                                        >
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="rounded border px-3 py-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-semibold">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="text-gray-600">
                                            {product.description}
                                        </p>
                                    )}

                                    <p>Price: ₹{product.price}</p>
                                    <p>Stock: {product.stock}</p>

                                    <div className="mt-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(product)}
                                            className="rounded border px-3 py-1"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product.id)}
                                            className="rounded bg-red-600 px-3 py-1 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">
                Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">
                    No orders yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-lg border p-4"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">
                                        {order.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.phone}
                                    </p>
                                </div>

                                <span className="font-semibold">
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                    Order ID
                                </p>

                                <p className="break-all font-mono text-sm">
                                    {order.id}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-between border-t pt-4">
                                <span>
                                    {order.items.reduce(
                                        (total, item) =>
                                            total + item.quantity,
                                        0,
                                    )}{" "}
                                    items
                                </span>

                                <span className="font-bold">
                                    ₹{order.total}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
        </main>
    );
}