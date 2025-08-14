import React, { useState } from 'react';

const ResumeScreener = () => {
  const [resumeFile, setResumeFile] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(e.target.files); // Allow multiple files to be selected
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value); // Update the job description state
  };

  const handleAnalyzeMatch = async () => {
    if (!resumeFile || !jobDescription) {
      setError('Please provide both resumes and a job description.');
      return;
    }

    console.log('Job Description:', jobDescription); // Debugging log
    console.log('Selected Resumes:', resumeFile); // Debugging log

    const formData = new FormData();
    if (resumeFile) {
      Array.from(resumeFile).forEach((file) => {
        formData.append('resumes', file as File); // Append multiple files to the form data
      });
    }
    formData.append('job_description', jobDescription);

    try {
  // Use relative path so it works both in dev (proxy) and production (same origin)
  const response = await fetch('/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while processing the request.');
        return;
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">AI-powered Resume Screening</h1>
      <div className="bg-white shadow-md rounded-lg p-10 w-11/12 max-w-5xl flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10 relative">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Resume</h2>
          <p className="text-gray-600 mb-4">Upload a candidate's resume in PDF or DOCX format</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <label htmlFor="resume-upload" className="cursor-pointer text-gray-600 hover:text-blue-600 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span>Drag and drop your file here, or <span className="text-blue-600 underline">browse</span></span>
              <input type="file" id="resume-upload" className="hidden" accept=".pdf, .docx" onChange={handleFileChange} multiple />
            </label>
            {resumeFile && <p className="text-sm text-gray-600 mt-2">{Array.from(resumeFile).map(file => file.name).join(', ')}</p>}
            <p className="text-sm text-gray-500 mt-2">Supports PDF, DOCX (max 5MB)</p>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
          <p className="text-gray-600 mb-4">Enter the job description to match against the resume</p>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
          <div className="absolute inset-x-0 bottom-[-3rem] flex justify-center">
            <button
              className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600"
              onClick={handleAnalyzeMatch}
            >
              Analyze Match
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6 w-full flex justify-center">
        {result && Array.isArray(result) && result.length > 0 ? (
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl border border-gray-200">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Screening Results</h2>
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.map((res, index) => {
                  // Determine color for progress/status bar
                  let barColor = 'bg-red-500';
                  if (res.cosine_similarity_score >= 80) barColor = 'bg-green-500';
                  else if (res.cosine_similarity_score >= 60) barColor = 'bg-yellow-500';
                  else if (res.cosine_similarity_score >= 40) barColor = 'bg-orange-400';
                  return (
                    <tr key={index} className="border-t hover:bg-blue-50 transition-all">
                      <td className="px-5 py-3">{res.filename}</td>
                      <td className="px-5 py-3">{res.filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}</td>
                      <td className="px-5 py-3">{res.cosine_similarity_score}%</td>
                      <td className="px-5 py-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className={`h-2 ${barColor} rounded-full transition-all`} style={{ width: `${res.cosine_similarity_score}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No results to display.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeScreener;