import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Brand from '@/components/Brand';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// Styles
const inputClass =
  'input w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150';
const sectionClass =
  'bg-white rounded-lg shadow p-6 md:p-8 mb-4 md:mb-8';
const labelClass =
  'block font-medium text-gray-700 mb-1';
const helperClass =
  'text-gray-500 text-xs ml-1 mb-2';
const buttonClass =
  'bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white px-4 py-2 rounded transition duration-150';

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

const sidebarLinks = [
  { label: 'Resume Screening', href: '/dashboard' },
  { label: 'Job Descriptions', href: '#' },
  { label: 'Candidates', href: '#' },
  { label: 'Results', href: '#' },
  { label: 'Insights & Analytics', href: '#' },
  { label: 'Activity Log', href: '#' },
  { label: 'Settings', href: '/settings' },
];

const tabSections = [
  { label: 'Profile' },
  { label: 'Screening' },
  { label: 'Resume' },
  { label: 'Notifications' },
  { label: 'Security' },
  { label: 'General' },
];

const Settings = () => {
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

  // Validation helpers
  const validateProfile = () => {
    let errors = { name: '', email: '', password: '' };
    if (!settings.profile.name) errors.name = 'Name is required.';
    if (!settings.profile.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(settings.profile.email)) errors.email = 'Valid email is required.';
    if (settings.profile.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    setProfileErrors(errors);
    return !errors.name && !errors.email && !errors.password;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col text-xs">
      {/* Header */}
      <header className="flex items-center justify-between px-0 py-1 bg-indigo-50/80 shadow-sm w-full z-10 text-xs sticky top-0 backdrop-blur-lg">
        <div className="flex items-center gap-3 pl-8">
          <Brand logoClassName="h-8 w-8" wordClassName="text-xl font-extrabold tracking-tight text-indigo-700" />
        </div>
        <div className="flex-1 flex justify-end pr-8">
          <input type="text" placeholder="Search settings..." className="w-72 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700" />
        </div>
      </header>
      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-blue-100 border-r border-gray-200 flex flex-col shadow-sm pt-0 text-sm min-h-full relative">
          <nav className="flex flex-col gap-2 mt-8 px-6">
            {sidebarLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${link.label === 'Settings' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-blue-50'}`}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          {/* Logout/Profile card at bottom */}
          <div className="absolute bottom-4 left-4 right-4 bg-indigo-600 rounded-xl flex items-center px-4 py-3 gap-3 shadow-lg">
          <img src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.fullName || 'U') + '&background=6D28D9&color=fff&size=48'} alt="avatar" className="h-10 w-10 rounded-full object-cover border-2 border-white" />
            <div className="flex-1">
              <div className="text-white font-semibold leading-tight">{user?.fullName || 'User Name'}</div>
              <div className="text-indigo-200 text-xs">{user?.role || 'Basic Member'}</div>
            </div>
            <button onClick={logout} title="Logout" className="ml-2 p-2 rounded-full bg-white hover:bg-indigo-100 transition-all">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col px-4 py-4 gap-4 relative text-xs bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex-1 flex flex-col gap-8"
            >
              <h1 className="text-2xl font-extrabold mb-2 text-blue-900 tracking-tight">Settings</h1>
              {/* Tabs */}
              <div className="flex gap-4 border-b mb-8 sticky top-14 bg-white/80 z-10 backdrop-blur-lg">
                {tabSections.map(tab => (
                  <button
                    key={tab.label}
                    className={`py-2 px-4 font-semibold border-b-2 transition-all duration-150 rounded-t-lg ${activeTab === tab.label ? 'border-indigo-600 text-indigo-700 bg-white shadow' : 'border-transparent text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                    onClick={() => setActiveTab(tab.label)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Tab Content - open, not in a single container */}
              {activeTab === 'Profile' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg relative">
                    {/* Profile Picture settings at top right */}
                    <div className="absolute top-6 right-8 z-10">
                      <div className="relative group">
                        {/* Default avatar image */}
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="24" fill="#E5E7EB"/>
                            <circle cx="24" cy="20" r="8" fill="#BDBDBD"/>
                            <path d="M12 38c0-5.333 7.333-8 12-8s12 2.667 12 8v2H12v-2z" fill="#BDBDBD"/>
                          </svg>
                        </div>
                        {/* Smaller pencil icon overlay */}
                        <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="8" fill="#1976D2"/>
                            <path d="M6 13.5V15h1.5l5.06-5.06-1.5-1.5L6 13.5zm7.04-6.04a.75.75 0 0 0-1.06 0l-1.02 1.02 1.5 1.5 1.02-1.02a.75.75 0 0 0 0-1.06l-.44-.44z" fill="#fff"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">Your Profile <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold">Recruiter</span></h2>
                    <p className="mb-4 text-gray-500 text-xs">Update your profile and company details here</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Name</label>
                        <div className="relative">
                          <input type="text" className="peer w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-xs" placeholder=" " value={editableProfile.name} onChange={e => setEditableProfile({ ...editableProfile, name: e.target.value })} />
                          {editableProfile.name && (
                            <span className="absolute left-4 top-1 text-xs text-gray-400 peer-focus:text-indigo-600 transition-all"></span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <input type="email" className="peer w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-xs" placeholder=" " value={editableProfile.email} onChange={e => setEditableProfile({ ...editableProfile, email: e.target.value })} />
                          {editableProfile.email && (
                            <span className="absolute left-4 top-1 text-xs text-gray-400 peer-focus:text-indigo-600 transition-all"></span>
                          )}
                {/* Save Profile button removed. Changes will be saved with main Save Changes button. */}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" placeholder="Enter company name" value={companyDetails.name} onChange={e => setCompanyDetails({ ...companyDetails, name: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Company Website</label>
                        <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" placeholder="https://yourcompany.com" value={companyDetails.website} onChange={e => setCompanyDetails({ ...companyDetails, website: e.target.value })} />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Industry</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" placeholder="e.g. Software, Healthcare" value={companyDetails.industry} onChange={e => setCompanyDetails({ ...companyDetails, industry: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Company Size</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" value={companyDetails.size} onChange={e => setCompanyDetails({ ...companyDetails, size: e.target.value })}>
                          <option value="">Select size</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-1000">201-1000</option>
                          <option value=">1000">1000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Company Address</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" placeholder="Enter address" value={companyDetails.address} onChange={e => setCompanyDetails({ ...companyDetails, address: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Company Description</label>
                      <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" rows={2} placeholder="Describe your company" value={companyDetails.description} onChange={e => setCompanyDetails({ ...companyDetails, description: e.target.value })} />
                    </div>
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-2 text-blue-800">Notifications</h3>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={settings.emailNotif} onChange={e => updateSetting('emailNotif', e.target.checked)} className="accent-indigo-600 w-6 h-6 transition-all" />
                          <span className="font-medium text-gray-700">Email Notification</span>
                          <span className="text-xs text-gray-400">You will be notified when a new email arrives.</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-indigo-600 w-6 h-6 transition-all" />
                          <span className="font-medium text-gray-700">Sound Notification</span>
                          <span className="text-xs text-gray-400">You will be notified with sound when someone messages you.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'Screening' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">Screening Preferences <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-xs font-semibold">AI Powered</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Minimum Similarity Score</label>
                        <input type="range" min="0" max="1" step="0.01" value={settings.minScore} onChange={e => updateSetting('minScore', Number(e.target.value))} className="w-full accent-indigo-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{settings.minScore}</span>
                          <span>1</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Best for Hire Threshold</label>
                        <input type="range" min="0" max="1" step="0.01" value={settings.thresholds.best} onChange={e => updateThresholds('best', Number(e.target.value))} className="w-full accent-cyan-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{settings.thresholds.best}</span>
                          <span>1</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Consider for Interview Threshold</label>
                        <input type="range" min="0" max="1" step="0.01" value={settings.thresholds.consider} onChange={e => updateThresholds('consider', Number(e.target.value))} className="w-full accent-blue-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{settings.thresholds.consider}</span>
                          <span>1</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Skill Extraction Method <span className="ml-1 text-xs text-gray-400" title="Choose NLP model">?</span></label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all">
                          <option value="default">Default NLP Model</option>
                          <option value="advanced">Advanced Model</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" className="accent-indigo-600 w-6 h-6 transition-all" />
                        <span className="font-medium text-gray-700">Enable Automatic Skill Matching</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'Resume' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">Resume & Job Description Handling <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">Upload</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Allowed Resume Formats</label>
                        <div className="flex gap-2">
                          <button className={`px-4 py-2 rounded-lg border ${settings.resumeFormat.includes('PDF') ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'} transition-all`}>PDF</button>
                          <button className={`px-4 py-2 rounded-lg border ${settings.resumeFormat.includes('DOCX') ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'} transition-all`}>DOCX</button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Select one or more formats. Only PDF and DOCX supported.</div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                        <input type="range" min="1" max="20" value={settings.maxFileSize} onChange={e => updateSetting('maxFileSize', Number(e.target.value))} className="w-full accent-indigo-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>1MB</span>
                          <span>{settings.maxFileSize}MB</span>
                          <span>20MB</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={settings.duplicateDetection} onChange={e => updateSetting('duplicateDetection', e.target.checked)} className="accent-indigo-600 w-6 h-6 transition-all" />
                        <span className="font-medium text-gray-700">Enable Duplicate Resume Detection</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" className="accent-indigo-600 w-6 h-6 transition-all" />
                        <span className="font-medium text-gray-700">Anonymize Resumes for Unbiased Screening</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'Notifications' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">Notifications & Alerts <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold">Integrations</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-medium text-gray-700">Email Notification</span>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.emailNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              onClick={() => updateSetting('emailNotif', !settings.emailNotif)}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${settings.emailNotif ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-medium text-gray-700">Sound Notification</span>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.soundNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              onClick={() => updateSetting('soundNotif', !settings.soundNotif)}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${settings.soundNotif ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-medium text-gray-700">Push Notification</span>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.pushNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              onClick={() => updateSetting('pushNotif', !settings.pushNotif)}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${settings.pushNotif ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-medium text-gray-700">SMS Notification</span>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.smsNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              onClick={() => updateSetting('smsNotif', !settings.smsNotif)}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${settings.smsNotif ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-medium text-gray-700">WhatsApp Notification</span>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.whatsappNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                              onClick={() => updateSetting('whatsappNotif', !settings.whatsappNotif)}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${settings.whatsappNotif ? 'translate-x-6' : 'translate-x-1'}`}
                              />
                            </button>
                          </label>
                        </div>
                        <label className="block font-medium text-gray-700 mb-1">Notification Frequency</label>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 rounded-lg border bg-indigo-600 text-white">Immediate</button>
                          <button className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700">Daily</button>
                          <button className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700">Weekly</button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Integrations</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" placeholder="Slack/Teams Webhook URL" />
                        <div className="flex gap-2 mt-2">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Connected</span>
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-semibold">Disconnected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'Security' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">Security & Privacy <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">Secure</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Data Retention (months)</label>
                        <input type="range" min="1" max="60" value={settings.dataRetention} onChange={e => updateSetting('dataRetention', Number(e.target.value))} className="w-full accent-indigo-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>1</span>
                          <span>{settings.dataRetention}</span>
                          <span>60</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg> Download Activity Log</button>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Team Member Permissions</label>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 rounded-lg border bg-indigo-600 text-white">Admin</button>
                          <button className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700">Recruiter</button>
                          <button className="px-4 py-2 rounded-lg border bg-gray-50 text-gray-700">Viewer</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" className="accent-indigo-600 w-6 h-6 transition-all" />
                        <span className="font-medium text-gray-700">Enable Two-Factor Authentication</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'General' && (
                <section className="mb-8 animate-fade-in">
                  <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800 flex items-center gap-2">General Application Settings <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold">App</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Language</label>
                        <div className="flex gap-2">
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('language', 'en')}
                          >English</button>
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.language === 'es' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('language', 'es')}
                          >Spanish</button>
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.language === 'fr' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('language', 'fr')}
                          >French</button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Theme</label>
                        <div className="flex gap-2">
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('theme', 'light')}
                          >Light</button>
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('theme', 'dark')}
                          >Dark</button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Export Format</label>
                        <div className="flex gap-2">
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.exportFormat === 'CSV' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('exportFormat', 'CSV')}
                          >CSV</button>
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.exportFormat === 'Excel' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('exportFormat', 'Excel')}
                          >Excel</button>
                          <button
                            className={`px-4 py-2 rounded-lg border ${settings.exportFormat === 'PDF' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'}`}
                            onClick={() => updateSetting('exportFormat', 'PDF')}
                          >PDF</button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Table Display Options</label>
                        <div className="flex gap-2">
                          {['Name', 'Score', 'Category', 'Email'].map(col => (
                            <label key={col} className="flex items-center gap-2 cursor-pointer">
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
                                className="accent-indigo-600 w-6 h-6 transition-all"
                              />
                              <span className="font-medium text-gray-700">{col}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={settings.colorCoding} onChange={e => updateSetting('colorCoding', e.target.checked)} className="accent-indigo-600 w-6 h-6 transition-all" />
                        <span className="font-medium text-gray-700">Enable Color Coding in Results Table</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg mt-4 font-bold text-lg hover:scale-105 transition-all" onClick={handleSave}>Save Changes</button>
              {saveStatus && <p className="text-green-600 mt-2">{saveStatus}</p>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
