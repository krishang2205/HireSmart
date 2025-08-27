import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Sidebar placeholder (replace with actual sidebar code)

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
    {/* Add sidebar navigation items here */}
    <nav className="flex flex-col gap-4">
      <a href="/dashboard" className="text-indigo-700 font-semibold">Dashboard</a>
      <a href="/next-steps" className="text-indigo-700 font-semibold">Next Steps</a>
      <a href="/settings" className="text-indigo-700 font-semibold">Settings</a>
      {/* Add more links as needed */}
    </nav>
  </aside>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-8 bg-blue-50">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default Layout;
