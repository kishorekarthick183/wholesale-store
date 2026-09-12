import { prisma } from "@wholesale/db";
import { ApiError } from "../errors/api-error.js";
import type { Product } from "@wholesale/types";

export async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }));
}

export async function createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
}) : Promise<Product> {
    const product = await prisma.product.create({ data });
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }
}

export async function updateProduct(
    id: string,
    data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
    },
) {
     const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return prisma.product.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return prisma.product.delete({
        where: {
            id,
        },
    });
}