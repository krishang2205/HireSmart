import React, { useEffect, useState } from 'react';
import Brand from '@/components/Brand';
import Footer from '@/components/Footer';

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
  profile: { name: '', email: '', password: '' },
  minScore: 0.7,
  thresholds: { best: 0.85, consider: 0.7 },
  resumeFormat: ['PDF', 'DOCX'],
  maxFileSize: 5,
  duplicateDetection: true,
  emailNotif: true,
  tableColumns: ['Name', 'Score', 'Category'],
  colorCoding: true,
  exportFormat: 'CSV',
  dataRetention: 12,
  theme: 'light',
  language: 'en',
};

const sidebarLinks = [
  { label: 'Resume Screening', href: '#' },
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
  // State
  const [settings, setSettings] = useState(initialState);
  const [profileErrors, setProfileErrors] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');

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
      setSettings(data);
      setLoading(false);
    });
  }, []);

  // Save settings handler
  const handleSave = async () => {
    setSaveStatus('');
    const res = await saveSettings(settings);
    if (res.success) setSaveStatus('Settings saved!');
    else setSaveStatus('Failed to save settings.');
  };

  // Handlers for updating state
  const updateProfile = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };
  const updateSetting = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  const updateThresholds = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, thresholds: { ...prev.thresholds, [field]: value } }));
  };

  if (loading) return <div className="p-8 text-center text-blue-700">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col text-sm">
      {/* Header */}
      <header className="flex items-center justify-between px-0 py-2 bg-indigo-50/80 shadow-sm w-full z-10 text-sm">
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
        <aside className="w-56 bg-blue-100 border-r border-gray-200 flex flex-col shadow-sm pt-0 text-sm min-h-full">
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
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col px-8 py-8 gap-8 relative text-sm bg-white">
          <h1 className="text-3xl font-bold mb-4 text-blue-900">Settings</h1>
          {/* Tabs */}
          <div className="flex gap-4 border-b mb-8">
            {tabSections.map(tab => (
              <button
                key={tab.label}
                className={`py-2 px-4 font-medium border-b-2 transition-all duration-150 ${activeTab === tab.label ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-indigo-600'}`}
                onClick={() => setActiveTab(tab.label)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content - open, not in a single container */}
          {activeTab === 'Profile' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Your Profile</h2>
              <p className="mb-6 text-gray-500">Update your profile settings here</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Name" value={settings.profile.name} onChange={e => updateProfile('name', e.target.value)} />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Email" value={settings.profile.email} onChange={e => updateProfile('email', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=User&background=6D28D9&color=fff&size=48" alt="avatar" className="h-12 w-12 rounded-full border-2 border-indigo-300" />
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                    <button className="bg-red-100 text-red-600 px-3 py-1 rounded">Delete</button>
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Biography</label>
                  <textarea className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" rows={3} placeholder="Tell us about yourself..." />
                  <div className="text-xs text-gray-400 mt-1">325 characters remaining</div>
                </div>
              </div>
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Notifications</h3>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={settings.emailNotif} onChange={e => updateSetting('emailNotif', e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">Email Notification</span>
                    <span className="text-xs text-gray-400">You will be notified when a new email arrives.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-indigo-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">Sound Notification</span>
                    <span className="text-xs text-gray-400">You will be notified with sound when someone messages you.</span>
                  </label>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'Screening' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Screening Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Minimum Similarity Score</label>
                  <input type="number" min="0" max="1" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.minScore} onChange={e => updateSetting('minScore', Number(e.target.value))} />
                  <div className="text-xs text-gray-400 mt-1">Set between 0 and 1. Higher means stricter matching.</div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Best for Hire Threshold</label>
                  <input type="number" min="0" max="1" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.thresholds.best} onChange={e => updateThresholds('best', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Consider for Interview Threshold</label>
                  <input type="number" min="0" max="1" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.thresholds.consider} onChange={e => updateThresholds('consider', Number(e.target.value))} />
                  <div className="text-xs text-gray-400 mt-1">Thresholds must be between 0 and 1.</div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Skill Extraction Method</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    <option value="default">Default NLP Model</option>
                    <option value="advanced">Advanced Model</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="accent-indigo-600 w-5 h-5" />
                  <span className="font-medium text-gray-700">Enable Automatic Skill Matching</span>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'Resume' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Resume & Job Description Handling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Allowed Resume Formats</label>
                  <select multiple className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.resumeFormat} onChange={e => updateSetting('resumeFormat', Array.from(e.target.selectedOptions, option => option.value))}>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                  </select>
                  <div className="text-xs text-gray-400 mt-1">Select one or more formats. Only PDF and DOCX supported.</div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                  <input type="number" min="1" max="20" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.maxFileSize} onChange={e => updateSetting('maxFileSize', Number(e.target.value))} />
                  <div className="text-xs text-gray-400 mt-1">Maximum allowed file size is 20MB.</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={settings.duplicateDetection} onChange={e => updateSetting('duplicateDetection', e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                  <span className="font-medium text-gray-700">Enable Duplicate Resume Detection</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="accent-indigo-600 w-5 h-5" />
                  <span className="font-medium text-gray-700">Anonymize Resumes for Unbiased Screening</span>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'Notifications' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Notifications & Alerts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={settings.emailNotif} onChange={e => updateSetting('emailNotif', e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">Email Notification</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-indigo-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">Sound Notification</span>
                  </label>
                  <label className="block font-medium text-gray-700 mb-1">Notification Frequency</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Integrations</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Slack/Teams Webhook URL" />
                </div>
              </div>
            </section>
          )}
          {activeTab === 'Security' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Security & Privacy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Data Retention (months)</label>
                  <input type="number" min="1" max="60" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.dataRetention} onChange={e => updateSetting('dataRetention', Number(e.target.value))} />
                  <div className="text-xs text-gray-400 mt-1">How long your data is stored. Max 60 months.</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Download Activity Log</button>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Team Member Permissions</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    <option value="admin">Admin</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="accent-indigo-600 w-5 h-5" />
                  <span className="font-medium text-gray-700">Enable Two-Factor Authentication</span>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'General' && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">General Application Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Language</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.language} onChange={e => updateSetting('language', e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Theme</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.theme} onChange={e => updateSetting('theme', e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Export Format</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.exportFormat} onChange={e => updateSetting('exportFormat', e.target.value)}>
                    <option value="CSV">CSV</option>
                    <option value="Excel">Excel</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Table Display Options</label>
                  <select multiple className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" value={settings.tableColumns} onChange={e => updateSetting('tableColumns', Array.from(e.target.selectedOptions, option => option.value))}>
                    <option value="Name">Name</option>
                    <option value="Score">Score</option>
                    <option value="Category">Category</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={settings.colorCoding} onChange={e => updateSetting('colorCoding', e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                  <span className="font-medium text-gray-700">Enable Color Coding in Results Table</span>
                </div>
              </div>
            </section>
          )}
          <button className="bg-indigo-600 text-white px-6 py-2 rounded mt-4">Save Changes</button>
          {saveStatus && <p className="text-green-600 mt-2">{saveStatus}</p>}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
