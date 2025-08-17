import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Asset, WalletState, Notification, Danmaku, Comment, CommunityEvent, Announcement } from '@/types';

interface AppState {
  // 用户状态
  user: User | null;
  wallet: WalletState;
  
  // 资产相关
  assets: Asset[];
  currentAsset: Asset | null;
  assetFilters: any;
  
  // UI状态
  isLoading: boolean;
  currentView: 'feed' | 'asset' | 'profile' | 'guild' | 'leaderboard';
  theme: 'light' | 'dark';
  
  // 社交功能
  notifications: Notification[];
  danmaku: Danmaku[];
  unreadNotifications: number;
  comments: Record<string, Comment[]>; // 按资产ID组织的评论
  communityEvents: Record<string, CommunityEvent[]>; // 按资产ID组织的社区活动
  announcements: Record<string, Announcement[]>; // 按资产ID组织的公告
  
  // 设置
  settings: {
    autoPlay: boolean;
    soundEnabled: boolean;
    danmakuEnabled: boolean;
    priceAlerts: boolean;
    tutorialCompleted: boolean;
    firstTimeUser: boolean;
  };
}

interface AppActions {
  // 用户相关
  setUser: (user: User | null) => void;
  updateUserBalance: (balance: { sol: number; usdc: number }) => void;
  setWalletState: (wallet: Partial<WalletState>) => void;
  
  // 资产相关
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  setCurrentAsset: (asset: Asset | null) => void;
  setAssetFilters: (filters: any) => void;
  
  // UI相关
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  toggleTheme: () => void;
  
  // 社交功能
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  addDanmaku: (danmaku: Danmaku) => void;
  clearDanmaku: () => void;
  
  // 评论相关
  addComment: (assetId: string, comment: Comment) => void;
  removeComment: (assetId: string, commentId: string) => void;
  likeComment: (assetId: string, commentId: string) => void;
  
  // 社区相关
  addCommunityEvent: (assetId: string, event: CommunityEvent) => void;
  removeCommunityEvent: (assetId: string, eventId: string) => void;
  addAnnouncement: (assetId: string, announcement: Announcement) => void;
  removeAnnouncement: (assetId: string, announcementId: string) => void;
  
  // 设置
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  
  // 重置
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  wallet: {
    connected: false,
    connecting: false,
  },
  assets: [],
  currentAsset: null,
  assetFilters: {},
  isLoading: false,
  currentView: 'feed',
  theme: 'dark',
  notifications: [],
  danmaku: [],
  unreadNotifications: 0,
  comments: {},
  communityEvents: {},
  announcements: {},
  settings: {
    autoPlay: true,
    soundEnabled: true,
    danmakuEnabled: true,
    priceAlerts: true,
    tutorialCompleted: false,
    firstTimeUser: true,
  },
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 用户相关
        setUser: (user) => set({ user }),
        updateUserBalance: (balance) => 
          set((state) => ({
            user: state.user ? { ...state.user, balance } : null,
          })),
        setWalletState: (wallet) => 
          set((state) => ({
            wallet: { ...state.wallet, ...wallet },
          })),
        
        // 资产相关
        setAssets: (assets) => set({ assets }),
        addAsset: (asset) => 
          set((state) => ({
            assets: [asset, ...state.assets],
          })),
        updateAsset: (assetId, updates) =>
          set((state) => ({
            assets: state.assets.map((asset) =>
              asset.id === assetId ? { ...asset, ...updates } : asset
            ),
            currentAsset: state.currentAsset?.id === assetId 
              ? { ...state.currentAsset, ...updates }
              : state.currentAsset,
          })),
        setCurrentAsset: (asset) => set({ currentAsset: asset }),
        setAssetFilters: (filters) => set({ assetFilters: filters }),
        
        // UI相关
        setLoading: (loading) => set({ isLoading: loading }),
        setCurrentView: (view) => set({ currentView: view }),
        toggleTheme: () => 
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),
        
        // 社交功能
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadNotifications: state.unreadNotifications + 1,
          })),
        markNotificationAsRead: (notificationId) =>
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
            unreadNotifications: Math.max(0, state.unreadNotifications - 1),
          })),
        clearNotifications: () => set({ notifications: [], unreadNotifications: 0 }),
        addDanmaku: (danmaku) =>
          set((state) => ({
            danmaku: [...state.danmaku, danmaku],
          })),
        clearDanmaku: () => set({ danmaku: [] }),
        
        // 评论相关
        addComment: (assetId, comment) =>
          set((state) => ({
            comments: {
              ...state.comments,
              [assetId]: [...(state.comments[assetId] || []), comment],
            },
          })),
        removeComment: (assetId, commentId) =>
          set((state) => ({
            comments: {
              ...state.comments,
              [assetId]: (state.comments[assetId] || []).filter(
                (comment) => comment.id !== commentId
              ),
            },
          })),
        likeComment: (assetId, commentId) =>
          set((state) => ({
            comments: {
              ...state.comments,
              [assetId]: (state.comments[assetId] || []).map((comment) =>
                comment.id === commentId
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              ),
            },
          })),
        
        // 社区相关
        addCommunityEvent: (assetId, event) =>
          set((state) => ({
            communityEvents: {
              ...state.communityEvents,
              [assetId]: [...(state.communityEvents[assetId] || []), event],
            },
          })),
        removeCommunityEvent: (assetId, eventId) =>
          set((state) => ({
            communityEvents: {
              ...state.communityEvents,
              [assetId]: (state.communityEvents[assetId] || []).filter(
                (event) => event.id !== eventId
              ),
            },
          })),
        addAnnouncement: (assetId, announcement) =>
          set((state) => ({
            announcements: {
              ...state.announcements,
              [assetId]: [...(state.announcements[assetId] || []), announcement],
            },
          })),
        removeAnnouncement: (assetId, announcementId) =>
          set((state) => ({
            announcements: {
              ...state.announcements,
              [assetId]: (state.announcements[assetId] || []).filter(
                (announcement) => announcement.id !== announcementId
              ),
            },
          })),
        
        // 设置
        updateSettings: (settings) =>
          set((state) => ({
            settings: { ...state.settings, ...settings },
          })),
        
        // 重置
        reset: () => set(initialState),
      }),
      {
        name: 'pumpfun-app-storage',
        partialize: (state) => ({
          user: state.user,
          wallet: state.wallet,
          theme: state.theme,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'pumpfun-app-store',
    }
  )
);