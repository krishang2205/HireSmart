import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}.</p>
        <div className="border rounded p-4 text-sm">This is a placeholder dashboard. Integrate resume screening UI here.</div>
      </div>
    </div>
  );
}
