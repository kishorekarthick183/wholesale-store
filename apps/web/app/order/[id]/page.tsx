"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, type Order } from "../../../lib/api";

function getStatusMessage(status: string) {
    switch (status) {
        case "PENDING":
            return "Waiting for payment";

        case "PAYMENT_SUBMITTED":
            return "Payment submitted — waiting for shop confirmation";

        case "PAID":
            return "Payment confirmed";

        case "PREPARING":
            return "Your order is being prepared";

        case "READY":
            return "Your order is ready for pickup";

        case "COMPLETED":
            return "Order completed";

        case "CANCELLED":
            return "Order cancelled";

        default:
            return status;
    }
}

export default function OrderPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function isFinalStatus(status: string) {
        return (
            status === "COMPLETED" ||
            status === "CANCELLED"
        );
    }
    useEffect(() => {
        async function fetchOrder() {
            try {
                const data = await getOrder(orderId);

                setOrder(data);
                setError(null);

                return data;
            } catch {
                setError("Order not found");
                return null;
            } finally {
                setLoading(false);
            }
        }

        let interval: ReturnType<typeof setInterval> | undefined;

        async function startPolling() {
            const data = await fetchOrder();

            if (data && !isFinalStatus(data.status)) {
                interval = setInterval(async () => {
                    const updatedOrder = await fetchOrder();

                    if (
                        updatedOrder &&
                        isFinalStatus(updatedOrder.status)
                    ) {
                        if (interval) {
                            clearInterval(interval);
                        }
                    }
                }, 5000);
            }
        }

        startPolling();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
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
            <h1 className="text-3xl font-bold">
                Order Confirmed
            </h1>

            <p className="mt-2 text-gray-600">
                Order #{order.orderNumber}
            </p>

            <div className="mt-8 rounded-lg border p-6">
                <p className="text-sm text-gray-500">
                    Order status
                </p>

                <p className="mt-1 text-xl font-semibold">
                    {getStatusMessage(order.status)}
                </p>
            </div>

            <div className="mt-6 rounded-lg border p-6">
                <h2 className="text-lg font-semibold">
                    Order details
                </h2>

                <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.product.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium">
                                ₹{item.price}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between border-t pt-4">
                    <span className="font-semibold">
                        Total
                    </span>

                    <span className="text-xl font-bold">
                        ₹{order.total}
                    </span>
                </div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-100 p-6">
                <p className="font-semibold">
                    What happens next?
                </p>

                <p className="mt-2 text-sm text-gray-600">
                    Keep your order number ready. The shop staff
                    will verify your payment and prepare your order.
                </p>
            </div>
        </main>
    );
}