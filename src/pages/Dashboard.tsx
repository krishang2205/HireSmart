import { useAuth } from '@/context/AuthContext';
import Brand from '@/components/Brand';
import ResumeScreener from '@/components/ResumeScreener';
import { useState } from 'react';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showInsights, setShowInsights] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);

  return (
  <div className="min-h-screen bg-blue-50 flex flex-col text-sm">
      {/* Header */}
  <header className="flex items-center justify-between px-0 py-2 bg-indigo-50/80 shadow-sm w-full z-10 text-sm">
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
          <div className="relative">
            <button onClick={() => setShowUserModal((v) => !v)}>
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=6D28D9&color=fff&size=32`} alt="avatar" className="h-8 w-8 rounded-full border-2 border-indigo-300" />
            </button>
            {showUserModal && (
              <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-lg min-w-[260px] border border-gray-200">
                <div className="px-5 pt-5 pb-2 flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5 mb-2">
                    <span className="font-bold text-base text-gray-800">{user?.fullName || 'User'}</span>
                    <span className="text-xs text-gray-500">{user?.email || 'user@email.com'}</span>
                    {user?.role && <span className="text-xs text-indigo-600 font-semibold">{user.role}</span>}
                  </div>
                  <hr className="my-2" />
                  <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700">
                    <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg> Edit profile</span>
                    <span className="text-xs text-gray-400">E</span>
                  </button>
                  <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700">
                    <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.83 0 1.58-.58 1.51-1.41a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.39.39.9.6 1.42.51.51-.09 1-.51 1-1.02V3a2 2 0 0 1 4 0v.09c0 .51.49.93 1 .93.52.09 1.03-.12 1.42-.51l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.07.83.68 1.41 1.51 1.41H21a2 2 0 0 1 0 4h-.09c-.83 0-1.58.58-1.51 1.41z" /></svg> Widget settings</span>
                    <span className="text-xs text-gray-400">W</span>
                  </button>
                  <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700">
                    <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-4-4m4 4l4-4" /></svg> Upgrade to professional</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    className="flex items-center gap-2 w-full py-2 px-2 rounded hover:bg-red-50 text-red-600 font-semibold"
                    onClick={() => { logout(); window.location.href = '/'; }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content below header */}
      <div className="flex flex-1">
        {/* Sidebar */}
  <aside className="w-44 bg-blue-100 border-r border-gray-200 flex flex-col shadow-sm pt-0 text-sm">
          <nav className="flex flex-col gap-2 mt-8 px-6">
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold">
              <span>Resume Screening</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Job Descriptions</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Candidates</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Results</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Insights & Analytics</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Activity Log</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
              <span>Settings</span>
            </a>
              
          </nav>
      
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col text-sm">
          <main className="flex-1 flex flex-col px-2 py-4 gap-4 relative text-sm">
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
              <p className="text-lg text-blue-900/80 mb-2">AI-powered resume screening & hiring workflow</p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-200 text-cyan-900 font-semibold text-sm">Fast</span>
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold text-sm">Accurate</span>
                <span className="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm">Secure</span>
              </div>
            </div> {/* Resume screener section - full width */}
            <div className="w-full" >
              <ResumeScreener />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

