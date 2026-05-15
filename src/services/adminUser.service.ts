import bcrypt from 'bcrypt';
import type { AdminUser } from '@prisma/client';
import { prisma } from '../config/db';

const SALT_ROUNDS = 12;

export async function findByUsername(username: string): Promise<AdminUser | null> {
  return prisma.adminUser.findUnique({ where: { username } });
}

export async function verifyPassword(user: AdminUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function upsertAdmin(username: string, password: string): Promise<AdminUser> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
}
