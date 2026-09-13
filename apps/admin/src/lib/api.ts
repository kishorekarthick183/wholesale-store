import type { Product } from "@wholesale/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    stock: number;
}

export interface UpdateProductInput {
    name: string;
    description?: string;
    price: number;
    stock: number;
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

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    return result.data;
}

export async function createProduct(
    data: CreateProductInput,
): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    const result = await response.json();
    return result.data;
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
}

export async function updateProduct(
    id: string,
    data: UpdateProductInput,
): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    const result = await response.json();
    return result.data;
}

export async function getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`);

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    const result: { data: Order[] } = await response.json();

    return result.data;
}

export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "PAYMENT_SUBMITTED"
    | "CANCELLED";

export async function updateOrderStatus(
    id: string,
    status: OrderStatus,
): Promise<Order> {
    const response = await fetch(
        `${API_URL}/orders/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status,
            }),
        },
    );

    if (!response.ok) {
        throw new Error("Failed to update order status");
    }

    const result: { data: Order } = await response.json();

    return result.data;
}

export async function verifyPayment(
    id: string,
): Promise<Order> {
    return updateOrderStatus(id, "PAID");
}