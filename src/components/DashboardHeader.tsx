import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Brand from '@/components/Brand';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  return (
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
                  <span className="text-xs text-gray-500">{'email' in user ? (user as any).email : 'user@email.com'}</span>
                  {user?.role && <span className="text-xs text-indigo-600 font-semibold">{user.role}</span>}
                </div>
                <hr className="my-2" />
                <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => { setShowUserModal(false); navigate('/settings', { state: { tab: 'Profile' } }); }}>
                  <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg> Edit profile</span>
                  <span className="text-xs text-gray-400">E</span>
                </button>
                <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700" onClick={() => { setShowUserModal(false); navigate('/settings', { state: { tab: 'General' } }); }}>
                  <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.83 0 1.58-.58 1.51-1.41a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.39.39.9.6 1.42.51.51-.09 1-.51 1-1.02V3a2 2 0 0 1 4 0v.09c0 .51.49.93 1 .93.52.09 1.03-.12 1.42-.51l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.07.83.68 1.41 1.51 1.41H21a2 2 0 0 1 0 4h-.09c-.83 0-1.58.58-1.51 1.41z" /></svg> Widget settings</span>
                  <span className="text-xs text-gray-400">W</span>
                </button>
                <button className="flex items-center justify-between w-full py-2 px-2 rounded hover:bg-indigo-50 text-gray-700">
                  <span className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-4-4m4 4l4-4" /></svg> Upgrade to professional</span>
                </button>
                <hr className="my-2" />
                <button className="flex items-center gap-2 w-full py-2 px-2 rounded hover:bg-red-50 text-red-600 font-semibold" onClick={() => { logout(); window.location.href = '/'; }}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
