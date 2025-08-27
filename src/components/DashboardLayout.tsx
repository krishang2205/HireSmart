import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col text-sm bg-gradient-to-br from-blue-50 to-indigo-100">
    <DashboardHeader />
    <div className="flex flex-1">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col px-2 py-4 gap-4 relative text-sm bg-transparent">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default DashboardLayout;
