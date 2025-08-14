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
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Comparison Results</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Filename</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Prediction</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cosine Similarity Score</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Matched Skills</th>
                </tr>
              </thead>
              <tbody>
                {result.map((res, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{res.filename}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.prediction}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.cosine_similarity_score}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {Array.isArray(res.matched_skills) && res.matched_skills.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {res.matched_skills.map((skill, skillIndex) => (
                            <li key={skillIndex}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No skills matched.</span>
                      )}
                    </td>
                  </tr>
                ))}
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