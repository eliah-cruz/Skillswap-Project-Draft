export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'file';
  fileName?: string;      
  fileUrl?: string;       
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
}

export type Match = {
  id: string; 
  name: string;
  teaching: string;
  needs: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  avatar: string;
  status: 'Online' | 'Away' | 'Offline';
  category: string;
  title: string;
  image?: string;
  availability?: string;
  location?: string;
  experienceLevel?: string;
  bio?: string;
  matchScore?: number;
  isMutualMatch?: boolean;
  isCircularMatch?: boolean; 
  isVerified?: boolean;
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
  profileVisibility: string;
};