import React from 'react';

const MatchResults = ({ overallMatch, skillsMatch, experienceMatch, educationMatch }) => {
  const getColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto transition-all transform hover:scale-105">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Match Results</h2>

      {/* Overall Match */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Overall Match</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full ${getColor(overallMatch)} transition-all duration-300`}
            style={{ width: `${overallMatch}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{overallMatch}%</p>
      </div>

      {/* Skills Match */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Skills Match</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full ${getColor(skillsMatch)} transition-all duration-300`}
            style={{ width: `${skillsMatch}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{skillsMatch}%</p>
      </div>

      {/* Experience Match */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Experience Match</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full ${getColor(experienceMatch)} transition-all duration-300`}
            style={{ width: `${experienceMatch}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{experienceMatch}%</p>
      </div>

      {/* Education Match */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Education Match</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full ${getColor(educationMatch)} transition-all duration-300`}
            style={{ width: `${educationMatch}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{educationMatch}%</p>
      </div>

      {/* AI Recommendations */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Recommendations</h3>
        <p className="text-sm text-gray-600">
          Based on the match results, consider improving skills or experience in areas with lower match percentages. 
          Focus on areas like <strong className="text-gray-800">{educationMatch < 50 && "Education"}</strong> or 
          <strong className="text-gray-800">{skillsMatch < 50 && "Skills"}</strong> to improve overall fit.
        </p>
      </div>
    </div>
  );
};

export default MatchResults;
