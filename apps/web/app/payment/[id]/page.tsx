"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, type Order } from "../../../lib/api";

export default function PaymentPage() {
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
                Loading payment...
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="mx-auto max-w-lg p-8">
                <h1 className="text-2xl font-bold">
                    Order not found
                </h1>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <h1 className="text-3xl font-bold">
                Payment
            </h1>

            <p className="mt-2 text-gray-600">
                Order #{order.id}
            </p>

            <div className="mt-8 rounded-lg border p-6">
                <p className="text-sm text-gray-500">
                    Amount to pay
                </p>

                <p className="mt-1 text-3xl font-bold">
                    ₹{order.total}
                </p>

                <div className="mt-8">
                    <p className="font-semibold">
                        Pay using UPI
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                        Scan the QR code provided by the shop
                        and pay the exact amount.
                    </p>
                </div>

                <div className="mt-6 rounded-lg bg-gray-100 p-6 text-center">
                    <p className="text-sm text-gray-500">
                        UPI payment
                    </p>

                    <p className="mt-2 font-semibold">
                        ₹{order.total}
                    </p>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                After payment, keep your order number ready.
            </p>
        </main>
    );
}