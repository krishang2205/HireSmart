import re
import string
import nltk
import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
import docx2txt
# Download required resources
nltk.download('stopwords')
nlp = spacy.load("en_core_web_sm")
stopwords = nltk.corpus.stopwords.words("english")

# Clean and preprocess text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"\d+", "", text)  # Remove digits
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    text = " ".join([word for word in text.split() if word not in stopwords])  # Remove stopwords
    return text

# Update the `extract_skills` function to work without a predefined skill list
def extract_skills(text, extracted_skills):
    skills_found = []
    for skill in extracted_skills:
        if skill.lower() in text.lower():
            skills_found.append(skill.lower())
    return list(set(skills_found))  # Return unique skills

# Cosine similarity score between resume and job description
def get_cosine_score(resume, jd, vectorizer):
    vecs = vectorizer.transform([resume, jd])
    score = cosine_similarity(vecs[0:1], vecs[1:2])[0][0]
    return score

# Extract text from uploaded PDF file
def extract_text_from_pdf(file):
    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            try:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            except Exception as page_err:
                print(f"Error extracting text from page: {page_err}")
        return text.strip() if text else ""
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

# Extract text from uploaded DOCX file
def extract_text_from_docx(file):
    try:
        return docx2txt.process(file).strip()
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return ""
