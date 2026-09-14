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
  orderNumber: number;
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
    product: {
      name: string
    }
  }[];
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

class UnauthenticatedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthenticatedError";
  }
}

export { UnauthenticatedError };

async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401) {
    throw new UnauthenticatedError();
  }

  return response;
}

export async function login(
  email: string,
  password: string,
): Promise<CurrentUser> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const result: { data: CurrentUser } = await response.json();
  return result.data;
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    throw new UnauthenticatedError();
  }

  const result: { data: CurrentUser } = await response.json();
  return result.data;
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch("/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();
  return result.data;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  const response = await apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  const result = await response.json();
  return result.data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await apiFetch(`/products/${id}`, {
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
  const response = await apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  const result = await response.json();
  return result.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch("/orders");

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result: { data: Order[] } = await response.json();

  return result.data;
}

export async function getOrder(id: string): Promise<Order> {
  const response = await apiFetch(`/orders/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  const result: { data: Order } = await response.json();

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
  const response = await apiFetch(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  const result: { data: Order } = await response.json();

  return result.data;
}

export async function verifyPayment(id: string): Promise<Order> {
  return updateOrderStatus(id, "PAID");
}
