import axios from 'axios';
import type { Attendee, AttendeeCount, Speaker, Session, AdminStats, DesignationStats } from '../types';

// Use relative path for Vite proxy in development, or full URL for production
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add error interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Attendees
export const getAttendees = async (): Promise<Attendee[]> => {
  const response = await api.get<Attendee[]>('/attendees');
  return response.data;
};

export const getAttendeeCount = async (): Promise<number> => {
  const response = await api.get<AttendeeCount>('/attendees/count');
  return response.data.count;
};

export const createAttendee = async (data: {
  name: string;
  email: string;
  designation: string;
}): Promise<Attendee> => {
  const response = await api.post<Attendee>('/attendees', data);
  return response.data;
};

// Speakers
export const getSpeakers = async (): Promise<Speaker[]> => {
  const response = await api.get<Speaker[]>('/speakers');
  return Array.isArray(response.data) ? response.data : [];
};

export const createSpeaker = async (data: {
  name: string;
  bio: string;
  avatar: string;
  sessions: string[];
}): Promise<Speaker> => {
  const response = await api.post<Speaker>('/admin/speakers', data);
  return response.data;
};

export const updateSpeaker = async (
  id: string,
  data: Partial<{
    name: string;
    bio: string;
    avatar: string;
    sessions: string[];
  }>
): Promise<Speaker> => {
  const response = await api.put<Speaker>(`/admin/speakers/${id}`, data);
  return response.data;
};

export const deleteSpeaker = async (id: string): Promise<void> => {
  await api.delete(`/admin/speakers/${id}`);
};

// Sessions
export const getSessions = async (): Promise<Session[]> => {
  const response = await api.get<Session[]>('/sessions');
  return Array.isArray(response.data) ? response.data : [];
};

export const createSession = async (data: {
  title: string;
  description: string;
  time: string;
  duration: string;
  speakerIds: string[];
}): Promise<Session> => {
  const response = await api.post<Session>('/admin/sessions', data);
  return response.data;
};

export const updateSession = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    time: string;
    duration: string;
    speakerIds: string[];
  }>
): Promise<Session> => {
  const response = await api.put<Session>(`/admin/sessions/${id}`, data);
  return response.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/admin/sessions/${id}`);
};

// Admin
export const adminLogin = async (password: string): Promise<void> => {
  await api.post('/admin/login', { password });
};

export const getAdminStats = async (): Promise<DesignationStats[]> => {
  const response = await api.get<AdminStats>('/admin/stats');
  return response.data.stats;
};

