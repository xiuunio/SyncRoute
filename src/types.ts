export interface User {
  name: string;
  level: string;
  points: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  points: number;
  date: string;
  iconType: 'check' | 'shortcut' | 'register';
}

export interface RankingItem {
  rank: number;
  name: string;
  distance: number; // in km
  avatarUrl: string;
}

export interface ShopItem {
  id: string;
  title: string;
  price: number;
  icon: 'coffee' | 'utensils' | 'bread' | 'sparkles';
  imageUrl?: string;
}

export interface PurchasedCoupon {
  id: string;
  item: ShopItem;
  purchasedAt: string;
  barcode: string;
  used: boolean;
}

export interface TurnByTurnStep {
  id: string;
  instruction: string;
  detail: string;
  type: 'up' | 'right' | 'left' | 'elevator' | 'arrival';
}

export interface RouteOption {
  id: 'fast' | '舒适' | 'rainfree';
  title: string;
  duration: number; // in minutes
  distance: number; // in meters
  tag: string;
  tagBg: string;
  tagColor: string;
  description: string;
  steps: TurnByTurnStep[];
}

export interface TimetableCourse {
  id: string;
  name: string;
  building: string;
  room: string;
  day: '월' | '화' | '수' | '목' | '금';
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "10:30"
  color: string;
}

export interface Route {
  start: string;
  end: string;
  options: RouteOption[];
}
