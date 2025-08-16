import React, { useState } from 'react';

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

const Settings = () => {
  // Example state hooks for form fields
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [profileErrors, setProfileErrors] = useState({ name: '', email: '', password: '' });
  const [minScore, setMinScore] = useState(0.7);
  const [thresholds, setThresholds] = useState({ best: 0.85, consider: 0.7 });
  const [resumeFormat, setResumeFormat] = useState(['PDF', 'DOCX']);
  const [maxFileSize, setMaxFileSize] = useState(5);
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [tableColumns, setTableColumns] = useState(['Name', 'Score', 'Category']);
  const [colorCoding, setColorCoding] = useState(true);
  const [exportFormat, setExportFormat] = useState('CSV');
  const [dataRetention, setDataRetention] = useState(12);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  // Validation helpers
  const validateProfile = () => {
    let errors = { name: '', email: '', password: '' };
    if (!profile.name) errors.name = 'Name is required.';
    if (!profile.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.email)) errors.email = 'Valid email is required.';
    if (profile.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    setProfileErrors(errors);
    return !errors.name && !errors.email && !errors.password;
  };

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
              <input type="text" className={inputClass} placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
              {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
              {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" className={inputClass} placeholder="Password (min 6 chars)" value={profile.password} onChange={e => setProfile({ ...profile, password: e.target.value })} />
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
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={minScore} onChange={e => setMinScore(Number(e.target.value))} />
              <p className={helperClass}>Set between 0 and 1. Higher means stricter matching.</p>
            </div>
            <div>
              <label className={labelClass}>Best for Hire Threshold</label>
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={thresholds.best} onChange={e => setThresholds({ ...thresholds, best: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>Consider for Interview Threshold</label>
              <input type="number" min="0" max="1" step="0.01" className={inputClass} value={thresholds.consider} onChange={e => setThresholds({ ...thresholds, consider: Number(e.target.value) })} />
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
              <select multiple className={inputClass} value={resumeFormat} onChange={e => setResumeFormat(Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
              </select>
              <p className={helperClass}>Select one or more formats. Only PDF and DOCX supported.</p>
            </div>
            <div>
              <label className={labelClass}>Max File Size (MB)</label>
              <input type="number" min="1" max="20" className={inputClass} value={maxFileSize} onChange={e => setMaxFileSize(Number(e.target.value))} />
              <p className={helperClass}>Maximum allowed file size is 20MB.</p>
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" checked={duplicateDetection} onChange={e => setDuplicateDetection(e.target.checked)} className="mr-2" />
              <span className="text-gray-700">Enable Duplicate Resume Detection</span>
            </div>
          </div>
        </section>
        {/* Notifications & Alerts */}
        <section className={sectionClass}>
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-800">Notifications & Alerts</h2>
          <div className="flex items-center">
            <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="mr-2" />
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
              <select multiple className={inputClass} value={tableColumns} onChange={e => setTableColumns(Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="Name">Name</option>
                <option value="Score">Score</option>
                <option value="Category">Category</option>
                <option value="Email">Email</option>
              </select>
              <p className={helperClass}>Choose which columns to display in results table.</p>
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" checked={colorCoding} onChange={e => setColorCoding(e.target.checked)} className="mr-2" />
              <span className="text-gray-700">Enable color coding in results table</span>
            </div>
            <div>
              <label className={labelClass}>Export Format</label>
              <select className={inputClass} value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
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
              <input type="number" min="1" max="60" className={inputClass} value={dataRetention} onChange={e => setDataRetention(Number(e.target.value))} />
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
              <select className={inputClass} value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <p className={helperClass}>Select your preferred language.</p>
            </div>
            <div>
              <label className={labelClass}>Theme</label>
              <select className={inputClass} value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p className={helperClass}>Choose between light and dark mode.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
