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
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>(['MCQ']);
  const [testDuration, setTestDuration] = useState<number>(45);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const assessmentTypeOptions = ['MCQ', 'Coding', 'SQL', 'Aptitude', 'Case Study'];
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

  const handleAssessmentTypeChange = (type: string) => {
    setAssessmentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobRole || assessmentTypes.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const assessmentData = {
        jobRole: jobRoles.find(role => role._id === selectedJobRole)?.jobRole || '',
        jobDescription,
        difficultyLevel,
        assessmentTypes,
        testDuration,
        numberOfQuestions
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
    setAssessmentTypes(['MCQ']);
    setTestDuration(45);
    setNumberOfQuestions(20);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
              placeholder="Job description will be auto-filled based on selected role"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty Level *
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              {difficultyOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assessment Types *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {assessmentTypeOptions.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentTypes.includes(type)}
                    onChange={() => handleAssessmentTypeChange(type)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Test Duration and Questions */}
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions *
              </label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
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
