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

  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p className="text-gray-500 mt-4">No results to display.</p>;
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
            {results.map((res, idx) => (
              <tr key={idx} className="border-t transition-all hover:bg-blue-50">
                  <td className="px-4 py-2 align-middle break-words">{res.candidateName || res.filename}</td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {res.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
                </td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {(res.cosine_similarity_score * 100).toFixed(1)}%
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
    </div>
  );
};

export default MatchResults;
