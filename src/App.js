import React from 'react';
import ResumeScreener from './components/ResumeScreener';
import './App.css';
import './index.css'; // Import your global styles
import Header from './components/Header';
import { FaRocket, FaCheckCircle, FaUsers } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="py-10 px-6">
        <ResumeScreener />

        {/* Features Section */}
        <section className="py-16 px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose HireSmart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FaRocket className="text-blue-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Accurate</h3>
              <p className="text-gray-600">Leverage AI to quickly screen resumes and find the best matches.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Results</h3>
              <p className="text-gray-600">Get precise evaluations with our advanced algorithms.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <FaUsers className="text-purple-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
              <p className="text-gray-600">An intuitive interface designed for recruiters and HR teams.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-100 py-16 px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">"HireSmart has revolutionized our hiring process. It's fast, accurate, and incredibly easy to use!"</p>
              <p className="text-gray-800 font-bold mt-4">- Jane Doe, HR Manager</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">"We saved so much time and found the perfect candidates thanks to HireSmart."</p>
              <p className="text-gray-800 font-bold mt-4">- John Smith, Recruiter</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p className="text-sm">&copy; 2025 HireSmart. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
