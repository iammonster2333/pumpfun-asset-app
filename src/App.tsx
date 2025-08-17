import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { WalletProvider } from '@/components/WalletProvider';
import { WebSocketProvider } from '@/components/WebSocketProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TutorialProvider } from '@/components/Tutorial';
import { Layout } from '@/components/Layout';
import { FeedPage } from '@/pages/FeedPage';
import { AssetPage } from '@/pages/AssetPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { GuildPage } from '@/pages/GuildPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { CreateAssetPage } from '@/pages/CreateAssetPage';
import { LoadingScreen } from '@/components/LoadingScreen';

function App() {
  const { isLoading, theme } = useAppStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <WebSocketProvider>
          <TutorialProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/asset/:assetId" element={<AssetPage />} />
                <Route path="/profile/:userId?" element={<ProfilePage />} />
                <Route path="/guild/:guildId?" element={<GuildPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/create" element={<CreateAssetPage />} />
              </Routes>
            </Layout>
          </TutorialProvider>
        </WebSocketProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;