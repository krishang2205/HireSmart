<<<<<<< HEAD
# HireSmart

HireSmart is an AI-powered resume screening application designed to help recruiters efficiently evaluate resumes against job descriptions. The application uses natural language processing (NLP) and machine learning to match resumes with job requirements and provide actionable insights.

## Features

- **Resume Upload**: Upload resumes in PDF or DOCX format.
- **Job Description Input**: Enter job descriptions to match against resumes.
- **Skill Matching**: Extracts and matches skills from resumes and job descriptions.
- **Cosine Similarity Scoring**: Calculates similarity scores to evaluate relevance.
- **Categorization**: Categorizes resumes as "Best for Hire," "Can Consider for Interview," or "Not Good."
- **Dynamic Visualization**: Displays results in a user-friendly table with color-coded highlights.

## Technologies Used

### Frontend
- React.js
- Tailwind CSS

### Backend
- Flask
- Python
- spaCy (NLP)
- scikit-learn (Machine Learning)

### Other Tools
- Git for version control
- npm for managing frontend dependencies

## Installation

### Prerequisites
- Node.js and npm installed
- Python 3.8 or higher

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/krishang2205/HireSmart.git
   cd HireSmart
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Build the frontend:
   ```bash
   npm run build
   ```

5. Run the backend server:
   ```bash
   python main.py
   ```

6. Access the application:
   Open your browser and navigate to `http://127.0.0.1:5000`.

## Deployment

### Backend
- Deploy the Flask backend on platforms like Heroku, AWS, or Azure.

### Frontend
- Deploy the React frontend on platforms like Vercel or Netlify.

### Connecting Frontend and Backend
- Update the API URLs in the frontend to point to the deployed backend.

## Folder Structure

```
HireSmart/
├── app/                # Backend utilities and models
├── build/              # Production-ready frontend build
├── public/             # Static files for the frontend
├── src/                # React frontend source code
├── main.py             # Flask backend entry point
├── requirements.txt    # Python dependencies
├── package.json        # Frontend dependencies
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please contact:
- **Name**: Krishang Darji
- **Email**: krishangdarji@gmail.com
- **GitHub**: [krishang2205](https://github.com/krishang2205)
=======
# HireSmart

AI-powered resume screening (Flask + React).

## Quick Start (Windows PowerShell)

### 1. Backend
```
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py  # (after you build frontend once if you want integrated serve)
```
Runs at: http://127.0.0.1:5000

### 2. Frontend (new terminal / keep backend running)
```
npm install
npm start
```
Runs at: http://localhost:3000

The frontend calls POST http://127.0.0.1:5000/evaluate

### 3. Use It
1. Paste job description.
2. Upload one or more .pdf/.docx resumes.
3. Click Analyze Match.
4. View ranked table.

### 4. Production Build (optional)
```
npm run build
```
Outputs static files in ./build

Then you can serve everything with just:
```
python main.py
```
Flask will serve the React build and the API on the same origin (port 5000).

### 5. Troubleshooting
- spaCy model missing: `python -m spacy download en_core_web_sm`
- NLTK stopwords: In Python REPL `import nltk; nltk.download('stopwords')`
- CORS / fetch errors: Ensure backend is running on 5000 before clicking.

### 6. Tech Stack
Backend: Flask, spaCy, scikit-learn
Frontend: React, Tailwind CSS

### 7. License
MIT

---
For detailed feature info see `app/README.md`.
>>>>>>> 017a905b (feat: integrate React build into Flask, add missing deps, relative API path, update docs)
