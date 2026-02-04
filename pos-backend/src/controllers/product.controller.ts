import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const { name, barcode, price, stock, image } = req.body;
    const product = await prisma.product.create({ data: { name, barcode, price, stock, image } });
    if(!product) {
        return res.status(500).json({ message: "Failed to create product" });
    }
    return res.status(201).json({ message: "Product created", product });
};

const getProducts = async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const products = await prisma.product.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: {
            createdAt: "desc",
        },
    });
    if(!products) {
        return res.status(500).json({ message: "Failed to get products" });
    }
    return res.status(200).json({ message: "Products found", products, total: products.length });
};

const getProductByBarcode = async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { barcode: req.params.code },
    });
    if(!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product found", product });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, barcode, price, stock } = req.body;
    const product = await prisma.product.update({ where: { id: parseInt(id) }, data: { name, barcode, price, stock } });
    if(!product) {
        return res.status(500).json({ message: "Failed to update product" });
    }
    return res.status(200).json({ message: "Product updated", product });
};

export const ProductController = {
    createProduct,
    getProducts,
    getProductByBarcode,
    updateProduct,
};