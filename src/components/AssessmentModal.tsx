import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface JobRole {
  _id: string;
  jobRole: string;
  jobDescription: string;
  experienceLevel: string;
}

interface Candidate {
  _id: string;
  candidateName: string;
  email: string;
  contactNumber: string;
  prediction: string;
  matchScore: number;
  jobRole: string;
  status: string;
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
  const { push } = useToast();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('Junior (1-3 years)');
  const [aptitudeQuestions, setAptitudeQuestions] = useState<number>(10);
  const [jobRoleQuestions, setJobRoleQuestions] = useState<number>(10);
  const [codingQuestions, setCodingQuestions] = useState<number>(10);
  const [testDuration, setTestDuration] = useState<number>(45);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [forwardStatus, setForwardStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [receivedLinks, setReceivedLinks] = useState<string[]>([]);
  const [forwardMessage, setForwardMessage] = useState<string>('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const experienceLevelOptions = ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Expert'];
  const durationOptions = [30, 45, 60, 90, 120, 180];

  useEffect(() => {
    if (isOpen) {
      fetchJobRoles();
      fetchAllCandidates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedJobRole) {
      const selectedRole = jobRoles.find(role => role._id === selectedJobRole);
      if (selectedRole) {
        setJobDescription(selectedRole.jobDescription);
        console.log('AssessmentModal: Selected role:', selectedRole);
        console.log('AssessmentModal: All candidates:', allCandidates);
        
        // Filter candidates by selected job role
        const filtered = allCandidates.filter(c => c.jobRole === selectedRole.jobRole);
        console.log('AssessmentModal: Filtered candidates for role:', selectedRole.jobRole, 'Count:', filtered.length);
        setFilteredCandidates(filtered);
        setSelectedCandidates([]); // Reset selection when role changes
      }
    } else {
      setFilteredCandidates([]);
      setSelectedCandidates([]);
    }
  }, [selectedJobRole, jobRoles, allCandidates]);

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

  const fetchAllCandidates = async () => {
    try {
      const response = await fetch('/api/match-results');
      if (response.ok) {
        const data = await response.json();
        setAllCandidates(data);
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    }
  };

  const handleSelectAllCandidates = () => {
    // Only select candidates with "Communication Sent" status
    const selectableCandidates = filteredCandidates.filter(c => c.status === 'Communication Sent');
    const selectableIds = selectableCandidates.map(c => c._id);
    
    if (selectedCandidates.length === selectableIds.length && 
        selectableIds.every(id => selectedCandidates.includes(id))) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(selectableIds);
    }
  };

  const handleCandidateSelection = (candidateId: string) => {
    // Only allow selection if candidate has "Communication Sent" status
    const candidate = filteredCandidates.find(c => c._id === candidateId);
    if (candidate && candidate.status !== 'Communication Sent') {
      return; // Don't allow selection
    }
    
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobRole || selectedCandidates.length === 0) {
      setError('Please select a job role and at least one candidate');
      return;
    }

    const totalQuestions = aptitudeQuestions + jobRoleQuestions + codingQuestions;
    if (totalQuestions === 0) {
      setError('Please set at least one question type');
      return;
    }

    setLoading(true);
    setError('');
    setForwardStatus('idle');
    setForwardMessage('');
    setReceivedLinks([]);

    try {
      // Extract the experience level from the formatted string (e.g., "Junior (1-3 years)" -> "Junior")
      const cleanExperienceLevel = experienceLevel.split(' ')[0];
      
      const assessmentData = {
        jobRole: jobRoles.find(role => role._id === selectedJobRole)?.jobRole || '',
        jobDescription,
        experienceLevel: cleanExperienceLevel,
        aptitudeQuestions,
        jobRoleQuestions,
        codingQuestions,
        totalQuestions,
        testDuration,
        selectedCandidates: selectedCandidates.length,
        candidateIds: selectedCandidates
      };

      // Build payload to forward to external web app
      const externalPayload = {
        jobRole: assessmentData.jobRole,
        jobDescription: assessmentData.jobDescription,
        experienceLevel: cleanExperienceLevel,
        testDuration: assessmentData.testDuration,
        questionsPerSection: {
          aptitude: assessmentData.aptitudeQuestions,
          jobRole: assessmentData.jobRoleQuestions,
          coding: assessmentData.codingQuestions
        },
        numberOfTests: selectedCandidates.length
      };

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        // Optionally forward form data to an external app if URL is configured
        const forwardUrl = (
          (window as any)?.ASSESSMENT_FORWARD_URL ||
          (typeof localStorage !== 'undefined' ? localStorage.getItem('ASSESSMENT_FORWARD_URL') : null) ||
          (import.meta as any)?.env?.VITE_ASSESSMENT_FORWARD_URL
        )?.toString().trim();
        if (forwardUrl) {
          try {
            setForwardStatus('sending');
            setForwardMessage('Generating tests…');
            await fetch(forwardUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(externalPayload)
            }).then(async (r) => {
              // Try to parse links from response
              try {
                const data = await r.json().catch(() => null);
                const links: string[] = Array.isArray(data?.links)
                  ? data.links
                  : Array.isArray(data)
                    ? data
                    : data?.testLinks || data?.urls || [];
                if (Array.isArray(links) && links.length > 0) {
                  setReceivedLinks(links);
                }
              } catch (_) {
                // ignore parse issues
              }
            });
            push({
              title: 'Forwarded to external app',
              description: 'Assessment details sent successfully.',
              variant: 'success'
            });
            setForwardStatus('sent');
            setForwardMessage('Tests generated.');
            if (receivedLinks.length > 0) {
              push({ title: 'Links received', description: `${receivedLinks.length} link(s) returned.`, variant: 'success' });
            }
            // Start polling for external links if none received immediately
            if (receivedLinks.length === 0) {
              startPollingForLinks();
            }
          } catch (forwardErr) {
            // Do not block local success on forward failure
            console.warn('Forwarding assessment data failed:', forwardErr);
            push({
              title: 'Forward failed',
              description: 'Could not send assessment details to external app.',
              variant: 'destructive'
            });
            setForwardStatus('error');
            setForwardMessage('Failed to generate tests.');
          }
        } else {
          console.debug('VITE_ASSESSMENT_FORWARD_URL is not set or empty.');
          push({
            title: 'Forwarding skipped',
            description: 'Set VITE_ASSESSMENT_FORWARD_URL to enable sending to external app.'
          });
        }
        // Keep the modal open and show inline statuses/links
        onAssessmentCreated();
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
    setExperienceLevel('Junior');
    setAptitudeQuestions(10);
    setJobRoleQuestions(10);
    setCodingQuestions(10);
    setTestDuration(45);
    setSelectedCandidates([]);
    setFilteredCandidates([]);
    setError('');
    setForwardStatus('idle');
    setForwardMessage('');
    setReceivedLinks([]);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const getTotalQuestions = () => aptitudeQuestions + jobRoleQuestions + codingQuestions;

  // Poll for external links every 5 seconds after successful submission
  const startPollingForLinks = () => {
    if (pollingInterval) return; // already polling
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/assessments/external/assessment-links');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data?.links) && data.links.length > 0) {
            setReceivedLinks(data.links);
            setForwardMessage('Tests generated.');
            push({ title: 'Links received', description: `${data.links.length} link(s) received.`, variant: 'success' });
            clearInterval(interval);
            setPollingInterval(null);
          }
        }
      } catch (err) {
        console.warn('Failed to poll for external links:', err);
      }
    }, 5000);
    
    setPollingInterval(interval);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Assessment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Role *
            </label>
            <select
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white shadow-sm"
              required
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            >
              <option value="" style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>Select a job role</option>
              {jobRoles.map((role) => (
                <option 
                  key={role._id} 
                  value={role._id} 
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                >
                  {role.jobRole}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none text-gray-900 bg-white"
              placeholder="Job description will be auto-filled based on selected role"
            />
          </div>

          {/* Candidate Selection */}
          {selectedJobRole && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Candidates ({selectedCandidates.length} selected)
              </label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {loading ? (
                  <div className="text-sm text-gray-500">Loading candidates...</div>
                ) : filteredCandidates.length > 0 ? (
                  <>
                    <div className="flex items-center mb-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(() => {
                            const selectableCandidates = filteredCandidates.filter(c => c.status === 'Communication Sent');
                            return selectedCandidates.length === selectableCandidates.length && selectableCandidates.length > 0;
                          })()}
                          onChange={handleSelectAllCandidates}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Select All ({filteredCandidates.filter(c => c.status === 'Communication Sent').length} selectable)
                        </span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                      {filteredCandidates.map((candidate) => {
                        const isSelectable = candidate.status === 'Communication Sent';
                        return (
                          <label 
                            key={candidate._id} 
                            className={`flex items-center space-x-2 p-2 rounded ${
                              isSelectable 
                                ? 'cursor-pointer hover:bg-gray-100' 
                                : 'cursor-not-allowed opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCandidates.includes(candidate._id)}
                              onChange={() => handleCandidateSelection(candidate._id)}
                              disabled={!isSelectable}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                            />
                            <div className="text-sm text-gray-700">
                              <div className="font-medium">{candidate.candidateName}</div>
                              <div className="text-xs text-gray-500">{candidate.email}</div>
                              <div className={`text-xs ${isSelectable ? 'text-green-600' : 'text-red-600'}`}>
                                {candidate.status}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No candidates for this role</div>
                )}
              </div>
            </div>
          )}

          {/* Show message if no candidates found for selected role */}
          {selectedJobRole && filteredCandidates.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-yellow-800">No candidates found for the selected job role. Please check if candidates have been screened for this role.</span>
              </div>
            </div>
          )}

          {/* Assessment Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                Experience Level *
                <span className="relative group">
                  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                    Select the candidate's experience range for targeted assessment difficulty.
                  </span>
                </span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                required
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              >
                {[
                  'Fresher (0-1 years)',
                  'Junior (1-3 years)',
                  'Mid-level (3-5 years)',
                  'Senior (5-8 years)',
                  'Expert (8+ years)'
                ].map((level) => (
                  <option key={level} value={level} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Duration (minutes) *
              </label>
              <select
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                required
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                    {duration} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Number of Questions - Split into 3 parts */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Number of Questions *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Aptitude Questions
                </label>
                <input
                  type="number"
                  value={aptitudeQuestions}
                  onChange={(e) => setAptitudeQuestions(Number(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Job Role Questions
                </label>
                <input
                  type="number"
                  value={jobRoleQuestions}
                  onChange={(e) => setJobRoleQuestions(Number(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Coding Questions
                </label>
                <input
                  type="number"
                  value={codingQuestions}
                  onChange={(e) => setCodingQuestions(Number(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedCandidates.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{selectedCandidates.length}</div>
                  <div className="text-sm text-blue-700 font-medium">Tests to Generate</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-2xl font-bold text-indigo-600">{getTotalQuestions()}</div>
                  <div className="text-sm text-indigo-700 font-medium">Questions per Test</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-2xl font-bold text-purple-600">{selectedCandidates.length * getTotalQuestions()}</div>
                  <div className="text-sm text-purple-700 font-medium">Total Questions</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Forwarding Status and Links */}
          {(forwardStatus === 'sending' || forwardStatus === 'sent' || forwardStatus === 'error') && (
            <div className={`rounded-lg px-4 py-3 border ${forwardStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
              <div className="font-medium mb-1">{forwardMessage || (forwardStatus === 'sending' ? 'Generating tests…' : forwardStatus === 'sent' ? 'Tests generated.' : 'Failed to generate tests.')}</div>
              {receivedLinks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {receivedLinks.map((lnk, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-blue-100 rounded p-2">
                      <a href={lnk} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate mr-2">{lnk}</a>
                      <button type="button" onClick={() => navigator.clipboard.writeText(lnk)} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Copy</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedCandidates.length === 0 || getTotalQuestions() === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              {loading ? 'Creating...' : `Create ${selectedCandidates.length} Assessment(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentModal;
