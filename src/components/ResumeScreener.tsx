import React, { useState } from 'react';
import { extractNameFromResume } from './utils';
import MatchResults from './MatchResults';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.js`;
import mammoth from 'mammoth';

const ResumeScreener = ({ jobId }) => {
  // Generate random 6-digit jobId if not provided
  const getRandomJobId = () => Math.floor(100000 + Math.random() * 900000).toString();
  const effectiveJobId = jobId || getRandomJobId();

  // Fetch persisted results on mount if jobId is present
  React.useEffect(() => {
    if (effectiveJobId) {
      fetch(`/api/match-results/${effectiveJobId}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setResult(data);
          }
        })
        .catch(() => {});
    }
  }, [effectiveJobId]);
  const [resumeFile, setResumeFile] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(e.target.files); // Allow multiple files to be selected
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value); // Update the job description state
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items
        .filter((item): item is typeof item & { str: string } => 'str' in item)
        .map(item => item.str)
        .join(' ');
    }
    return text;
  };

  const extractTextFromDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const handleAnalyzeMatch = async () => {
    if (!resumeFile || !jobDescription) {
      setError('Please provide both resumes and a job description.');
      return;
    }
    setLoading(true);
    // Extract text from resumes before Gemini analysis
    const resumesForGemini = [];
    for (const file of Array.from(resumeFile)) {
      let text = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        text = await extractTextFromDOCX(file);
      }
      // Do NOT extract candidateName locally; let Gemini handle it
      resumesForGemini.push({ text, filename: file.name });
    }
    try {
      const response = await fetch('/api/gemini-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumes: resumesForGemini, jobDescription })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while processing the request.');
        setResult(null);
        setLoading(false);
        return;
      }
      const geminiResults = await response.json();
  // Use candidateName from Gemini response only
  setResult(geminiResults);
  setError(null);

      // Save results to MongoDB using provided jobId
      if (effectiveJobId) {
        await fetch(`/api/match-results/${effectiveJobId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchResults: geminiResults.map((r, idx) => ({
            candidateId: `candidate-${idx+1}`,
            ...r
          })) })
        });
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      setResult(null);
    }
    setLoading(false);
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
        {loading ? (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-indigo-600 font-semibold">Screening resumes, please wait...</span>
          </div>
        ) : result && Array.isArray(result) && result.length > 0 ? (
          <MatchResults results={result} />
        ) : (
          <p className="text-gray-500 mt-4">No results to display.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeScreener;