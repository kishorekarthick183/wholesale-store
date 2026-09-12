import { prisma } from "@wholesale/db";
import { ApiError } from "../errors/api-error.js";
import type { Product } from "@wholesale/types";
import { CreateProductInput, UpdateProductInput } from "../validation/product.js";

function toProductResponse(product: {
    id: string;
    name: string;
    description: string | null;
    price: { toString(): string };
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}): Product {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}

export async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return products.map(toProductResponse);
}

export async function createProduct(data: CreateProductInput) : Promise<Product> {
    const product = await prisma.product.create({ data });
    return toProductResponse(product);
}

export async function updateProduct(
    id: string,
    data: UpdateProductInput
) : Promise<Product> {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const updatedProduct = await prisma.product.update({
        where: {
            id,
        },
        data,
    });

    return toProductResponse(updatedProduct);
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