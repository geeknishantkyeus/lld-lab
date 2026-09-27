import { api } from './client';
import type { Attempt, Feedback, ApiResponse } from '../types';

export async function createAttempt(problemId: number, submission: string): Promise<Attempt | null> {
  const res = await api.post<ApiResponse<Attempt>>('/attempts', { problemId, submission });
  return res.data.data || null;
}

export async function getAttempt(id: number): Promise<Attempt | null> {
  const res = await api.get<ApiResponse<Attempt>>(`/attempts/${id}`);
  return res.data.data || null;
}

export async function getAttemptStatus(id: number): Promise<{ id: number; status: string } | null> {
  const res = await api.get<ApiResponse<{ id: number; status: string }>>(`/attempts/${id}/status`);
  return res.data.data || null;
}

export async function getFeedback(attemptId: number): Promise<Feedback | null> {
  const res = await api.get<ApiResponse<Feedback>>(`/attempts/${attemptId}/feedback`);
  return res.data.data || null;
}

export async function retryAttempt(id: number): Promise<Attempt | null> {
  const res = await api.post<ApiResponse<Attempt>>(`/attempts/${id}/retry`);
  return res.data.data || null;
}

export async function compareAttempts(id1: number, id2: number) {
  const res = await api.get(`/attempts/compare/${id1}/${id2}`);
  return res.data.data;
}
