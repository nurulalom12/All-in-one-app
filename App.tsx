
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import ToolsView from './views/ToolsView';
import FinanceView from './views/FinanceView';
import ProductivityView from './views/ProductivityView';
import ProfileView from './views/ProfileView';
import CalendarView from './views/CalendarView';
import HealthView from './views/HealthView';
import SecurityLock from './components/SecurityLock';
import GeminiChat from './components/GeminiChat';

const AppContent: React.FC = () => {
  const { currentView, isLocked } = useApp();

  if (isLocked) {
    return <SecurityLock />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'tools': return <ToolsView />;
      case 'finance': return <FinanceView />;
      case 'productivity': return <ProductivityView />;
      case 'calendar': return <CalendarView />;
      case 'health': return <HealthView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView />;
    }
  };

  return (
    <Layout>
      {renderView()}
      <GeminiChat />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
