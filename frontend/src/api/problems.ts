import { api } from './client';
import type { Problem, ApiResponse } from '../types';

export async function getProblems(): Promise<Problem[]> {
  const res = await api.get<ApiResponse<Problem[]>>('/problems');
  return res.data.data || [];
}

export async function getProblem(id: number): Promise<Problem | null> {
  const res = await api.get<ApiResponse<Problem>>(`/problems/${id}`);
  return res.data.data || null;
}
