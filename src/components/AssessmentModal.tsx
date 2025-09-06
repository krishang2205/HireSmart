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
  const [candidateSearch, setCandidateSearch] = useState<string>('');
  const [sendingAssessment, setSendingAssessment] = useState<boolean>(false);
  const [assessmentSent, setAssessmentSent] = useState<boolean>(false);

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
        
        // Filter candidates by selected job role and search term
        let filtered = allCandidates.filter(c => c.jobRole === selectedRole.jobRole);
        
        // Apply search filter if search term exists
        if (candidateSearch.trim()) {
          const searchTerm = candidateSearch.toLowerCase();
          filtered = filtered.filter(c => 
            c.candidateName.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm)
          );
        }
        
        console.log('AssessmentModal: Filtered candidates for role:', selectedRole.jobRole, 'Count:', filtered.length);
        setFilteredCandidates(filtered);
        setSelectedCandidates([]); // Reset selection when role changes
      }
    } else {
      setFilteredCandidates([]);
      setSelectedCandidates([]);
    }
  }, [selectedJobRole, jobRoles, allCandidates, candidateSearch]);

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
    setSendingAssessment(false);
    setAssessmentSent(false);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const getTotalQuestions = () => aptitudeQuestions + jobRoleQuestions + codingQuestions;

  const handleSendAssessment = async () => {
    // Enhanced validation
    if (receivedLinks.length === 0) {
      push({ 
        title: 'No assessment links available', 
        description: 'Please wait for assessment links to be generated', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (selectedCandidates.length === 0) {
      push({ 
        title: 'No candidates selected', 
        description: 'Please select at least one candidate to send the assessment to', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (!selectedJobRole) {
      push({ 
        title: 'Job role not selected', 
        description: 'Please select a job role before sending assessments', 
        variant: 'destructive' 
      });
      return;
    }

    setSendingAssessment(true);
    try {
      const response = await fetch('/api/assessments/send-to-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateIds: selectedCandidates,
          assessmentLinks: receivedLinks,
          jobRole: selectedJobRole,
          companyName: 'HireSmart' // This could be made dynamic later
        })
      });

      const result = await response.json();

      if (result.success) {
        // Show detailed success message
        if (result.failedCount > 0) {
          push({
            title: 'Assessment partially sent',
            description: `Successfully sent to ${result.sentCount} candidates, ${result.failedCount} failed`,
            variant: 'default'
          });
        } else {
          push({
            title: 'Assessment sent successfully!',
            description: `Assessment links sent to all ${result.sentCount} candidates`,
            variant: 'success'
          });
        }
        
        // Update candidate statuses locally for successful sends only
        const successfulCandidates = result.results
          .filter(r => r.success)
          .map(r => r.candidateId);
          
        setAllCandidates(prev => 
          prev.map(candidate => 
            successfulCandidates.includes(candidate._id)
              ? { ...candidate, status: 'Assessment Sent' }
              : candidate
          )
        );
        setFilteredCandidates(prev => 
          prev.map(candidate => 
            successfulCandidates.includes(candidate._id)
              ? { ...candidate, status: 'Assessment Sent' }
              : candidate
          )
        );
        
        // Clear selected candidates after successful send
        setSelectedCandidates([]);
        setAssessmentSent(true);
        
      } else {
        push({
          title: 'Failed to send assessment',
          description: result.error || 'Please try again',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending assessment:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Please try again';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      push({
        title: 'Failed to send assessment',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSendingAssessment(false);
    }
  };

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
              
              {/* Search Candidates */}
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates by name or email..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Showing {filteredCandidates.length} candidates
                </div>
              </div>
              
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
                        <div className="text-xs text-gray-500 ml-2">
                          Only candidates with "Communication Sent" status can be selected
                        </div>
                        <div className="relative group ml-2">
                          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg max-w-xs">
                            <div className="font-medium mb-1">Communication Status Guide:</div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Communication Sent - Ready for assessment</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                <span>Pending Communication - Send email first</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Assessment Assigned - Already has test</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Assessment Completed - Test finished</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      <div className="divide-y divide-gray-200">
                        {filteredCandidates.map((candidate) => {
                          const isSelectable = candidate.status === 'Communication Sent';
                          return (
                            <label 
                              key={candidate._id} 
                              className={`flex items-center space-x-3 p-3 hover:bg-gray-50 ${
                                isSelectable 
                                  ? 'cursor-pointer' 
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
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    <div className="font-medium text-gray-900 truncate">{candidate.candidateName}</div>
                                    <div className="relative group">
                                      {isSelectable ? (
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                      <div className="absolute left-4 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                                        {candidate.status === 'Communication Sent' && 'Ready for assessment - can be selected'}
                                        {candidate.status === 'Pending Communication' && 'Send communication email first'}
                                        {candidate.status === 'Assessment Assigned' && 'Assessment already assigned'}
                                        {candidate.status === 'Assessment Completed' && 'Assessment completed'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      isSelectable 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {candidate.status}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">{candidate.email}</div>
                          </div>
                        </label>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Show message if no selectable candidates */}
                    {filteredCandidates.filter(c => c.status === 'Communication Sent').length === 0 && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div>
                            <div className="text-amber-800 font-medium">No candidates ready for assessment</div>
                            <div className="text-amber-700 text-sm mt-1">
                              All candidates need communication to be sent first. Go to the Next Steps page to send emails to candidates.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

          {/* Send Assessment Button - Only show when links are received and candidates are selected */}
          {forwardStatus === 'sent' && receivedLinks.length > 0 && selectedCandidates.length > 0 && !assessmentSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Assessment Ready!</h3>
                  <p className="text-green-700 text-sm">
                    {receivedLinks.length} assessment link(s) generated. Ready to send to {selectedCandidates.length} selected candidate(s).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendAssessment}
                  disabled={sendingAssessment}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {sendingAssessment ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Assessment'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Assessment Sent Success State */}
          {assessmentSent && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-emerald-800">Assessment Sent Successfully!</h3>
                  <p className="text-emerald-700 text-sm mt-1">
                    Assessment links have been sent to the selected candidates. They will receive professional emails with instructions to complete the assessment.
                  </p>
                </div>
              </div>
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
