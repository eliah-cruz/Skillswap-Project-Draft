export interface Message {
  id: number;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

export type Match = {
  id: number; 
  name: string;
  teaching: string;
  needs: string;
  rating: number;
  avatar: string;
  status: 'Online' | 'Away' | 'Offline';
  category: string;
  title: string;
  image?: string;
  availability?: string;
};

export type Category = {
  title: string;
  desc: string;
  color: string;
  text: string;
  icon: string;
  skills: string[];
};

export type UserProfile = {
  bio: string;
  title: string;
  location: string;
  experienceLevel: string;
  availability: string;
};

export type UserSettings = {
  emailNotifications: boolean;
  showOnlineStatus: boolean;
  profileVisibility: 'public' | 'private';
};