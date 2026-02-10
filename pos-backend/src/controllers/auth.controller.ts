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

export const AuthController = {
    login,
};