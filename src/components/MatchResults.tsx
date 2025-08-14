import React from 'react';
import Accordion from './ui/accordion';

const getBarColor = (highlight) => {
  if (highlight === 'green') return 'bg-green-500';
  if (highlight === 'yellow') return 'bg-yellow-500';
  return 'bg-red-500';
};

const MatchResults = ({ results }) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p className="text-gray-500 mt-4">No results to display.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg max-w-5xl mx-auto">
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
            </tr>
          </thead>
          <tbody>
            {results.map((res, idx) => (
              <tr key={idx} className="border-t transition-all hover:bg-blue-50">
                <td className="px-4 py-2 align-middle break-words">{res.filename}</td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {res.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
                </td>
                <td className="px-4 py-2 align-middle whitespace-nowrap">
                  {(res.cosine_similarity_score * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2 align-middle">
                  <div className="w-20 h-2 bg-gray-200 rounded-full mx-auto">
                    <div
                      className={`h-2 ${getBarColor(res.highlight)} rounded-full transition-all`}
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
                    className={`inline-block font-semibold ${getBarColor(res.highlight)} text-white px-3 py-1 rounded-full text-xs text-center`}
                  >
                    {res.prediction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchResults;
