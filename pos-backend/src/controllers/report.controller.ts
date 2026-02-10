import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

const getReport = async (req: Request, res: Response) => {
  try {
    const { from, to, page = 1, perPage = 20, search = "" } = req.query;
    const where: any = {};

    // date filter
    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from as string);
      }
      if (to) {
        const end = new Date(to as string);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // search by bill id
    if (search && !isNaN(Number(search))) {
      where.id = Number(search);
    }

    const pageNum = Number(page);
    const perPageNum = Number(perPage);

    const data = await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * perPageNum,
      take: perPageNum,
    });

    const summary = await prisma.sale.aggregate({
      where,
      _sum: { total: true },
      _count: { _all: true },
    });

    res.status(200).json({
      data,
      total: summary._count._all, // ✅ จำนวนแถวทั้งหมด
      summary: {
        total_sales: summary._sum.total || 0,
        count: summary._count._all,
      },
    });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Report error" });
  }
};

const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await prisma.sale.findUnique({
      where: { id: Number(id) },
      include: { items: { include: { product: true } } },
    });

    return res.status(200).json({ message: "Report found", sale });
  } catch (err) {
    console.error("Report error:", err);
    return res.status(500).json({ message: "Report error" });
  }
};

export const exportExcel = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from as string);
      }
      if (to) {
        const end = new Date(to as string);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    // ===== Columns =====
    sheet.columns = [
      { header: "วันที่", key: "createdAt", width: 18 },
      { header: "เลขบิล", key: "id", width: 10 },
      { header: "ยอดรวม", key: "total", width: 12 },
      { header: "วิธีชำระ", key: "method", width: 15 },
      { header: "พนักงาน", key: "employee", width: 15 },
      { header: "รายการสินค้า", key: "item", width: 30 },
      { header: "จำนวน", key: "qty", width: 10 },
      { header: "ราคา", key: "price", width: 12 },
    ];

    // ทำ header ตัวหนา
    sheet.getRow(1).font = { bold: true };

    // ===== Data =====
    sales.forEach((sale) => {
      // แถวบิลหลัก
      const billRow = sheet.addRow({
        createdAt: sale.createdAt.toLocaleDateString("th-TH"),
        id: sale.id,
        total: sale.total,
        method: sale.method,
        employee: sale.user?.name || "-",
      });
      billRow.font = { bold: true };

      // แถวรายการสินค้า
      sale.items.forEach((item) => {
        const itemRow = sheet.addRow({
          item: `- ${item.product?.name ?? "สินค้า"}`,
          qty: item.qty,
          price: item.sellPrice,
        });
        itemRow.alignment = { indent: 2 };
      });

      // เว้นบรรทัด
      sheet.addRow({});
    });

    // ===== Response =====
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export Excel error:", err);
    res.status(500).json({ message: "Export Excel error" });
  }
};

export const ReportController = { getReport, getReportById, exportExcel };