"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@wholesale/types";
import { getProducts } from "../lib/api";

interface CartItem {
    product: Product;
    quantity: number;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");

        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    function addToCart(product: Product) {
        setCart((current) => {
            const existingItem = current.find(
                (item) => item.product.id === product.id,
            );

            if (existingItem) {
                return current.map((item) =>
                    item.product.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item,
                );
            }

            // Nope it isn't present in the product to add in cart
            return [
                ...current,
                {
                    product,
                    quantity: 1,
                },
            ];
        });
    }

    function increaseQuantity(productId: string) {
        setCart((current) =>
            current.map((item) =>
                item.product.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item,
            ),
        );
    }

    function decreaseQuantity(productId: string) {
        setCart((current) =>
            current
                .map((item) =>
                    item.product.id === productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
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

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

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

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.product.price) * item.quantity,
        0,
    );

    return (
        <main className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Wholesale Store
                </h1>

                <p className="font-medium">
                    Cart: {cart.reduce((total, item) => total + item.quantity, 0)}
                </p>
            </div>

            {/* Products Grid */}
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

            <section className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">
                    Cart
                </h2>

                {cart.length === 0 ? (
                    <p className="text-gray-500">
                        Your cart is empty.
                    </p>
                ) : (
                    <div className="space-y-3">
                       {cart.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {item.product.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        ₹{item.product.price} each
                                    </p>
                                </div>

                               <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => decreaseQuantity(item.product.id)}
                                        className="h-8 w-8 rounded border"
                                    >
                                        −
                                    </button>

                                    <span className="w-6 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => increaseQuantity(item.product.id)}
                                        className="h-8 w-8 rounded border"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-4 block w-full rounded bg-black px-4 py-2 text-center text-white"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
