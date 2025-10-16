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

  const handleDeleteCandidate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete candidate ${name}?`)) return;
    try {
      const response = await fetch(`/api/match-results/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok && result.success) {
        push({ variant: 'success', title: 'Candidate Deleted', description: `Successfully removed ${name}` });
        setCandidates(prev => prev.filter(c => c._id !== id));
      } else {
        push({ variant: 'destructive', title: 'Delete Failed', description: result.error || 'Could not delete candidate' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      push({ variant: 'destructive', title: 'Error', description: 'Failed to delete candidate' });
    }
  };

  /* Assessment Modal State */
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);

  const handleViewAssessmentScore = async (id) => {
    const candidate = candidates.find(c => c._id === id);
    if (candidate) {
      // Fetch fresh details if needed, or use what's in local state.
      // Since list endpoints might not return full nested details for performance, 
      // we might want a fetch here. But assuming for now 'candidate' object has it 
      // or we need to fetch it from the API.
      // Let's first try to find it in the state, but 'assessmentDetails' wasn't mapped in fetchCandidates.

      // We need to fetch the single candidate or ensure list has details. 
      // Let's quickly fetch the single candidate to get full details including assessmentDetails.
      try {
        const response = await fetch(`/api/match-results`);
        // Note: Optimally we should have a get-by-id endpoint, but we can reuse the list for now or add one.
        // Wait, we can reuse the existing state if we map it correctly.
        // Let's update fetchCandidates to include assessmentDetails first.
        const res = await fetch(`/api/match-results`);
        if (res.ok) {
          const data = await res.json();
          const fullCandidate = data.find((c: any) => c._id === id);
          if (fullCandidate) {
            setCurrentAssessment(fullCandidate);
            setAssessmentModalOpen(true);
          }
        }
      } catch (e) {
        console.error("Failed to fetch assessment details", e);
      }
    }
  };

  const closeAssessmentModal = () => {
    setAssessmentModalOpen(false);
    setCurrentAssessment(null);
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all min-w-[180px] ${!filter.category || sendingBulk
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
                          <button
                            onClick={() => handleDeleteCandidate(candidate._id, candidate.name)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Clear Candidate"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {assessmentModalOpen && currentAssessment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" style={{ backdropFilter: 'blur(3px)' }}>
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto transform transition-all scale-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none z-10"
                onClick={closeAssessmentModal}
              >
                &times;
              </button>

              <div className="mb-6 relative">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-indigo-50 rounded-br-full -z-10 opacity-50"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{currentAssessment.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Assessment Report
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl flex flex-col items-center justify-center border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-bl-full opacity-50"></div>
                  <span className="text-indigo-600 font-bold text-sm mb-2 uppercase tracking-wider">Total Score</span>
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="#e0e7ff" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="60" stroke="#4f46e5" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - (currentAssessment.assessmentScore || 0) / 100)} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-extrabold text-indigo-700">{currentAssessment.assessmentScore}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 mt-3 font-medium bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Raw: {currentAssessment.assessmentDetails?.totalScore} / {currentAssessment.assessmentDetails?.maxScore}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completed On</h4>
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {currentAssessment.assessmentCompletedAt
                        ? new Date(currentAssessment.assessmentCompletedAt).toLocaleDateString() + ' ' + new Date(currentAssessment.assessmentCompletedAt).toLocaleTimeString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</h4>
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {currentAssessment.assessmentDetails?.timeTaken || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience Level</h4>
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {currentAssessment.assessmentDetails?.experienceLevel || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections Breakdown */}
              {currentAssessment.assessmentDetails?.sections && Array.isArray(currentAssessment.assessmentDetails.sections) && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Detailed Performance</h4>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>

                  {currentAssessment.assessmentDetails.sections.map((section: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-gray-50/50 px-5 py-4 flex justify-between items-center border-b border-gray-100">
                        <h5 className="font-bold text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          {section.name}
                        </h5>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-gray-500 font-medium">Score: {section.score}/{section.maxScore}</div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${section.percentage >= 70 ? 'bg-green-100 text-green-700 border border-green-200' : section.percentage >= 40 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {section.percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Questions Accordion (Simplified as list for now) */}
                      {section.questions && Array.isArray(section.questions) && (
                        <div className="divide-y divide-gray-100">
                          {section.questions.map((q: any, qIdx: number) => (
                            <div key={qIdx} className="p-5 hover:bg-gray-50 transition-colors group">
                              <div className="flex justify-between gap-4 mb-3">
                                <p className="text-sm font-medium text-gray-800 flex-1 leading-relaxed"><span className="text-gray-400 mr-2">Q{qIdx + 1}.</span>{q.question}</p>
                                <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {q.isCorrect ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                  <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Candidate Answer</span>
                                  <span className={`font-medium ${q.isCorrect ? 'text-green-700' : 'text-red-600'}`}>{q.userAnswer}</span>
                                </div>
                                {!q.isCorrect && (
                                  <div>
                                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Correct Answer</span>
                                    <span className="font-medium text-green-700">{q.correctAnswer}</span>
                                  </div>
                                )}
                              </div>
                              {q.feedback && (
                                <div className="mt-3 flex gap-2 items-start text-xs text-blue-800 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                  <span className="text-lg">💡</span>
                                  <span className="leading-relaxed opacity-90">{q.feedback}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback for old simple key-value structure */}
              {currentAssessment.assessmentDetails && !Array.isArray(currentAssessment.assessmentDetails.sections) && typeof currentAssessment.assessmentDetails === 'object' && !('sections' in currentAssessment.assessmentDetails) && (
                <div>
                  <h4 className="border-l-4 border-indigo-600 pl-3 text-lg font-bold text-gray-800 mb-4">Performance Breakdown</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(currentAssessment.assessmentDetails).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                        <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end sticky bottom-0 bg-white p-4 border-t border-gray-100 -mx-6 -mb-6 rounded-b-xl z-10">
                <button
                  onClick={closeAssessmentModal}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl font-medium text-sm flex items-center gap-2"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

