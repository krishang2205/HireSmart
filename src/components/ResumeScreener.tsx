import React, { useState } from 'react';
import MatchResults from './MatchResults';

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
    <div className="w-full flex flex-col items-center py-10">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">AI-powered Resume Screening</h1>
      <p className="text-lg text-blue-900/80 mb-8 text-center">Upload resumes and job descriptions to check the match!</p>
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-3xl flex flex-col md:flex-row gap-8 md:gap-0 md:space-x-10">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Upload Resume</h2>
          <p className="text-sm text-gray-600 mb-2">Upload a candidate's resume in PDF or DOCX format</p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
            <label htmlFor="resume-upload" className="cursor-pointer text-gray-600 hover:text-blue-600 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span>Drag and drop your file here, or <span className="text-blue-600 underline">browse</span></span>
              <input type="file" id="resume-upload" className="hidden" accept=".pdf, .docx" onChange={handleFileChange} multiple />
            </label>
            {resumeFile && <p className="text-sm text-gray-600 mt-2">{Array.from(resumeFile).map(file => file.name).join(', ')}</p>}
            <p className="text-xs text-gray-500 mt-2">Supports PDF, DOCX (max 5MB)</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Job Description</h2>
          <p className="text-sm text-gray-600 mb-2">Enter the job description to match against the resume</p>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
        </div>
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
          className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition text-lg"
          onClick={handleAnalyzeMatch}
        >
          Analyze Match
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6 w-full flex justify-center">
        {result && Array.isArray(result) && result.length > 0 ? (
          <MatchResults results={result} />
        ) : (
          <p className="text-gray-500 mt-4">No results to display.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeScreener;