"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, type Order } from "../../../lib/api";

export default function OrderPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const data = await getOrder(orderId);

                setOrder(data);
            } catch {
                setError("Order not found");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <main className="mx-auto max-w-lg p-8">
                Loading order...
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-bold">
                    Order not found
                </h1>

                <p className="mt-2 text-gray-600">
                    We couldn't find this order.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">
                    Order Placed
                </h1>

                <p className="mt-2 text-gray-600">
                    Your order has been successfully placed.
                </p>
            </div>

            <div className="mt-8 rounded-lg border p-6">
                <p className="text-sm text-gray-500">
                    Order Number
                </p>

                <p className="mt-1 break-all font-mono text-sm">
                    {order.id}
                </p>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Status
                    </p>

                    <p className="mt-1 font-semibold">
                        {order.status}
                    </p>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Customer
                    </p>

                    <p className="mt-1">
                        {order.name}
                    </p>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Items
                    </p>

                    <div className="mt-2 space-y-2">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {item.quantity} × Product
                                </span>

                                <span>
                                    ₹
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total</span>

                    <span>₹{order.total}</span>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                Please show your order number to the shop staff.
            </p>
        </main>
    );
}