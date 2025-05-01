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