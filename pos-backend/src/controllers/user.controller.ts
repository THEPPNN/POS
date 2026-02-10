import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  const { limit, offset, search } = req.query;
  const where: any = {};
  if (search) {
    where.name = { contains: search as string };
  }
  // where.status = { not: "DELETED" }
  const users = await prisma.user.findMany({
    skip: Number(offset),
    take: Number(limit),
    where: {
      ...where,
      status: { not: "DELETED" },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!users) {
    return res.status(500).json({ message: "Failed to get users" });
  }
  return res.status(200).json({ message: "Users found", users });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User found", user });
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role,
    },
  });

  if (!user) {
    return res.status(500).json({ message: "Failed to create user" });
  }
  return res.status(201).json({ message: "User created", user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role, status } = req.body;
  let data: any = { name, email, role, status: status || "ACTIVE" };
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    data.password = hash;
  }
  const user = await prisma.user.update({ where: { id: Number(id) }, data });
  if (!user) {
    return res.status(500).json({ message: "Failed to update user" });
  }
  return res.status(200).json({ message: "User updated", user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.update({ where: { id: Number(id) }, data: { status: "DELETED" } });
  if (!user) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
  return res.status(200).json({ message: "User deleted", user });
};

export const UserController = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};