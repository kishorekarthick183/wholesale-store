"use client";

import { useEffect, useState } from "react";
import { createOrder, type CreateOrderInput } from "../../lib/api";

interface CartItem {
    product: {
        id: string;
        name: string;
        price: string;
    };
    quantity: number;
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");

        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const data: CreateOrderInput = {
                name,
                phone,
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const order = await createOrder(data);

            localStorage.removeItem("cart");

            window.location.href = `/payment/${order.id}`;
        } catch {
            setError("Failed to create order");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <h1 className="mb-6 text-3xl font-bold">
                Checkout
            </h1>

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium">
                        Name
                    </label>

                    <input
                        className="w-full rounded border p-2"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Phone
                    </label>

                    <input
                        className="w-full rounded border p-2"
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Creating Order..." : "Continue"}
                </button>
            </form>
        </main>
    );
}