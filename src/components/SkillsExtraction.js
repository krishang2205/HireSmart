import React from 'react';

const SkillsExtraction = ({ resumeSkills, jobSkills }) => {
  const resumeSkillsSet = new Set(resumeSkills);
  const jobSkillsSet = new Set(jobSkills);

  const matchedSkills = resumeSkills.filter((skill) => jobSkillsSet.has(skill));
  const missingSkills = jobSkills.filter((skill) => !resumeSkillsSet.has(skill));
  const optionalSkills = resumeSkills.filter((skill) => !jobSkillsSet.has(skill) && !matchedSkills.includes(skill));

  const matchPercentage = ((matchedSkills.length / jobSkills.length) * 100).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Skills Analysis</h2>

      <div className="mb-4">
        <h3 className="text-md font-bold mb-2">Matched Skills</h3>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-600">No matched skills found.</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-bold mb-2">Missing Skills</h3>
        <div className="flex flex-wrap gap-2">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-600">No missing skills found.</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-bold mb-2">Optional Skills</h3>
        <div className="flex flex-wrap gap-2">
          {optionalSkills.length > 0 ? (
            optionalSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-600">No optional skills found.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-bold mb-2">Gap Analysis</h3>
        <p className="text-sm text-gray-600">
          Focus on acquiring the missing skills to improve your match for the job description.
        </p>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Match Percentage: {matchPercentage}%</p>
          <p className="text-sm text-gray-600">
            {matchPercentage >= 75 ? 'You have a strong match!' : 'You may want to acquire more skills to improve your match.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsExtraction;
