import type { TeamMember } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../utils/errors';
import { deleteImageFiles } from './image.service';

export async function listTeam(): Promise<TeamMember[]> {
  return prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
}

export async function findTeamMemberById(id: string): Promise<TeamMember> {
  const item = await prisma.teamMember.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Сотрудник не найден');
  return item;
}

export interface TeamInput {
  name: string;
  role: string;
  bio?: string | null;
  imagePath: string;
  order: number;
}

export async function createTeamMember(data: TeamInput): Promise<TeamMember> {
  return prisma.teamMember.create({ data });
}

export async function updateTeamMember(id: string, data: Partial<TeamInput>): Promise<TeamMember> {
  return prisma.teamMember.update({ where: { id }, data });
}

export async function deleteTeamMember(id: string): Promise<void> {
  const item = await findTeamMemberById(id);
  await deleteImageFiles(item.imagePath);
  await prisma.teamMember.delete({ where: { id } });
}
