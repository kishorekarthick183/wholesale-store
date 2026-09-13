"use client";

import { QRCodeSVG } from "qrcode.react";
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

    const upiId = process.env.NEXT_PUBLIC_UPI_ID;
    const upiName =
        process.env.NEXT_PUBLIC_UPI_NAME ?? "Wholesale Store";

    const upiUrl =
        `upi://pay?pa=${encodeURIComponent(upiId ?? "")}` +
        `&pn=${encodeURIComponent(upiName)}` +
        `&am=${encodeURIComponent(order.total)}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(`Order ${order.id}`)}`;

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

                    <div className="mt-6 flex justify-center rounded-lg bg-white p-6">
                    <QRCodeSVG
                        value={upiUrl}
                        size={240}
                    />
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Scan this QR code with any UPI app
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