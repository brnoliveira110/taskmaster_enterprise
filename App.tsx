import React, { useEffect, useState } from 'react';
import { useAuthStore, useTodoStore } from './store';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { Layout } from './components/Layout';

const App = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchData } = useTodoStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Zustand Persist hydration fix for Next.js/React hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  if (!isHydrated) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
};

export default App;