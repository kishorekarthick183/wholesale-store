"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, type Order } from "../../../lib/api";

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PAYMENT_SUBMITTED":
      return "Payment Submitted";

    case "PAID":
      return "Paid";

    case "PREPARING":
      return "Preparing";

    case "READY":
      return "Ready";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

export default function OrderDetailsPage() {
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
    return <main className="p-8">Loading order...</main>;
  }

  if (error || !order) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>

      <p className="mt-2 text-gray-500">Order ID: {order.id}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Customer</h2>

          <div className="mt-4 space-y-2">
            <p>
              <span className="font-medium">Name:</span> {order.name}
            </p>

            <p>
              <span className="font-medium">Phone:</span> {order.phone}
            </p>
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Status</h2>

          <p className="mt-4 text-lg font-medium">
            {getStatusLabel(order.status)}
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Items</h2>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-medium">₹{item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <span className="font-semibold">Total</span>

          <span className="text-xl font-bold">₹{order.total}</span>
        </div>
      </section>
    </main>
  );
}
