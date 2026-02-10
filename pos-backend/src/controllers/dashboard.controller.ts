import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 📊 Summary
 */
const getSummary = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, today] = await Promise.all([
      prisma.sale.aggregate({
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.sale.aggregate({
        _sum: { total: true },
        _count: { id: true },
        where: { createdAt: { gte: todayStart } },
      }),
    ]);

    return {
      totalSales: total._sum.total || 0,
      totalOrders: total._count.id || 0,
      todaySales: today._sum.total || 0,
      todayOrders: today._count.id || 0,
    };
  } catch (err) {
    console.error("Dashboard summary error:", err);
    throw err;
  }
};

/**
 * 🏆 Top Products
 */
const getTopProducts = async () => {
  try {
    const items = await prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      where: { sale: { status: "ACTIVE" } },
      take: 5,
    });

    const products = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
      select: { id: true, name: true },
    });

    return items.map(i => ({
      productId: i.productId,
      name: products.find(p => p.id === i.productId)?.name || "-",
      qty: i._sum.qty || 0,
    }));
  } catch (err) {
    console.error("Top products error:", err);
    throw err;
  }
};

/**
 * 📈 Sales By Day
 */
const getSalesByDay = async () => {
  try {
    // ยอดขาย 7 วันล่าสุด
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sales = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        SUM(total) as total
      FROM sale
      WHERE createdAt >= ${sevenDaysAgo} AND createdAt <= ${new Date()} AND status = 'ACTIVE'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;
    return sales;
  } catch (err) {
    console.error("Sales by day error:", err);
    throw err;
  }
};

/**
 * 💰 Profit By Day
 */
const getProfitByDay = async () => {
  try {
    return await prisma.$queryRaw`
      SELECT 
        DATE(s.createdAt) as date,
        SUM((si.sellPrice - si.costPrice) * si.qty) as profit
      FROM sale s
      JOIN sale_items si ON si.saleId = s.id
      GROUP BY DATE(s.createdAt)
      ORDER BY date ASC
    `;
  } catch (err) {
    console.error("Profit by day error:", err);
    throw err;
  }
};

/**
 * 🧩 Sales By Category
 */
const getSalesByCategory = async () => {
  try {
    return await prisma.$queryRaw`
      SELECT 
        c.name as category,
        SUM(si.sellPrice * si.qty) as sales
      FROM sale_items si
      JOIN product p ON p.id = si.productId
      JOIN category c ON c.id = p.categoryId
      GROUP BY c.name
    `;
  } catch (err) {
    console.error("Sales by category error:", err);
    throw err;
  }
};

const getLowStock = async () => {
  try {
    return await prisma.product.findMany({
      where: { stock: { lt: 10 } },
    });
  } catch (err) {
    console.error("Low stock error:", err);
    throw err;
  }
};
const allsummary = async (req, res) => {
    try {
      const [
        summary,
        topProducts,
        salesByDay,
        profitByDay,
        salesByCategory,
        lowStock,
      ] = await Promise.all([
        getSummary(),
        getTopProducts(),
        getSalesByDay(),
        getProfitByDay(),
        getSalesByCategory(),
        getLowStock(),
      ]);
  
      return res.json({
        summary,
        topProducts,
        salesByDay,
        profitByDay,
        salesByCategory,
        lowStock,
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const DashboardController = { allsummary };