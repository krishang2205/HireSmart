

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 border-r border-gray-200 flex flex-col py-8 px-6 shadow-sm">
        <Brand logoClassName="h-10 w-10 mb-6" wordClassName="text-2xl font-bold tracking-tight text-indigo-700" />
        <nav className="flex flex-col gap-2 mt-4">
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
        <div className="mt-auto pt-8 text-xs text-gray-400">© {new Date().getFullYear()} HireSmart</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-6 bg-white/80 shadow-sm">
          <div />
          <div className="flex items-center gap-6">
            {/* Notification Icon */}
            <button className="relative">
              <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
            {/* User Info */}
            <span className="text-base font-medium text-gray-700">Hello, {user?.fullName || 'User'}!</span>
            {/* Profile Avatar */}
            <img src="https://ui-avatars.com/api/?name=User&background=6D28D9&color=fff&size=32" alt="avatar" className="h-8 w-8 rounded-full border-2 border-indigo-300" />
          </div>
        </header>
        <main className="flex-1 flex flex-row items-start justify-center px-4 py-8 gap-8">
          {/* Main Content */}
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">HireSmart Dashboard</h1>
              <p className="text-lg text-blue-900/80 mb-4">AI-powered resume screening & hiring workflow</p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-200 text-cyan-900 font-semibold text-sm">Fast</span>
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold text-sm">Accurate</span>
                <span className="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm">Secure</span>
              </div>
            </div>
            {/* Example Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700 font-medium">4 out of 5 Resumes Uploading</span>
                <span className="text-xs text-yellow-600">⚠️</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-indigo-500 rounded-full transition-all" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Example Results Table */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-indigo-700 mb-2">Screening Results</h2>
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Score</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">John Doe</td>
                    <td className="px-4 py-2">PDF</td>
                    <td className="px-4 py-2">92%</td>
                    <td className="px-4 py-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Jane Smith</td>
                    <td className="px-4 py-2">DOCX</td>
                    <td className="px-4 py-2">75%</td>
                    <td className="px-4 py-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Sam Lee</td>
                    <td className="px-4 py-2">PDF</td>
                    <td className="px-4 py-2">40%</td>
                    <td className="px-4 py-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ResumeScreener />
          </div>
          {/* Right-side Info Card */}
          <aside className="w-96 min-w-[320px] bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-2">
              <svg className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-indigo-700 text-center">Get More Insights!</h3>
            <p className="text-sm text-gray-600 text-center">Upgrade to HireSmart Pro for advanced analytics, skill gap insights, and priority support.</p>
            <a href="#" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-indigo-700 transition">Upgrade Plan</a>
          </aside>
        </main>
      </div>
    </div>
  );
}
