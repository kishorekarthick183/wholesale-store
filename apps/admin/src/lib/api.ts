import type { Product } from "@wholesale/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}