import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const { name, barcode, price, stock } = req.body;
    const image = req.file?.path;
    if (!name || !price || !stock) {
        return res.status(400).json({ message: "Name, barcode, price and stock are required" });
    }
    if (!image) {
        return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = req.file
        ? `/uploads/products/${req.file.filename}`
        : null;

    if (!imagePath) {
        return res.status(400).json({ message: "Failed to upload image" });
    }

    const product = await prisma.product.create({ data: { name, barcode: barcode || null, price: parseFloat(price), stock: parseInt(stock), image: imagePath } });
    if (!product) {
        return res.status(500).json({ message: "Failed to create product" });
    }
    return res.status(201).json({ message: "Product created", product });
};

const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const search = req.query.search || "";
        const where =
            search !== ""
                ? {
                    name: {
                        contains: search, // ✅ MySQL ใช้ได้
                    },
                }
                : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: Number(offset),
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        return res.status(200).json({
            message: "Products found",
            products,
            total,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get products" });
    }
};

const getProductByBarcode = async (req, res) => {
    const { code } = req.params;

    const product = await prisma.product.findFirst({
        where: { barcode: code },
    });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
        message: "Product found",
        product,
    });
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, barcode, price, stock } = req.body;

        const imagePath = req.file
            ? `/uploads/products/${req.file.filename}`
            : undefined;
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                barcode: barcode || null,
                price: price ? parseFloat(price) : undefined,
                stock: stock ? parseInt(stock) : undefined,
                image: imagePath, // undefined = ไม่ update
            },
        });

        return res.status(200).json({
            message: "Product updated",
            product,
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Barcode already exists",
            });
        }

        return res.status(500).json({
            message: "Failed to update product",
        });
    }
};

export const ProductController = {
    createProduct,
    getProducts,
    getProductByBarcode,
    updateProduct,
};