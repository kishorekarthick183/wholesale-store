import bcrypt from "bcryptjs";
import { prisma } from "@wholesale/db";
import { ApiError } from "../errors/api-error.js";
import type { LoginInput } from "../validation/auth.js";

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
