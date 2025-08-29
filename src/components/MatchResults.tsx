import React, { useState } from 'react';

import Accordion from './ui/accordion';

const getColorByPrediction = (prediction) => {
  if (prediction === 'Best Match') {
    return { bar: 'bg-green-500', badge: 'bg-green-500 text-white' };
  }
  if (prediction === 'Can consider for interview') {
    return { bar: 'bg-yellow-500', badge: 'bg-yellow-500 text-black' };
  }
  if (prediction === 'Consider with Caution') {
    return { bar: 'bg-orange-400', badge: 'bg-orange-400 text-black' };
  }
  return { bar: 'bg-red-500', badge: 'bg-red-500 text-white' };
};

const MatchResults = ({ results }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [showNextStepMessage, setShowNextStepMessage] = useState(() => {
    return sessionStorage.getItem('showNextStepMessage') === 'true';
  });

  // Get unique job roles from results
  const availableJobRoles = Array.from(new Set(results.map(r => r.jobRole).filter(Boolean))).sort();
  
  // Filter results by selected job role
  const filteredResults = selectedJobRole 
    ? results.filter(r => r.jobRole === selectedJobRole)
    : results;

  if (showNextStepMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Thank you for screening!</h2>
        <p className="text-lg text-gray-700 mb-6">You have completed the resume screening process. Proceed to the next steps for further candidate evaluation.</p>
        <div className="flex gap-4">
          <button
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg"
            onClick={() => window.location.href = '/next-steps'}
          >
            Go to Next Steps
          </button>
          <button
            className="inline-block px-6 py-3 bg-gray-200 text-indigo-700 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-300"
            onClick={() => {
              setShowNextStepMessage(false);
              sessionStorage.removeItem('showNextStepMessage');
              window.dispatchEvent(new Event('showResultsAgain'));
            }}
          >
            Show Results Again
          </button>
        </div>
      </div>
    );
  }
  if (!results || !Array.isArray(results) || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">No screening results yet</h2>
        <p className="text-lg text-gray-500 mb-6">Start by uploading resumes and entering a job description, then click Analyze Match.</p>
      </div>
    );
  }

  const handleOverviewClick = (explanation) => {
    setModalContent(explanation);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleExportExcel = async () => {
    const XLSX = await import('xlsx');
    const data = results.map(res => ({
          Name: res.candidateName,
      Type: res.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX',
      Score: `${(res.cosine_similarity_score * 100).toFixed(1)}%`,
      Skills: Array.isArray(res.matched_skills) ? res.matched_skills.join(', ') : '',
      Prediction: res.prediction,
      Explanation: res.explanation || '',
      CandidateId: res.candidateId || '',
      JobId: res.jobId || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'screening_results.xlsx');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg max-w-5xl mx-auto relative">
      <button
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400 bg-white hover:bg-blue-50 transition shadow"
        title="Export to Excel"
        onClick={handleExportExcel}
        aria-label="Export"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8v8M14 8l-4 4M14 8l4 4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="18" width="10" height="2" rx="1" fill="#333" />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Screening Results</h2>
      
      {/* Job Role Filter */}
      {availableJobRoles.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            value={selectedJobRole}
            onChange={(e) => setSelectedJobRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm"
          >
            <option value="">All Roles</option>
            {availableJobRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {selectedJobRole && (
            <span className="text-sm text-gray-600">
              Showing {filteredResults.length} of {results.length} candidates
            </span>
          )}
        </div>
      )}
      
      <div>
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm text-sm table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Score</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Skills</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Prediction</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Overview</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res, idx) => (
              <tr key={idx} className="border-t transition-all hover:bg-blue-50">
                  <td className="px-4 py-2 align-middle break-words">{res.candidateName || res.filename}</td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {res.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
                </td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {res.cosine_similarity_score != null && !isNaN(Number(res.cosine_similarity_score))
                    ? (Number(res.cosine_similarity_score) * 100).toFixed(1) + '%'
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 align-middle">
                  <div className="w-20 h-2 bg-gray-200 rounded-full mx-auto">
                    <div
                      className={`h-2 ${getColorByPrediction(res.prediction).bar} rounded-full transition-all`}
                      style={{ width: `${res.cosine_similarity_score * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-2 align-middle break-words">
                  {Array.isArray(res.matched_skills) && res.matched_skills.length > 0 ? (
                    <Accordion
                      title={
                        <span className="text-indigo-700 underline cursor-pointer text-xs">
                          Show Skills ({res.matched_skills.length})
                        </span>
                      }
                      className="inline-block"
                    >
                      <ul className="list-disc pl-6 text-xs text-gray-700">
                        {res.matched_skills.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </Accordion>
                  ) : (
                    <span className="text-gray-400 italic text-xs">No skills matched</span>
                  )}
                </td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  <span
                    className={`inline-block font-semibold ${getColorByPrediction(res.prediction).badge} px-3 py-1 rounded-full text-xs text-center`}
                  >
                    {res.prediction}
                  </span>
                </td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {res.explanation ? (
                    <button
                      className="text-blue-600 underline text-xs font-medium focus:outline-none"
                      onClick={() => handleOverviewClick(res.explanation)}
                    >
                      View Overview
                    </button>
                  ) : (
                    <span className="text-gray-400 italic text-xs">No overview</span>
                  )}
                </td>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold focus:outline-none"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-indigo-700">AI Overview</h3>
            <div className="text-gray-800 text-sm whitespace-pre-line">{modalContent}</div>
          </div>
        </div>
      )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {/* Next Step Button */}
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button
            className="next-step-btn"
            style={{
              padding: '0.75rem 2rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            onClick={() => {
              setShowNextStepMessage(true);
              sessionStorage.setItem('showNextStepMessage', 'true');
            }}
          >
            Push to Next Step
          </button>
        </div>
    </div>
  );
};

export default MatchResults;
