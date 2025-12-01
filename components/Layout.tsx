import React from 'react';
import { useAuthStore } from '../store';
import { Button } from './ui/Button';
import { LogOut } from './ui/Icons';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto px-4 max-w-5xl">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="#">
              <span className="hidden font-bold sm:inline-block">TaskMaster</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Optional Search */}
            </div>
            <nav className="flex items-center space-x-2">
              {user && (
                <>
                  <span className="text-sm text-muted-foreground mr-2 hidden sm:block">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container py-6 md:py-10 mx-auto px-4 max-w-5xl">
        {children}
      </main>
    </div>
  );
};
