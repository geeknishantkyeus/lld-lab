import { api } from './client';

export async function getWeakAreas(userId: number) {
  const { data } = await api.get(`/users/${userId}/weak-areas`);
  return data.data;
}

export async function getProgress(userId: number) {
  const { data } = await api.get(`/users/${userId}/progress`);
  return data.data;
}
