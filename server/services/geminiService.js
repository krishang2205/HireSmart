const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);



async function analyzeResumeWithGemini(resumeText, jobDescription, resumeFilename) {
 // Clean resume text
  resumeText = resumeText
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z0-9.,@\-+/# ]/g, '')
    .trim();
  const prompt = `
You are an AI assistant specialized in resume screening like an ATS system.
Evaluate how well the following resume matches the job description.

Steps:
1. From the Job Description:
  - Identify and normalize all *required* and *preferred* skills.
  - Break down phrasing like "Strong proficiency in Excel and SQL" into ["Excel", "SQL"].
  - Normalize synonyms (e.g., "MS Excel" → "Excel", "Structured Query Language" → "SQL").

2. From the Resume:
  - Extract all mentioned skills, tools, programming languages, frameworks, certifications, and relevant technologies.
  - Normalize them in the same way (e.g., "MS Office Excel" → "Excel").
  - Extract the candidate's full name from the resume. The name should be a real person name, not a file name or heading. If you cannot find a plausible name, return "Not found".
  - Extract the candidate's email address (if present). If not found, return "Not found".
  - Extract the candidate's contact number (if present). If not found, return "Not found".

3. Determine which resume skills match the JD skills (case-insensitive exact match after normalization).

4. Calculate a match score (0-1):
  required_score = (matched_required / total_required) if total_required > 0 else 0
  preferred_score = (matched_preferred / total_preferred) if total_preferred > 0 else 0
  final_score = (required_score * 0.7) + (preferred_score * 0.3)
  Round to 2 decimals.

5. Based on final_score:
  - score >= 0.7 → "Best Match"
  - score >= 0.4 and < 0.7 → "Can consider for interview"
  - score < 0.4 → "Not Good Candidate"
  - score < 0.4 but have more than 10 skills matched → "Consider with Caution"

6. Return ONLY valid JSON in this exact format. DO NOT include any extra text, code blocks, or explanations outside the JSON. DO NOT use markdown or triple backticks. If you cannot produce valid JSON, return an empty JSON object {}:
{
  "filename": "${resumeFilename}",
  "candidateName": "<extracted_candidate_name>",
  "email": "<extracted_email>",
  "contactNumber": "<extracted_contact_number>",
  "prediction": "<prediction_based_on_score>",
  "cosine_similarity_score": <final_score>,
  "matched_skills": [array of normalized matched skills],
  "explanation": "A brief overview of why this candidate received this score and match."
}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

  console.log('Gemini prompt:', prompt);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      let response = result.response.text();
      console.log('Gemini raw response:', response);

      // Clean up extra formatting
      response = response.replace(/```json|```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(response);
      } catch (e) {
        lastError = e;
        continue; // retry
      }
      if (!parsed.explanation) parsed.explanation = '';
      return parsed;
    } catch (err) {
      lastError = err;
      continue; // retry
    }
  }
  // If all attempts fail, fallback
  console.error('Failed to parse Gemini response as JSON after retries:', lastError);
  return {
    filename: resumeFilename,
    candidateName: 'Not found',
    email: '',
    contactNumber: '',
    prediction: 'Parsing Failed',
    cosine_similarity_score: 0,
    matched_skills: [],
    explanation: ''
  };
}

module.exports = { analyzeResumeWithGemini };
