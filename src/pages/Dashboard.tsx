

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
          <div className="flex items-center gap-4">
            <span className="text-base font-medium text-gray-700">Welcome, {user?.fullName || 'User'}!</span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">Dashboard</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
          <div className="w-full max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">HireSmart Dashboard</h1>
              <p className="text-lg text-blue-900/80 mb-4">AI-powered resume screening & hiring workflow</p>
              <div className="flex justify-center gap-2 mb-2">
                <span className="inline-block px-4 py-1 rounded-full bg-cyan-200 text-cyan-900 font-semibold text-sm">Fast</span>
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-200 text-indigo-900 font-semibold text-sm">Accurate</span>
                <span className="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm">Secure</span>
              </div>
            </div>
            <ResumeScreener />
          </div>
        </main>
      </div>
    </div>
  );
}
