import type { Product } from "@wholesale/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const result: { data: Product[] } = await response.json();

    return result.data;
}

export interface CreateOrderInput {
    name: string;
    phone: string;
    items: {
        id: string;
        productId: string;
        quantity: number;
        price: string;
        product: {
            name: string;
        };
    }[];
}

export interface Order {
    id: string;
    name: string;
    phone: string;
    total: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    items: {
        id: string;
        productId: string;
        quantity: number;
        price: string;
    }[];
}

export async function createOrder(
    data: CreateOrderInput,
): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create order");
    }

    const result: { data: Order } = await response.json();

    return result.data;
}

export async function getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }

    const result: { data: Order } = await response.json();

    return result.data;
}

export async function submitPayment(
    id: string,
): Promise<Order> {
    const response = await fetch(
        `${API_URL}/orders/${id}/payment-submitted`,
        {
            method: "POST",
        },
    );

    if (!response.ok) {
        throw new Error("Failed to submit payment");
    }

    const result: { data: Order } = await response.json();

    return result.data;
}