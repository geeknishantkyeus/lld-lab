import { api } from './client';
import type { Problem, ApiResponse } from '../types';

export async function getProblems(): Promise<Problem[]> {
  const { data } = await api.get<ApiResponse<Problem[]>>('/problems');
  return data.data || [];
}

export async function getProblem(id: number): Promise<Problem | null> {
  const { data } = await api.get<ApiResponse<Problem>>(`/problems/${id}`);
  return data.data || null;
}
