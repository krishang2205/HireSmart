
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ResumeScreener from '@/components/ResumeScreener';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}.</p>
      </div>
      <ResumeScreener />
    </div>
  );
}
