import { api } from './client';

export async function getWeakAreas(userId: number) {
  const res = await api.get(`/users/${userId}/weak-areas`);
  return res.data.data;
}

export async function getProgress(userId: number) {
  const res = await api.get(`/users/${userId}/progress`);
  return res.data.data;
}
