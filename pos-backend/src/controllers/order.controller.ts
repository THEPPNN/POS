import { PaymentMethod, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const search = req.query.search || "";
        const where: any = {};
        if (search !== "") {
            where.total = {
                gte: parseFloat(search),
            };
        }
        where.status = "ACTIVE";
        const [orders, total] = await Promise.all([
            prisma.sale.findMany({
                where,
                skip: Number(offset),
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.sale.count({ where }),
        ]);

        if (!orders) {
            return res.status(500).json({ message: "Failed to get orders" });
        }
        return res.status(200).json({ message: "Orders found", orders, total: orders.length });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get orders" });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await prisma.sale.findUnique({ where: { id: parseInt(id) }, include: { items: { include: { product: true } } } });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order found", order });
};
const createOrder = async (req, res) => {
    const { items } = req.body;
    const { method, received, change } = req.body;
    const userId = req.user.id;

    let total = 0;
    items.forEach(i => total += i.qty * i.price);

    if (items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
    }
    // check stock
    let stockNotEnough = [];
    for (const i of items) {
        const product = await prisma.product.findUnique({ where: { id: i.productId } });
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }
        if (product.stock < i.qty) {
            stockNotEnough.push(product.name + " คงเหลือ " + product.stock + " ชิ้น");
        }
    }
    if (stockNotEnough.length > 0) {
        return res.status(400).json({ message: stockNotEnough.join("<br>") });
    }

    const sale = await prisma.sale.create({
        data: {
            total,
            userId,
            method: method as PaymentMethod,
            received,
            change,
            items: {
                create: items.map(i => ({
                    productId: i.productId,
                    qty: i.qty,
                    sellPrice: i.price,
                })),
            },
        },
    });

    if (!sale) {
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

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    const order = await prisma.sale.findUnique({ where: { id: parseInt(id) }, include: { items: { include: { product: true } } } });
    if (!order) {
        return res.status(500).json({ message: "Failed to delete order" });
    }
    for (const i of order?.items || []) {
        await prisma.product.update({
            where: { id: i.productId },
            data: { stock: { increment: i.qty } },
        });
    }
    let updatedOrder = await prisma.sale.update({ where: { id: parseInt(id) }, data: { status: "INACTIVE" } as any });
    if (!updatedOrder) {
        return res.status(500).json({ message: "Failed to update order status" });
    }
    return res.status(200).json({ message: "Order deleted", order });
};

export const OrderController = {
    createOrder,
    getOrders,
    getOrderById,
    deleteOrder
};