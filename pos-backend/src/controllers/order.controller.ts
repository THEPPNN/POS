import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const orders = await prisma.sale.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: {
            createdAt: "desc",
        },
    });
    if(!orders) {
        return res.status(500).json({ message: "Failed to get orders" });
    }
    return res.status(200).json({ message: "Orders found", orders, total: orders.length });
};

const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await prisma.sale.findUnique({ where: { id: parseInt(id) } });
    if(!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order found", order });
};
const createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    let total = 0;
    items.forEach(i => total += i.qty * i.price);

    const sale = await prisma.sale.create({
        data: {
            total,
            userId,
            items: {
                create: items.map(i => ({
                    productId: i.productId,
                    qty: i.qty,
                    price: i.price,
                })),
            },
        },
    });

    if(!sale) {
        return res.status(500).json({ message: "Failed to create order" });
    }

    for (const i of items) {
        await prisma.product.update({
            where: { id: i.productId },
            data: { stock: { decrement: i.qty } },
        });
    }

    return res.status(201).json({ message: "Order created", sale });
};

export const OrderController = {
    createOrder,
    getOrders,
    getOrderById,
};