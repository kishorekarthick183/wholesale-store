import { prisma } from "@wholesale/db";
import { ApiError } from "../errors/api-error.js";

export async function getProducts() {
    return prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
}) {
    return prisma.product.create({
        data,
    });
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
    return prisma.product.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteProduct(id: string) {
    return prisma.product.delete({
        where: {
            id,
        },
    });
}