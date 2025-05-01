import os
import joblib
import pandas as pd
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from app.utils import clean_text, extract_text_from_pdf, extract_text_from_docx
import spacy

# Load the pre-trained NLP model for skill extraction
nlp = spacy.load("en_core_web_sm")  # Use spaCy's small English model

# Load the pre-trained model
model = joblib.load('app/models/resume_match_classifier.pkl')  # Ensure the path is correct

# Initialize Flask app
app = Flask(__name__)

# Update CORS configuration to allow requests from the frontend
CORS(app)

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Enhanced skill extraction with fallback mechanism
# Function to extract skills dynamically from the job description
def extract_skills_from_jd(jd_text):
    doc = nlp(jd_text)
    skills = []

    # Extract entities labeled as potential skills
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'SKILL', 'PRODUCT', 'LANGUAGE']:  # Labels likely to represent skills
            skills.append(ent.text.lower())

    # Debugging log to display all detected entities
    print("All detected entities:", [(ent.text, ent.label_) for ent in doc.ents])

    # Fallback: Extract potential skills based on keywords or patterns
    keywords = [
        "data", "analysis", "machine learning", "visualization", "pipeline", "algorithm", "python", "sql", "statistics", "deep learning", "ai",
        "mobile development", "android", "ios", "flutter", "react native",
        "mern stack", "mongodb", "express", "react", "node.js",
        "data science", "pandas", "numpy", "scikit-learn", "tensorflow", "keras"
    ]
    jd_words = jd_text.lower().split()
    for keyword in keywords:
        if keyword in jd_words:
            skills.append(keyword)

    # Additional fallback: Extract nouns and noun phrases as potential skills
    for token in doc:
        if token.pos_ == "NOUN":
            skills.append(token.text.lower())

    # Remove duplicates and return
    return list(set(skills))

# Enhanced logic for categorizing resumes based on cosine similarity score and matched skills
@app.route('/evaluate', methods=['POST'])
def evaluate():
    if 'resumes' not in request.files or not request.form.get('job_description'):
        return jsonify({"error": "Job description or resumes are missing!"}), 400

    # Debugging logs to verify received form data
    print("Received job description:", request.form.get('job_description'))
    print("Received resumes:", request.files.getlist('resumes'))

    # Get job description from the form
    jd_input = request.form['job_description']

    # Extract skills from the job description dynamically
    jd_clean = clean_text(jd_input)
    jd_skills = extract_skills_from_jd(jd_clean)
    print("Extracted skills from job description:", jd_skills)  # Debugging log

    # Process each uploaded resume
    results = []
    for uploaded_file in request.files.getlist('resumes'):
        # Extract text from uploaded resume
        file_ext = os.path.splitext(uploaded_file.filename)[1]
        print(f"Processing file: {uploaded_file.filename} with extension: {file_ext}")  # Debugging log

        if file_ext == '.pdf':
            resume_text = extract_text_from_pdf(uploaded_file)
        elif file_ext == '.docx':
            resume_text = extract_text_from_docx(uploaded_file)
        else:
            print(f"Unsupported file type: {file_ext}")  # Debugging log
            return jsonify({"error": f"Unsupported file type: {file_ext}"}), 400

        if not resume_text:
            print(f"Could not extract text from the file: {uploaded_file.filename}")  # Debugging log
            return jsonify({"error": f"Could not extract text from the file: {uploaded_file.filename}"}), 400

        print("Extracted text from resume:", resume_text)  # Debugging log

        # Preprocess text
        resume_clean = clean_text(resume_text)

        # Match skills from the resume against the dynamically extracted skills from the JD
        matched_skills = [skill for skill in jd_skills if skill in resume_clean]
        print("Matched skills:", matched_skills)  # Debugging log

        # Calculate Cosine Similarity
        def get_cosine_score(text1, text2):
            docs = [text1, text2]
            vectorizer = CountVectorizer().fit_transform(docs)
            cosine_sim = cosine_similarity(vectorizer[0], vectorizer[1])
            return cosine_sim[0][0]

        # Get similarity score
        score = get_cosine_score(resume_clean, jd_clean)
        print("Cosine similarity score:", score)  # Debugging log

        # Categorize based on score and matched skills
        if score > 0.8:
            category = "Best for Hire"
            highlight = "green"
        elif 0.3 <= score <= 0.7:
            category = "Can Consider for Interview"
            highlight = "yellow"
        elif score < 0.3:
            if score < 0.5 and len(matched_skills) > 3:  # Adjust threshold and skill count as needed
                category = "Can Consider for Interview"
                highlight = "yellow"
            else:
                category = "Not Good"
                highlight = "red"
        else:
            category = "Not Good"
            highlight = "red"

        # Prepare the result for this resume
        results.append({
            "filename": uploaded_file.filename,
            "prediction": category,
            "cosine_similarity_score": round(score, 2),
            "matched_skills": matched_skills if matched_skills else "No skills matched.",
            "highlight": highlight
        })

    # Sort results by Cosine Similarity Score in descending order
    results = sorted(results, key=lambda x: x['cosine_similarity_score'], reverse=True)

    return jsonify(results)


# Run the app locally on the default port 5000
if __name__ == '__main__':
    app.run(debug=True)