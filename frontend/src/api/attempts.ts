import { api } from './client';
import type { Attempt, Feedback, ApiResponse } from '../types';

export async function createAttempt(problemId: number, submission: string): Promise<Attempt | null> {
  const { data } = await api.post<ApiResponse<Attempt>>('/attempts', { problemId, submission });
  return data.data || null;
}

export async function getAttempt(id: number): Promise<Attempt | null> {
  const { data } = await api.get<ApiResponse<Attempt>>(`/attempts/${id}`);
  return data.data || null;
}

export async function getAttemptStatus(id: number): Promise<{ id: number; status: string } | null> {
  const { data } = await api.get<ApiResponse<{ id: number; status: string }>>(`/attempts/${id}/status`);
  return data.data || null;
}

export async function getFeedback(attemptId: number): Promise<Feedback | null> {
  const { data } = await api.get<ApiResponse<Feedback>>(`/attempts/${attemptId}/feedback`);
  return data.data || null;
}

export async function retryAttempt(id: number): Promise<Attempt | null> {
  const { data } = await api.post<ApiResponse<Attempt>>(`/attempts/${id}/retry`);
  return data.data || null;
}

export async function compareAttempts(id1: number, id2: number) {
  const { data } = await api.get(`/attempts/compare/${id1}/${id2}`);
  return data.data;
}
