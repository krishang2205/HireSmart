import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import AssessmentButton from '@/components/AssessmentButton';
import RefreshButton from '@/components/RefreshButton';

  // Statuses remain static
  const statuses = ['Pending Communication', 'Communication Sent', 'Assessment Assigned', 'Assessment Completed', 'Rejected'];
  // Gemini categories (fixed)
  const categories = [
    'Best Match',
    'Can consider for interview',
    'Not Good Candidate',
    'Consider with Caution'
  ];

export default function NextSteps() {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '', jobRole: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null); // timestamp in ms when data last successfully fetched
  const [now, setNow] = useState(Date.now()); // ticking time reference for relative display
  const { push } = useToast();

  // Fetch candidates from the database on component mount
  // Fetch candidates from the database
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      // Always fetch all candidates
      const response = await fetch('/api/match-results');
      if (response.ok) {
        const data = await response.json();
        const transformedCandidates = data.map((candidate, index) => ({
          _id: candidate._id || `candidate-${index + 1}`,
          name: candidate.candidateName || 'Name not found',
          resumeScore: candidate.matchScore || 0,
          category: candidate.prediction || 'Not categorized',
          contactInfo: { 
            email: candidate.email || 'Email not found', 
            phone: candidate.contactNumber || 'Phone not found' 
          },
          status: candidate.status || 'Pending Communication',
          assessmentScore: null,
          finalRank: null,
          filename: candidate.filename || 'Unknown file',
          jobRole: candidate.jobRole || ''
        }));
        setCandidates(transformedCandidates);
  setLastUpdated(Date.now());
      } else {
        setCandidates([]);
      }
    } catch (error) {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Tick every 60s to update relative time string
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format relative time
  const formatTimeAgo = (ts: number) => {
    const diff = now - ts; // ms
    const sec = Math.max(0, Math.floor(diff / 1000));
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ${min % 60}m`;
    const days = Math.floor(hr / 24);
    return `${days}d`;
  };

  const availableJobRoles = Array.from(new Set(candidates.map(c => c.jobRole).filter(Boolean))).sort();

  // Analytics
  const total = candidates.length;
  const pending = candidates.filter(c => c.status === 'Pending Communication').length;
  const completed = candidates.filter(c => c.status === 'Assessment Completed').length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  // Color helpers matching your theme
  const getCategoryColor = (cat) => {
    if (cat === 'Best Match' || cat === 'Best one') return { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-600' };
    if (cat === 'Can consider for interview' || cat === 'Can consider') return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
    if (cat === 'Consider with Caution') return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
  };

  const getStatusColor = (status) => {
    if (status === 'Pending Communication') return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
    if (status === 'Communication Sent') return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    if (status === 'Assessment Assigned') return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' };
    if (status === 'Assessment Completed') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    if (status === 'Rejected') return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  // Filtering logic
  const filteredCandidates = candidates.filter(c =>
    (!filter.category || c.category === filter.category) &&
    (!filter.status || c.status === filter.status) &&
    (!filter.jobRole || c.jobRole === filter.jobRole) &&
    (search === '' || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSendCommunication = async (id) => {
    try {
      const response = await fetch('/api/match-results/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId: id })
      });

      const result = await response.json();

      if (result.success) {
        // Update the candidate status in the local state
        setCandidates(prevCandidates => 
          prevCandidates.map(candidate => 
            candidate._id === id 
              ? { ...candidate, status: 'Communication Sent' }
              : candidate
          )
        );
        
        push({ variant: 'success', title: 'Email sent', description: `Email sent to ${result.candidate.name}` });
      } else {
        push({ variant: 'destructive', title: 'Failed to send email', description: result.error || 'Please try again.' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      push({ variant: 'destructive', title: 'Failed to send email', description: 'Please try again.' });
    }
  };

  const handleSendBulkByCategory = async () => {
    if (!filter.category) {
      push({ variant: 'destructive', title: 'Select a category', description: 'Choose a category to send emails.' });
      return;
    }
    const targets = candidates.filter(c => c.category === filter.category && c.status !== 'Communication Sent');
    if (targets.length === 0) {
      push({ variant: 'default', title: 'Nothing to send', description: 'All candidates in this category are already contacted.' });
      return;
    }
    setSendingBulk(true);
    let success = 0;
    let failed = 0;
    for (const cand of targets) {
      try {
        const response = await fetch('/api/match-results/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: cand._id })
        });
        const result = await response.json();
        if (response.ok && result.success) {
          success++;
          setCandidates(prev => prev.map(c => c._id === cand._id ? { ...c, status: 'Communication Sent' } : c));
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
    setSendingBulk(false);
    push({ variant: failed ? 'default' : 'success', title: 'Bulk send complete', description: `Success: ${success}, Failed: ${failed}` });
  };

  const handleAssignAssessment = async (id) => {
    // Implementation for assigning assessment
    console.log('Assigning assessment to:', id);
  };

  const handleViewAssessmentScore = async (id) => {
    // Implementation for viewing assessment score
    console.log('Viewing assessment score for:', id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading candidates...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-indigo-700 tracking-tight"
              >
                Next Steps
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-blue-900/80"
              >
                Manage shortlisted candidates through the hiring process
              </motion.p>
            </div>
            {/* (Removed old header refresh button) */}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress + 20, 100)}%` }}
            ></div>
          </div>
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
              <span>Hiring Pipeline Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>{completed} Assessments Complete</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>{pending} Pending Actions</span>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Candidates */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-indigo-700 group-hover:text-indigo-800 transition-colors">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-700">Candidates</div>
            <div className="mt-1 text-xs text-gray-400">Shortlisted for review</div>
          </motion.div>

          {/* Pending Communications */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{pending}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-700">Communications</div>
            <div className="mt-1 text-xs text-gray-400">Awaiting response</div>
          </motion.div>

          {/* Assessments Completed */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors">{completed}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-700">Assessments</div>
            <div className="mt-1 text-xs text-gray-400">Ready for review</div>
          </motion.div>

          {/* Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-cyan-600 group-hover:text-cyan-700 transition-colors">{progress}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs font-semibold text-gray-700">Pipeline</div>
            <div className="mt-1 text-xs text-gray-400">Overall completion</div>
          </motion.div>
        </div>

        {/* Candidate Management Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-800 mb-1">Candidate Management</h2>
                <p className="text-sm text-gray-600">Filter and manage your shortlisted candidates</p>
              </div>
              <div className="flex flex-col items-center ml-2">
                <RefreshButton onClick={fetchCandidates} loading={loading} size={60} />
                {lastUpdated && (
                  <span className="mt-1 text-[11px] text-gray-500 whitespace-nowrap" title={new Date(lastUpdated).toLocaleString()}>
                    Updated {formatTimeAgo(lastUpdated)} ago
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm"
              />
            </div>

            {/* Job Role Filter */}
            <select
              value={filter.jobRole}
              onChange={(e) => setFilter({ ...filter, jobRole: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all min-w-[160px] text-sm"
            >
              <option value="">All Roles</option>
              {availableJobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all min-w-[140px] text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Bulk Send Button (by selected category) */}
            <button
              onClick={handleSendBulkByCategory}
              disabled={!filter.category || sendingBulk}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all min-w-[180px] ${
                !filter.category || sendingBulk
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              {sendingBulk ? 'Sending…' : `Send All in ${filter.category || 'Category'}`}
            </button>

            {/* Assessment Button */}
            <AssessmentButton
              variant="secondary"
              size="md"
              onAssessmentCreated={() => {
                push({
                  title: "Assessment Created",
                  description: "Assessment has been created successfully!",
                });
              }}
            >
              Create Assessment
            </AssessmentButton>

            {/* Status Filter */}
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all min-w-[140px] text-sm"
            >
              <option value="">All Statuses</option>
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Candidates Table */}
          {/* Active Role Title */}
          <div className="mb-2 px-1">
            <h3 className="text-sm font-semibold text-indigo-700">
              {filter.jobRole ? `Role: ${filter.jobRole}` : 'All Roles'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Resume Score</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Contact Info</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Assessment Score</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Final Rank</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-base font-medium">No candidates found</p>
                        <p className="text-xs mb-3">Please complete resume screening first to see shortlisted candidates here.</p>
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          Go to Resume Screening
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate, index) => (
                    <motion.tr 
                      key={candidate._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-900 text-sm">{candidate.name}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {candidate.resumeScore ? `${(candidate.resumeScore * 100).toFixed(0)}/100` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(candidate.category).bg} ${getCategoryColor(candidate.category).text} ${getCategoryColor(candidate.category).border}`}>
                          {candidate.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs">
                          <div className="text-gray-900">{candidate.contactInfo?.email}</div>
                          <div className="text-gray-500">{candidate.contactInfo?.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status).bg} ${getStatusColor(candidate.status).text} ${getStatusColor(candidate.status).border}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {candidate.assessmentScore ? `${candidate.assessmentScore}/100` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                          {candidate.finalRank ? `${candidate.finalRank}/100` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSendCommunication(candidate._id)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send
                          </button>
                          {candidate.category !== 'Not Good Candidate' && (
                            <>
                              <button
                                onClick={() => handleAssignAssessment(candidate._id)}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Assess
                              </button>
                              <button
                                onClick={() => handleViewAssessmentScore(candidate._id)}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                View
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
