import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const summary = async (_req, res) => {
    const totalSales = await prisma.sale.aggregate({
        _sum: { total: true },
        _count: true,
    });

    const todaySales = await prisma.sale.aggregate({
        _sum: { total: true },
        where: {
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    });

    res.json({
        totalSales: totalSales._sum.total || 0,
        totalOrders: totalSales._count,
        todaySales: todaySales._sum.total || 0,
    });
};

const topProducts = async (_req, res) => {
    const items = await prisma.saleItem.groupBy({
        by: ["productId"],
        _sum: { qty: true },
        orderBy: {
            _sum: { qty: "desc" },
        },
        take: 5,
    });

    res.json(items);
};

export const DashboardController = {
    summary,
    topProducts,
};