// 用户相关类型
export interface User {
  id: string;
  username: string;
  avatar: string;
  walletAddress: string;
  balance: {
    sol: number;
    usdc: number;
  };
  level: number;
  experience: number;
  achievements: Achievement[];
  guild?: Guild;
  createdAt: Date;
  lastActiveAt: Date;
}

// 成就系统
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 帮派/社群系统
export interface Guild {
  id: string;
  name: string;
  description: string;
  avatar: string;
  leaderId: string;
  members: GuildMember[];
  level: number;
  experience: number;
  totalAssets: number;
  totalValue: number;
  createdAt: Date;
}

export interface GuildMember {
  userId: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: Date;
  contribution: number;
}

// 资产相关类型
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  description: string;
  creatorId: string;
  creator: User;
  contractAddress: string;
  totalSupply: number;
  circulatingSupply: number;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  klineData: KlineData[];
  tags: string[];
  status: 'active' | 'paused' | 'delisted';
  createdAt: Date;
  updatedAt: Date;
  // 社交链接
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  whitepaper?: string;
}

// K线数据类型
export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 交易相关类型
export interface Transaction {
  id: string;
  assetId: string;
  asset: Asset;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  buyerId: string;
  sellerId: string;
  buyer: User;
  seller: User;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

// 评论相关类型
export interface Comment {
  id: string | number;
  assetId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: number;
  likes: number;
  replies?: Comment[];
}

// 社区活动类型
export interface CommunityEvent {
  id: string | number;
  assetId: string;
  title: string;
  description?: string;
  date: string;
  participants: number;
  location?: string;
  type?: 'ama' | 'airdrop' | 'meeting' | 'other';
}

// 公告类型
export interface Announcement {
  id: string | number;
  assetId: string;
  title: string;
  content: string;
  date: string;
  author?: string;
  important?: boolean;
}

// 弹幕系统
export interface Danmaku {
  id: string;
  assetId: string;
  userId: string;
  user: User;
  content: string;
  type: 'price' | 'comment' | 'trade' | 'system';
  color: string;
  position: 'top' | 'bottom' | 'scroll';
  duration: number;
  createdAt: Date;
}

// 排行榜
export interface Leaderboard {
  id: string;
  type: 'daily_profit' | 'weekly_profit' | 'total_profit' | 'asset_creators' | 'traders';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: User;
  value: number;
  change?: number;
}

// 任务系统
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement' | 'guild';
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt?: Date;
}

export interface QuestRequirement {
  type: 'trade_count' | 'profit_amount' | 'asset_creation' | 'guild_contribution';
  value: number;
  current: number;
}

export interface QuestReward {
  type: 'experience' | 'tokens' | 'achievement' | 'guild_points';
  value: number;
  assetId?: string;
}

// 通知系统
export interface Notification {
  id: string;
  userId: string;
  type: 'trade' | 'price_alert' | 'achievement' | 'guild' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket消息类型
export interface WebSocketMessage {
  type: 'price_update' | 'trade' | 'danmaku' | 'notification';
  data: any;
  timestamp: number;
}

// 搜索和过滤
export interface AssetFilters {
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  sortBy?: 'price' | 'marketCap' | 'volume' | 'holders' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'paused' | 'delisted';
}

// 钱包连接状态
export interface WalletState {
  connected: boolean;
  address?: string;
  balance?: {
    sol: number;
    usdc: number;
  };
  connecting: boolean;
  error?: string;
}