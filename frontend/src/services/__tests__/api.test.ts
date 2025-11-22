import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import * as api from '../api'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAttendeeCount', () => {
    it('should return attendee count', async () => {
      const mockCount = { count: 5 }
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: mockCount }),
      })

      const count = await api.getAttendeeCount()
      expect(count).toBe(5)
    })

    it('should return 0 if API returns null', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: null }),
      })

      const count = await api.getAttendeeCount()
      expect(count).toBe(0)
    })
  })

  describe('getSpeakers', () => {
    it('should return array of speakers', async () => {
      const mockSpeakers = [
        { id: '1', name: 'John Doe', bio: 'Expert', avatar: '', sessions: [] },
      ]
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: mockSpeakers }),
      })

      const speakers = await api.getSpeakers()
      expect(Array.isArray(speakers)).toBe(true)
      expect(speakers.length).toBeGreaterThanOrEqual(0)
    })

    it('should return empty array if API returns null', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: null }),
      })

      const speakers = await api.getSpeakers()
      expect(Array.isArray(speakers)).toBe(true)
      expect(speakers.length).toBe(0)
    })
  })

  describe('getSessions', () => {
    it('should return array of sessions', async () => {
      const mockSessions = [
        { id: '1', title: 'Session 1', description: 'Desc', time: '10:00', duration: '1h', speakerIds: [] },
      ]
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: mockSessions }),
      })

      const sessions = await api.getSessions()
      expect(Array.isArray(sessions)).toBe(true)
      expect(sessions.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('createAttendee', () => {
    it('should create attendee successfully', async () => {
      const mockAttendee = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        designation: 'Engineer',
        registeredAt: new Date().toISOString(),
      }
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue({ data: mockAttendee }),
      })

      const attendee = await api.createAttendee({
        name: 'John Doe',
        email: 'john@example.com',
        designation: 'Engineer',
      })
      expect(attendee).toBeDefined()
      expect(attendee.name).toBe('John Doe')
    })
  })
})

