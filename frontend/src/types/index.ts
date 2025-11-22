export interface Attendee {
  id: string;
  name: string;
  email: string;
  designation: string;
  registeredAt: string;
}

export interface AttendeeCount {
  count: number;
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  sessions: string[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  time: string;
  duration: string;
  speakerIds: string[];
}

export interface DesignationStats {
  designation: string;
  count: number;
}

export interface AdminStats {
  stats: DesignationStats[];
}

