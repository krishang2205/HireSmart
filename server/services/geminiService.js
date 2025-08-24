const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);



async function analyzeResumeWithGemini(resumeText, jobDescription, resumeFilename) {
 // Clean resume text
  resumeText = resumeText
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z0-9.,\-+/# ]/g, '')
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

3. Determine which resume skills match the JD skills (case-insensitive exact match after normalization).

4. Calculate a match score (0-1):
   required_score = (matched_required / total_required) if total_required > 0 else 0
   preferred_score = (matched_preferred / total_preferred) if total_preferred > 0 else 0
   final_score = (required_score * 0.7) + (preferred_score * 0.3)
   Round to 2 decimals.

5. Based on final_score:
   - score >= 0.7 → "Can Consider for Interview"
   - score >= 0.4 and < 0.7 → "Consider with Caution"
   - score < 0.4 → "Not Good Candidate"

6. Return ONLY valid JSON in this exact format:
{
  "filename": "${resumeFilename}",
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
      console.error('Failed to parse Gemini response as JSON:', e);
      return {
        filename: resumeFilename,
        cosine_similarity_score: 0,
        matched_skills: [],
        prediction: 'Parsing Failed'
      };
    }

  if (!parsed.explanation) parsed.explanation = '';
  return parsed; // trust Gemini to return correct JSON now
  } catch (err) {
    console.error('Gemini API error:', err);
    throw err;
  }
}

module.exports = { analyzeResumeWithGemini };
