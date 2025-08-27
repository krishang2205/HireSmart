const DashboardSidebar = () => (
  <aside className="w-56 bg-blue-100 border-r border-gray-200 flex flex-col shadow-sm pt-0 text-sm min-h-full relative">
    <nav className="flex flex-col gap-2 mt-8 px-6">
      <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold">
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
      <a href="/next-steps" className="flex items-center gap-3 px-4 py-2 rounded-lg text-primary font-semibold bg-blue-50 hover:bg-blue-100">
        <span>Next Steps</span>
      </a>
      <a href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
        <span>Settings</span>
      </a>
    </nav>
  </aside>
);

export default DashboardSidebar;
