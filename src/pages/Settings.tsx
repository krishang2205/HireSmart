import React, { useEffect, useState } from 'react';

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

const Settings = () => {
  // State
  const [settings, setSettings] = useState(initialState);
  const [profileErrors, setProfileErrors] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

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
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-blue-900">Settings</h1>
      <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
        {/* User Account & Profile */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">User Account & Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" className={inputClass} placeholder="Name" value={settings.profile.name} onChange={e => updateProfile('name', e.target.value)} />
              {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} placeholder="Email" value={settings.profile.email} onChange={e => updateProfile('email', e.target.value)} />
              {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" className={inputClass} placeholder="Password (min 6 chars)" value={settings.profile.password} onChange={e => updateProfile('password', e.target.value)} />
              {profileErrors.password && <p className="text-red-500 text-xs mt-1">{profileErrors.password}</p>}
            </div>
          </div>
          <button className={buttonClass + ' mt-4'} onClick={validateProfile}>Update Profile</button>
        </section>
        {/* Screening Preferences */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Screening Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Minimum Similarity Score</label>
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={settings.minScore} onChange={e => updateSetting('minScore', Number(e.target.value))} />
              <p className={helperClass}>Set between 0 and 1. Higher means stricter matching.</p>
            </div>
            <div>
              <label className={labelClass}>Best for Hire Threshold</label>
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={settings.thresholds.best} onChange={e => updateThresholds('best', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Consider for Interview Threshold</label>
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={settings.thresholds.consider} onChange={e => updateThresholds('consider', Number(e.target.value))} />
              <p className={helperClass}>Thresholds must be between 0 and 1.</p>
            </div>
          </div>
        </section>
        {/* Resume & Job Description Handling */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Resume & Job Description Handling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Allowed Resume Formats</label>
              <select multiple className={inputClass} value={settings.resumeFormat} onChange={e => updateSetting('resumeFormat', Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
              </select>
              <p className={helperClass}>Select one or more formats. Only PDF and DOCX supported.</p>
            </div>
            <div>
              <label className={labelClass}>Max File Size (MB)</label>
              <input type="number" min="1" max="20" className={inputClass} value={settings.maxFileSize} onChange={e => updateSetting('maxFileSize', Number(e.target.value))} />
              <p className={helperClass}>Maximum allowed file size is 20MB.</p>
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" checked={settings.duplicateDetection} onChange={e => updateSetting('duplicateDetection', e.target.checked)} className="mr-2" />
              <span className="text-gray-700">Enable Duplicate Resume Detection</span>
            </div>
          </div>
        </section>
        {/* Notifications & Alerts */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Notifications & Alerts</h2>
          <div className="flex items-center">
            <input type="checkbox" checked={settings.emailNotif} onChange={e => updateSetting('emailNotif', e.target.checked)} className="mr-2" />
            <span className="text-gray-700">Email notifications for new results</span>
          </div>
          <p className={helperClass}>Receive updates when new screening results are available.</p>
        </section>
        {/* Visualization & Results */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Visualization & Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Table Columns</label>
              <select multiple className={inputClass} value={settings.tableColumns} onChange={e => updateSetting('tableColumns', Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="Name">Name</option>
                <option value="Score">Score</option>
                <option value="Category">Category</option>
                <option value="Email">Email</option>
              </select>
              <p className={helperClass}>Choose which columns to display in results table.</p>
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" checked={settings.colorCoding} onChange={e => updateSetting('colorCoding', e.target.checked)} className="mr-2" />
              <span className="text-gray-700">Enable color coding in results table</span>
            </div>
            <div>
              <label className={labelClass}>Export Format</label>
              <select className={inputClass} value={settings.exportFormat} onChange={e => updateSetting('exportFormat', e.target.value)}>
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
                <option value="PDF">PDF</option>
              </select>
              <p className={helperClass}>Select format for exporting results.</p>
            </div>
          </div>
        </section>
        {/* Security & Privacy */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Security & Privacy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data Retention (months)</label>
              <input type="number" min="1" max="60" className={inputClass} value={settings.dataRetention} onChange={e => updateSetting('dataRetention', Number(e.target.value))} />
              <p className={helperClass}>How long your data is stored. Max 60 months.</p>
            </div>
            <div className="flex items-center mt-2">
              <button className={buttonClass}>Download Activity Log</button>
            </div>
          </div>
        </section>
        {/* General Application Settings */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">General Application Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Language</label>
              <select className={inputClass} value={settings.language} onChange={e => updateSetting('language', e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <p className={helperClass}>Select your preferred language.</p>
            </div>
            <div>
              <label className={labelClass}>Theme</label>
              <select className={inputClass} value={settings.theme} onChange={e => updateSetting('theme', e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p className={helperClass}>Choose between light and dark mode.</p>
            </div>
          </div>
        </section>
        {/* Save Button */}
        <button className={buttonClass + ' mt-6'} onClick={handleSave}>Save All Settings</button>
        {saveStatus && <p className="text-green-600 mt-2">{saveStatus}</p>}
      </div>
    </div>
  );
};

export default Settings;
