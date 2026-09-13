import { prisma } from "@wholesale/db";
import { ApiError } from "../errors/api-error.js";
import type { CreateOrderInput, UpdateOrderStatusInput } from "../validation/order.js";

export async function createOrder(data: CreateOrderInput) {
    return prisma.$transaction(async (tx) => {
        // Choose particular products based on order id in orders
        // If not found in prisma will return null
        const products = await Promise.all(
            data.items.map((item) =>
                tx.product.findUnique({
                    where: {
                        id: item.productId,
                    },
                }),
            ),
        );

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const item = data.items[i];

            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            if (product.stock < item.quantity) {
                throw new ApiError(
                    400,
                    `Insufficient stock for ${product.name}`,
                );
            }
        }

        let total = 0;

        const orderItems = data.items.map((item, index) => {
            const product = products[index]!;

            total += Number(product.price) * item.quantity;

            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const order = await tx.order.create({
            data: {
                name: data.name,
                phone: data.phone,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
            },
        });

        for (const item of data.items) {
            await tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return order;
    });
}

export async function getOrder(id: string) {
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            items: true,
        },
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return order;
}

export async function getOrders() {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            items: true,
        },
    });
}

export async function updateOrderStatus(
    id: string,
    status: UpdateOrderStatusInput["status"],
) {
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (!isValidStatusTransition(order.status, status)) {
        throw new ApiError(
            400,
            `Cannot change order status from ${order.status} to ${status}`,
        );
    }

    return prisma.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
        include: {
            items: true,
        },
    });
}

function isValidStatusTransition(
    current: string,
    next: string,
): boolean {
    const transitions: Record<string, string[]> = {
        PENDING: ["PAYMENT_SUBMITTED", "CANCELLED"],
        PAYMENT_SUBMITTED: ["PAID", "CANCELLED"],
        PAID: ["PREPARING"],
        PREPARING: ["READY"],
        READY: ["COMPLETED"],
        COMPLETED: [],
        CANCELLED: [],
    };

    return transitions[current]?.includes(next) ?? false;
}