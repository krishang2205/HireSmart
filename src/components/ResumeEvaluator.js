import React from 'react';

const ResumeEvaluator = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center py-10">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B2948]">Resume Evaluator</h1>
        <p className="text-gray-600">Upload your resume and job description to check the match!</p>
      </div>

      {/* Card Section */}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        {/* Job Description Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h2>
          <textarea
            placeholder="Enter the job description here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          ></textarea>
        </div>

        {/* Upload Resume Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload Resume</h2>
          <div className="flex items-center space-x-4">
            <input type="file" className="border border-gray-300 rounded-lg p-2 w-full" />
          </div>
        </div>

        {/* Evaluate Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200">
          Evaluate Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeEvaluator;