import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extract_text_from_pdf, extract_text_from_docx, extractNameFromResume } from './utils';

const ResumeUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileProcessing = async (file) => {
    try {
      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extract_text_from_pdf(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extract_text_from_docx(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }
      return extractedText;
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage(error.message || 'Error extracting text from the file.');
      return '';
    }
  };

  const onDrop = async (acceptedFiles) => {
    setIsLoading(true);
    setErrorMessage(''); // Reset error message
    const file = acceptedFiles[0];

    // File size validation (example: 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File is too large. Please upload a file smaller than 10MB.');
      setIsLoading(false);
      return;
    }

    const extractedText = await handleFileProcessing(file);
    const candidateName = extractNameFromResume(extractedText);
    setUploadedFile({ file, extractedText, candidateName });
    setIsLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // Limit file size to 10MB
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Resume</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">Upload a PDF or DOCX file by dragging it here or clicking to browse. Max size: 10MB.</p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <p className="text-blue-500 animate-pulse">Processing your file...</p>
        ) : uploadedFile ? (
          <div>
            <p className="text-green-600 font-semibold">Candidate Name: {uploadedFile.candidateName || 'Not found'}</p>
            <p className="text-gray-700 mt-2">Uploaded File: {uploadedFile.file.name}</p>
            <p className="text-gray-700 mt-4">Extracted Text:</p>
            <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-auto max-h-40 border border-gray-300">{uploadedFile.extractedText}</pre>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 16l4-4m0 0l4 4m-4-4v12m4-12l4 4m0 0l4-4m-4 4V4"
              />
            </svg>
            <p className="text-gray-500">Drag & drop your file here, or <span className="text-blue-500 underline cursor-pointer">browse</span></p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
