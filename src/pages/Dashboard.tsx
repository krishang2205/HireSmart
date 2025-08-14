import { useAuth } from '@/context/AuthContext';
import Brand from '@/components/Brand';
import ResumeScreener from '@/components/ResumeScreener';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [showInsights, setShowInsights] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-0 py-4 bg-white/80 shadow-sm w-full z-10">
        <div className="flex items-center gap-3 pl-8">
          <Brand logoClassName="h-8 w-8" wordClassName="text-xl font-extrabold tracking-tight text-indigo-700" />
        </div>
        <div />
        <div className="flex items-center gap-6 pr-8">
          <button className="relative">
            <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </button>
          <span className="text-base font-medium text-gray-700">Hello, {user?.fullName || 'User'}!</span>
          <img src="https://ui-avatars.com/api/?name=User&background=6D28D9&color=fff&size=32" alt="avatar" className="h-8 w-8 rounded-full border-2 border-indigo-300" />
        </div>
      </header>

      {/* Content below header */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white/90 border-r border-gray-200 flex flex-col shadow-sm pt-0">
          <nav className="flex flex-col gap-2 mt-8 px-6">
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold">
              <span>Resume Screening</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Results</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Profile</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Help</span>
            </a>
          </nav>
          <div className="mt-auto pt-8 pb-4 text-xs text-gray-400 text-center">© {new Date().getFullYear()} HireSmart</div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 flex flex-col px-4 py-8 gap-8 relative">
            {/* Insights pop-up */}
            {showInsights && (
              <div className="fixed top-8 right-8 z-50 w-96 min-w-[320px] bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col items-center gap-4 animate-fade-in">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  aria-label="Close"
                  onClick={() => setShowInsights(false)}
                >
                  &times;
                </button>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-2">
                  <svg className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-indigo-700 text-center">Get More Insights!</h3>
                <p className="text-sm text-gray-600 text-center">Upgrade to HireSmart Pro for advanced analytics, skill gap insights, and priority support.</p>
                <a href="#" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-indigo-700 transition">Upgrade Plan</a>
              </div>
            )}

            {/* Intro section - stays narrow */}
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">HireSmart Dashboard</h1>
              <p className="text-lg text-blue-900/80 mb-4">AI-powered resume screening & hiring workflow</p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-200 text-cyan-900 font-semibold text-sm">Fast</span>
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold text-sm">Accurate</span>
                <span className="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm">Secure</span>
              </div>
            </div>

            {/* Resume screener section - full width */}
            <div className="w-full">
              <ResumeScreener />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
