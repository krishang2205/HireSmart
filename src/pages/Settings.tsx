import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

// Mock API functions
const fetchSettings = async () => {
  
  // Simulate API call
  return {
    profile: { name: 'John Doe', email: 'john@example.com', password: '' },
    minScore: 0.7,
    thresholds: { best: 0.85, consider: 0.7 },
    resumeFormat: ['PDF', 'DOCX'],
    maxFileSize: 5,
    duplicateDetection: true,
    emailNotif: true,
    soundNotif: false,
    pushNotif: false,
  // ...existing code...
    tableColumns: ['Name', 'Score', 'Category'],
    colorCoding: true,
    exportFormat: 'CSV',
    dataRetention: 12,
    theme: 'light',
    language: 'en',
  };
};

const saveSettings = async (settings: any) => {
  // Simulate API save
  return { success: true };
};

// Initial state
const initialState = {
  smsNotif: false,
  whatsappNotif: false,
  profile: { name: '', email: '', password: '' },
  minScore: 0.7,
  thresholds: { best: 0.85, consider: 0.7 },
  resumeFormat: ['PDF', 'DOCX'],
  maxFileSize: 5,
  duplicateDetection: true,
    emailNotif: true,
    soundNotif: false,
    pushNotif: false,
  tableColumns: ['Name', 'Score', 'Category'],
  colorCoding: true,
  exportFormat: 'CSV',
  dataRetention: 12,
  theme: 'light',
  language: 'en',
};

const tabSections = [
  { label: 'Profile' },
  { label: 'Screening' },
  { label: 'Resume' },
  { label: 'Notifications' },
  { label: 'Security' },
  { label: 'General' },
];

const Settings = () => {
  // Search query state for settings search bar
  const [searchQuery, setSearchQuery] = useState("");
  // Filter tabs by search query
  const filteredTabs = searchQuery.trim()
    ? tabSections.filter(tab => tab.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : tabSections;
  // ...existing code...
  // Auth context for user info
  const { user, updateProfile, logout } = useAuth();
  // State
  const [settings, setSettings] = useState(initialState);
  const [profileErrors, setProfileErrors] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');
  // Read tab from navigation state (react-router-dom)
  useEffect(() => {
    // Only run on mount
    const nav = window.history.state && window.history.state.usr;
    if (nav && nav.tab) {
      setActiveTab(nav.tab);
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [settings.theme]);
  // Example company details state

  // Validation helpers
  const validateProfile = () => {
    let errors = { name: '', email: '', password: '' };
    if (!settings.profile.name) errors.name = 'Name is required.';
    if (!settings.profile.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(settings.profile.email)) errors.email = 'Valid email is required.';
    if (settings.profile.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    setProfileErrors(errors);
    return !errors.name && !errors.email && !errors.password;
  };

  // Example company details state
  const [companyDetails, setCompanyDetails] = useState({
    name: user?.companyName || '',
    website: '',
    industry: user?.industry || '',
    size: user?.companySize || '',
    address: '',
    description: '',
  });

  // Editable profile state for name/email
  const [editableProfile, setEditableProfile] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
  });

  // Load settings on mount
  useEffect(() => {
    fetchSettings().then(data => {
      // If user exists, override profile name/email with user data
      if (user) {
        data.profile.name = user.fullName || '';
        data.profile.email = user.email || '';
        setEditableProfile({
          name: user.fullName || '',
          email: user.email || '',
        });
      }
      setSettings({ ...initialState, ...data });
      setLoading(false);
    });
  }, [user]);

  // Save settings handler
  const handleSave = async () => {
    setSaveStatus('');
    // Update auth profile if name, email, companyName, industry, or companySize changed
    let authUpdated = false;
    const profileUpdates: Record<string, string> = {};
    if ((user?.fullName || '') !== editableProfile.name) profileUpdates.name = editableProfile.name;
    if ((user?.email || '') !== editableProfile.email) profileUpdates.email = editableProfile.email;
    if ((user?.companyName || '') !== companyDetails.name) profileUpdates.companyName = companyDetails.name;
    if ((user?.industry || '') !== companyDetails.industry) profileUpdates.industry = companyDetails.industry;
    if ((user?.companySize || '') !== companyDetails.size) profileUpdates.companySize = companyDetails.size;
    if (Object.keys(profileUpdates).length > 0) {
      await updateProfile(profileUpdates);
      authUpdated = true;
    }
    // Ensure changes are included before saving settings
    const updatedSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        name: editableProfile.name,
        email: editableProfile.email,
      },
      companyDetails: {
        ...companyDetails
      }
    };
    const res = await saveSettings(updatedSettings);
    if (res.success && authUpdated) setSaveStatus('Settings and login details updated!');
    else if (res.success) setSaveStatus('Settings saved!');
    else setSaveStatus('Failed to save settings.');
    setSettings(updatedSettings);
  };

  // Handlers for updating state
  const updateProfileField = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };
  const updateSetting = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  const updateThresholds = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, thresholds: { ...prev.thresholds, [field]: value } }));
  };

  useEffect(() => {
    if (user) {
      setCompanyDetails({
        name: user.companyName || '',
        website: '',
        industry: user.industry || '',
        size: user.companySize || '',
        address: '',
        description: '',
      });
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-blue-700">Loading settings...</div>;

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-extrabold text-indigo-700 tracking-tight"
              >
                Settings
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-blue-900/80"
              >
                Customize your application preferences and profile
              </motion.p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700 transition-all"
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col gap-8"
          >
            {/* Enhanced Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-8 sticky top-14 bg-white/80 z-10 backdrop-blur-lg rounded-t-xl p-2">
              {filteredTabs.length > 0 ? (
                filteredTabs.map((tab, index) => (
                  <motion.button
                    key={tab.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`py-3 px-6 font-semibold rounded-xl transition-all duration-300 ${
                      activeTab === tab.label 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200'
                    }`}
                    onClick={() => setActiveTab(tab.label)}
                  >
                    {tab.label}
                  </motion.button>
                ))
              ) : (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-3 text-gray-400"
                >
                  No matching settings
                </motion.span>
              )}
            </div>
            {/* Tab Content - open, not in a single container */}
            {activeTab === 'Profile' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-blue-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  {/* Profile Picture settings at top right */}
                  <div className="absolute top-6 right-8 z-10">
                    <motion.div 
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Default avatar image */}
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      {/* Edit icon overlay */}
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-2 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">Your Profile</h2>
                      <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200">
                        Recruiter
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Update your profile and company details here</p>
                    
                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="Enter your full name"
                            value={editableProfile.name} 
                            onChange={e => setEditableProfile({ ...editableProfile, name: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="Enter your email"
                            value={editableProfile.email} 
                            onChange={e => setEditableProfile({ ...editableProfile, email: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                        </svg>
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Company Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="Enter company name"
                            value={companyDetails.name} 
                            onChange={e => setCompanyDetails({ ...companyDetails, name: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Company Website</label>
                          <input 
                            type="url" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="https://yourcompany.com"
                            value={companyDetails.website} 
                            onChange={e => setCompanyDetails({ ...companyDetails, website: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Industry</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="e.g. Software, Healthcare"
                            value={companyDetails.industry} 
                            onChange={e => setCompanyDetails({ ...companyDetails, industry: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2">Company Size</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all" 
                            value={companyDetails.size} 
                            onChange={e => setCompanyDetails({ ...companyDetails, size: e.target.value })}
                          >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-1000">201-1000 employees</option>
                            <option value=">1000">1000+ employees</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-medium text-gray-700 mb-2">Company Address</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="Enter company address"
                            value={companyDetails.address} 
                            onChange={e => setCompanyDetails({ ...companyDetails, address: e.target.value })} 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block font-medium text-gray-700 mb-2">Company Description</label>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400 resize-none" 
                            rows={3}
                            placeholder="Describe your company and what you do"
                            value={companyDetails.description} 
                            onChange={e => setCompanyDetails({ ...companyDetails, description: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        Notification Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={settings.emailNotif} 
                              onChange={e => updateSetting('emailNotif', e.target.checked)} 
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Email Notifications</span>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Sound Notifications</span>
                            <p className="text-sm text-gray-500">Audio alerts for updates</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'Screening' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">Screening Preferences</h2>
                      <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold border border-cyan-200">
                        AI Powered
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Configure AI-powered resume screening parameters</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Minimum Similarity Score */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Minimum Similarity Score
                        </h3>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={settings.minScore} 
                          onChange={e => updateSetting('minScore', Number(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>0</span>
                          <span className="font-semibold text-indigo-600">{settings.minScore}</span>
                          <span>1</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Minimum score required for candidate consideration</p>
                      </div>

                      {/* Best for Hire Threshold */}
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                          Best for Hire Threshold
                        </h3>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={settings.thresholds.best} 
                          onChange={e => updateThresholds('best', Number(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>0</span>
                          <span className="font-semibold text-cyan-600">{settings.thresholds.best}</span>
                          <span>1</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Score threshold for top-tier candidates</p>
                      </div>

                      {/* Consider for Interview Threshold */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                          Consider for Interview Threshold
                        </h3>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={settings.thresholds.consider} 
                          onChange={e => updateThresholds('consider', Number(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>0</span>
                          <span className="font-semibold text-blue-600">{settings.thresholds.consider}</span>
                          <span>1</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Score threshold for interview consideration</p>
                      </div>

                      {/* Skill Extraction Method */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 9.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 15l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 18.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 21l-1.035-.259a3.375 3.375 0 00-2.456-2.456L18 18.75l-.259-1.035a3.375 3.375 0 00-2.456 2.456L14.25 21l1.036.259a3.375 3.375 0 002.455 2.456L18 18.75l.259-1.035a3.375 3.375 0 002.456-2.456L21.75 15l-1.035-.259a3.375 3.375 0 002.456-2.456L18 9.75z" />
                          </svg>
                          Skill Extraction Method
                        </h3>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all">
                          <option value="default">Default NLP Model</option>
                          <option value="advanced">Advanced Model</option>
                          <option value="custom">Custom Configuration</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-2">Choose the NLP model for skill extraction</p>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Options</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Automatic Skill Matching</span>
                            <p className="text-sm text-gray-500">Automatically match skills between resumes and job descriptions</p>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Experience Weighting</span>
                            <p className="text-sm text-gray-500">Weight candidate experience more heavily in scoring</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'Resume' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">Resume & Job Description Handling</h2>
                      <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
                        Upload
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Configure how resumes and job descriptions are processed</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Allowed Resume Formats */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Allowed Resume Formats
                        </h3>
                        <div className="flex gap-3 mb-4">
                          <button className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                            settings.resumeFormat.includes('PDF') 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}>
                            PDF
                          </button>
                          <button className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                            settings.resumeFormat.includes('DOCX') 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}>
                            DOCX
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">Select one or more formats. Only PDF and DOCX supported.</p>
                      </div>

                      {/* Max File Size */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v13.5c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                          </svg>
                          Max File Size
                        </h3>
                        <input 
                          type="range" 
                          min="1" 
                          max="20" 
                          value={settings.maxFileSize} 
                          onChange={e => updateSetting('maxFileSize', Number(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>1MB</span>
                          <span className="font-semibold text-indigo-600">{settings.maxFileSize}MB</span>
                          <span>20MB</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Maximum file size allowed for uploads</p>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Processing Options</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={settings.duplicateDetection} 
                              onChange={e => updateSetting('duplicateDetection', e.target.checked)} 
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Duplicate Resume Detection</span>
                            <p className="text-sm text-gray-500">Automatically detect and flag duplicate resumes</p>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Anonymize Resumes for Unbiased Screening</span>
                            <p className="text-sm text-gray-500">Remove personal information for fair evaluation</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Auto-extract Contact Information</span>
                            <p className="text-sm text-gray-500">Automatically extract email and phone from resumes</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'Notifications' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">Notifications & Alerts</h2>
                      <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200">
                        Integrations
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Configure how you receive notifications and alerts</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Notification Types */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Types</h3>
                        
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={settings.emailNotif} 
                                onChange={e => updateSetting('emailNotif', e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Email Notifications</span>
                              <p className="text-sm text-gray-500">Receive updates via email</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={settings.soundNotif} 
                                onChange={e => updateSetting('soundNotif', e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Sound Notifications</span>
                              <p className="text-sm text-gray-500">Audio alerts for updates</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={settings.pushNotif} 
                                onChange={e => updateSetting('pushNotif', e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Push Notifications</span>
                              <p className="text-sm text-gray-500">Browser push notifications</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={settings.smsNotif} 
                                onChange={e => updateSetting('smsNotif', e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">SMS Notifications</span>
                              <p className="text-sm text-gray-500">Text message alerts</p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={settings.whatsappNotif} 
                                onChange={e => updateSetting('whatsappNotif', e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">WhatsApp Notifications</span>
                              <p className="text-sm text-gray-500">WhatsApp message alerts</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
                        
                        <div>
                          <label className="block font-medium text-gray-700 mb-3">Notification Frequency</label>
                          <div className="flex gap-2 flex-wrap">
                            <button className="px-4 py-2 rounded-lg border-2 bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25 font-medium">
                              Immediate
                            </button>
                            <button className="px-4 py-2 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 font-medium transition-all">
                              Daily
                            </button>
                            <button className="px-4 py-2 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 font-medium transition-all">
                              Weekly
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-medium text-gray-700 mb-3">Integrations</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder-gray-400" 
                            placeholder="Slack/Teams Webhook URL" 
                          />
                          <div className="flex gap-2 mt-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                              Connected
                            </span>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">
                              Disconnected
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'Security' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100/50 to-orange-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">Security & Privacy</h2>
                      <span className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
                        Secure
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Manage your account security and data privacy settings</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Data Retention */}
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v13.5c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                          </svg>
                          Data Retention
                        </h3>
                        <input 
                          type="range" 
                          min="1" 
                          max="60" 
                          value={settings.dataRetention} 
                          onChange={e => updateSetting('dataRetention', Number(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>1 month</span>
                          <span className="font-semibold text-red-600">{settings.dataRetention} months</span>
                          <span>60 months</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">How long to keep candidate data</p>
                      </div>

                      {/* Team Permissions */}
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                          Team Permissions
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <button className="px-3 py-2 rounded-lg border-2 bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25 text-sm font-medium">
                            Admin
                          </button>
                          <button className="px-3 py-2 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-sm font-medium transition-all">
                            Recruiter
                          </button>
                          <button className="px-3 py-2 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-sm font-medium transition-all">
                            Viewer
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Manage team access levels</p>
                      </div>
                    </div>

                    {/* Security Options */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Features</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Two-Factor Authentication</span>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Login Notifications</span>
                            <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Session Timeout</span>
                            <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Download Activity Log */}
                    <div className="mt-6">
                      <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Download Activity Log
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
            {activeTab === 'General' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="pr-32">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-blue-800">General Application Settings</h2>
                      <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200">
                        App
                      </span>
                    </div>
                    <p className="mb-6 text-gray-600">Customize your application appearance and behavior</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Language Selection */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
                        <div className="flex gap-2 flex-wrap">
                          {['en', 'es', 'fr'].map(lang => (
                            <button
                              key={lang}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                settings.language === lang 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                              }`}
                              onClick={() => updateSetting('language', lang)}
                            >
                              {lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'French'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Theme Selection */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
                        <div className="flex gap-2">
                          {['light', 'dark'].map(theme => (
                            <button
                              key={theme}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                settings.theme === theme 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              onClick={() => updateSetting('theme', theme)}
                            >
                              {theme === 'light' ? 'Light' : 'Dark'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Export Format */}
                      <div className="bg-gradient-to-br from-cyan-50 to-green-50 p-6 rounded-xl border border-cyan-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Format</h3>
                        <div className="flex gap-2 flex-wrap">
                          {['CSV', 'Excel', 'PDF'].map(format => (
                            <button
                              key={format}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                settings.exportFormat === format 
                                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/25' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-300 hover:bg-cyan-50'
                              }`}
                              onClick={() => updateSetting('exportFormat', format)}
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Table Display Options */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Table Columns</h3>
                        <div className="space-y-2">
                          {['Name', 'Score', 'Category', 'Email'].map(col => (
                            <label key={col} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={settings.tableColumns.includes(col)}
                                onChange={e => {
                                  setSettings(prev => {
                                    const cols = prev.tableColumns.includes(col)
                                      ? prev.tableColumns.filter(c => c !== col)
                                      : [...prev.tableColumns, col];
                                    return { ...prev, tableColumns: cols };
                                  });
                                }}
                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                              />
                              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{col}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Display Options</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={settings.colorCoding} 
                            onChange={e => updateSetting('colorCoding', e.target.checked)} 
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                          />
                          <div>
                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Enable Color Coding in Results Table</span>
                            <p className="text-sm text-gray-500">Use colors to highlight different score ranges</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Save Changes Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg hover:scale-105 transform" 
                onClick={handleSave}
              >
                Save Changes
              </button>
            </motion.div>
            
            {saveStatus && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-green-600 bg-green-50 border border-green-200 px-6 py-3 rounded-xl font-medium">
                  {saveStatus}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Settings;