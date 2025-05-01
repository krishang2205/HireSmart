import React, { useState } from 'react';

const JobDescription = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const exampleDescriptions = [
    'Frontend Developer',
    'Data Scientist',
    'Marketing Specialist',
  ];

  const handleSubmit = () => {
    if (description.trim()) {
      onSubmit(description);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Job Description</h2>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        rows="6"
        placeholder="Describe the role, responsibilities, and required skills for the job..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Example job descriptions:</p>
        <div className="flex flex-wrap gap-2">
          {exampleDescriptions.map((example, index) => (
            <button
              key={index}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-200"
              onClick={() => setDescription(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-all duration-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default JobDescription;
