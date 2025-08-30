import React, { useState, useEffect } from 'react';

interface JobRole {
  _id: string;
  jobRole: string;
  jobDescription: string;
}

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCreated: () => void;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onAssessmentCreated 
}) => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Intermediate');
  const [testDuration, setTestDuration] = useState<number>(45);
  const [aptitudeQuestions, setAptitudeQuestions] = useState<number>(0);
  const [jobRoleQuestions, setJobRoleQuestions] = useState<number>(0);
  const [codingQuestions, setCodingQuestions] = useState<number>(0);
  const [candidatesForRole, setCandidatesForRole] = useState<any[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const durationOptions = [30, 45, 60, 90, 120, 180];

  useEffect(() => {
    if (isOpen) {
      fetchJobRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedJobRole) {
      const selectedRole = jobRoles.find(role => role._id === selectedJobRole);
      if (selectedRole) {
        setJobDescription(selectedRole.jobDescription);
      }
      // Fetch candidates for this job role using backend endpoint
      (async () => {
        try {
          const roleParam = encodeURIComponent(selectedRole.jobRole || '');
          const res = await fetch(`/api/match-results/role/${roleParam}`);
          if (res.ok) {
            const filtered = await res.json();
            setCandidatesForRole(Array.isArray(filtered) ? filtered : []);
            const map: Record<string, boolean> = {};
            (Array.isArray(filtered) ? filtered : []).forEach((c: any) => { map[c._id || c.candidateId || c.filename] = false; });
            setSelectedCandidates(map);
            setSelectAll(false);
          }
        } catch (err) {
          console.error('Failed to fetch candidates for role:', err);
          setCandidatesForRole([]);
        }
      })();
    } else {
      setCandidatesForRole([]);
      setSelectedCandidates({});
      setSelectAll(false);
    }
  }, [selectedJobRole, jobRoles]);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch('/api/assessments/job-roles');
      if (response.ok) {
        const data = await response.json();
        setJobRoles(data);
      }
    } catch (error) {
      console.error('Failed to fetch job roles:', error);
    }
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const allSelected = Object.values(next).every(Boolean) && Object.keys(next).length > 0;
      setSelectAll(allSelected);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(prev => {
      const next = !prev;
      const nextMap: Record<string, boolean> = {};
      candidatesForRole.forEach(c => { nextMap[c._id || c.candidateId || c.filename] = next; });
      setSelectedCandidates(nextMap);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobRole) {
      setError('Please select a job role');
      return;
    }
    const selectedCount = Object.values(selectedCandidates).filter(Boolean).length;
    if (selectedCount === 0) {
      setError('Please select at least one candidate from the chosen job role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const assessmentData = {
        jobRole: jobRoles.find(role => role._id === selectedJobRole)?.jobRole || '',
        jobDescription,
        difficultyLevel,
        testDuration,
        questions: {
          aptitude: aptitudeQuestions,
          jobRole: jobRoleQuestions,
          coding: codingQuestions
        },
        selectedCandidateIds: Object.keys(selectedCandidates).filter(id => selectedCandidates[id])
      };

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        onAssessmentCreated();
        onClose();
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create assessment');
      }
    } catch (error) {
      setError('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
  setSelectedJobRole('');
  setJobDescription('');
  setDifficultyLevel('Intermediate');
  setTestDuration(45);
  setAptitudeQuestions(0);
  setJobRoleQuestions(0);
  setCodingQuestions(0);
  setCandidatesForRole([]);
  setSelectedCandidates({});
  setSelectAll(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-indigo-700">Create Assessment</h2>
            <p className="text-sm text-gray-500 mt-1">Configure the assessment and choose candidates to invite.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none focus:outline-none"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

  <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Job Role *</label>
            <select
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
              required
            >
              <option value="">Select a job role</option>
              {jobRoles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.jobRole}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none h-28 resize-none bg-gray-50"
              placeholder="Job description will be auto-filled based on selected role"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Difficulty Level *</label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white"
              required
            >
              {difficultyOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Questions split into three parts */}
      <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Aptitude Questions</label>
        <input type="number" min={0} value={aptitudeQuestions} onChange={e => setAptitudeQuestions(Number(e.target.value))} className="w-full p-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role Questions</label>
        <input type="number" min={0} value={jobRoleQuestions} onChange={e => setJobRoleQuestions(Number(e.target.value))} className="w-full p-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coding Questions</label>
        <input type="number" min={0} value={codingQuestions} onChange={e => setCodingQuestions(Number(e.target.value))} className="w-full p-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white" />
            </div>
          </div>

          {/* Test Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Duration (minutes) *
              </label>
              <select
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} min
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="text-sm text-indigo-700">Total Questions</div>
              <div className="text-2xl font-extrabold text-indigo-700">{aptitudeQuestions + jobRoleQuestions + codingQuestions}</div>
              <div className="mt-2 text-sm text-indigo-600">Tests to generate: <span className="font-semibold text-indigo-700">{Object.values(selectedCandidates).filter(Boolean).length}</span></div>
            </div>
          </div>

          {/* Candidates list for selected job role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Candidates</label>
            <div className="border rounded-lg p-3 max-h-44 overflow-y-auto bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">Total: <span className="font-semibold text-gray-800">{candidatesForRole.length}</span></div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="w-4 h-4 text-indigo-600 border-gray-200 rounded" />
                    <span className="select-none">Select all</span>
                  </label>
                  <div className="text-sm text-gray-700">Selected: <span className="font-semibold">{Object.values(selectedCandidates).filter(Boolean).length}</span></div>
                </div>
              </div>
              {candidatesForRole.length === 0 ? (
                <div className="text-sm text-gray-500">No candidates for this role</div>
              ) : (
                candidatesForRole.map((c: any) => {
                  const id = c._id || c.candidateId || c.filename;
                  const selected = !!selectedCandidates[id];
                  return (
                    <label key={id} className={`flex items-center justify-between gap-4 py-2 px-3 rounded-lg mb-1 transition-colors ${selected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selected} onChange={() => toggleCandidate(id)} className="w-4 h-4 text-indigo-600 border-gray-200 rounded" />
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{c.candidateName || c.filename || 'Unnamed'}</div>
                          <div className="text-xs text-gray-500">{c.email || c.contactNumber || ''}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Score: <span className="font-medium text-gray-800">{(c.matchScore ?? c.cosine_similarity_score ?? 0).toFixed ? (Number(c.matchScore ?? c.cosine_similarity_score ?? 0).toFixed(2)) : (c.matchScore ?? c.cosine_similarity_score ?? 0)}</span></div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentModal;
