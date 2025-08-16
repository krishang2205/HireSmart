import React, { useState } from 'react';

const Settings = () => {
  // Example state hooks for form fields
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
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

  return (
    <div className="min-h-screen bg-blue-50 p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Settings</h1>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* User Account & Profile */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">User Account & Profile</h2>
          <div className="space-y-4">
            <input type="text" className="input" placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            <input type="email" className="input" placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            <input type="password" className="input" placeholder="Password" value={profile.password} onChange={e => setProfile({ ...profile, password: e.target.value })} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
          </div>
        </section>
        {/* Screening Preferences */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Screening Preferences</h2>
          <div className="space-y-4">
            <label className="block">Minimum Similarity Score
              <input type="number" min="0" max="1" step="0.01" className="input ml-2" value={minScore} onChange={e => setMinScore(Number(e.target.value))} />
            </label>
            <label className="block">Best for Hire Threshold
              <input type="number" min="0" max="1" step="0.01" className="input ml-2" value={thresholds.best} onChange={e => setThresholds({ ...thresholds, best: Number(e.target.value) })} />
            </label>
            <label className="block">Consider for Interview Threshold
              <input type="number" min="0" max="1" step="0.01" className="input ml-2" value={thresholds.consider} onChange={e => setThresholds({ ...thresholds, consider: Number(e.target.value) })} />
            </label>
          </div>
        </section>
        {/* Resume & Job Description Handling */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Resume & Job Description Handling</h2>
          <div className="space-y-4">
            <label className="block">Allowed Resume Formats
              <select multiple className="input ml-2" value={resumeFormat} onChange={e => setResumeFormat(Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
              </select>
            </label>
            <label className="block">Max File Size (MB)
              <input type="number" min="1" max="20" className="input ml-2" value={maxFileSize} onChange={e => setMaxFileSize(Number(e.target.value))} />
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={duplicateDetection} onChange={e => setDuplicateDetection(e.target.checked)} />
              <span className="ml-2">Enable Duplicate Resume Detection</span>
            </label>
          </div>
        </section>
        {/* Notifications & Alerts */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Notifications & Alerts</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
              <span className="ml-2">Email notifications for new results</span>
            </label>
          </div>
        </section>
        {/* Visualization & Results */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Visualization & Results</h2>
          <div className="space-y-4">
            <label className="block">Table Columns
              <select multiple className="input ml-2" value={tableColumns} onChange={e => setTableColumns(Array.from(e.target.selectedOptions, option => option.value))}>
                <option value="Name">Name</option>
                <option value="Score">Score</option>
                <option value="Category">Category</option>
                <option value="Email">Email</option>
              </select>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={colorCoding} onChange={e => setColorCoding(e.target.checked)} />
              <span className="ml-2">Enable color coding in results table</span>
            </label>
            <label className="block">Export Format
              <select className="input ml-2" value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
                <option value="PDF">PDF</option>
              </select>
            </label>
          </div>
        </section>
        {/* Security & Privacy */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Security & Privacy</h2>
          <div className="space-y-4">
            <label className="block">Data Retention (months)
              <input type="number" min="1" max="60" className="input ml-2" value={dataRetention} onChange={e => setDataRetention(Number(e.target.value))} />
            </label>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Download Activity Log</button>
          </div>
        </section>
        {/* General Application Settings */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">General Application Settings</h2>
          <div className="space-y-4">
            <label className="block">Language
              <select className="input ml-2" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </label>
            <label className="block">Theme
              <select className="input ml-2" value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
