import { Request, Response } from "express";
import bcrypt from "bcrypt";
// import prisma from "../prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { signToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Email or password incorrect" });
    }

    if (user.status !== "ACTIVE") {
        return res.status(403).json({ message: "User inactive" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Email or password incorrect" });
    }

    const token = signToken({
        id: user.id,
        role: user.role,
    });
    
    if(!token) {
        return res.status(500).json({ message: "Failed to generate token" });
    }
    
    return res.status(200).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};

export const me = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    if (user.status !== "ACTIVE") {
        return res.status(403).json({ message: "User inactive" });
    }
    return res.status(200).json({ message: "User found", user });
};

export const logout = async (_req: Request, res: Response) => {
    return res.status(200).json({ message: "Logged out" });
};

export const AuthController = {
    login,
    me,
    logout,
};