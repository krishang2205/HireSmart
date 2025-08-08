# HireSmart

HireSmart is an advanced AI-powered resume screening application designed to streamline the hiring process. It leverages natural language processing (NLP) and machine learning to evaluate resumes against job descriptions, providing actionable insights to recruiters and hiring managers.

## Key Features

- **Resume Upload**: Supports uploading resumes in PDF and DOCX formats.
- **Job Description Input**: Allows recruiters to input job descriptions for matching.
- **Skill Extraction and Matching**: Dynamically extracts skills from job descriptions and matches them with resumes.
- **Cosine Similarity Scoring**: Uses cosine similarity to evaluate the relevance of resumes to job descriptions.
- **Categorization**: Automatically categorizes resumes into:
  - "Best for Hire"
  - "Can Consider for Interview"
  - "Not Good"
- **Dynamic Visualization**: Displays results in a user-friendly table with color-coded highlights (green, yellow, red).

## Technologies Used

### Frontend
- **React.js**: For building a dynamic and responsive user interface.
- **Tailwind CSS**: For styling and layout.

### Backend
- **Flask**: A lightweight Python web framework.
- **Python**: For implementing NLP and machine learning logic.
- **spaCy**: For natural language processing and skill extraction.
- **scikit-learn**: For machine learning and similarity scoring.

### Other Tools
- **Git**: For version control.
- **npm**: For managing frontend dependencies.

## Installation and Setup

### Prerequisites
- **Node.js** and **npm** installed.
- **Python 3.8** or higher installed.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/krishang2205/HireSmart.git
   cd HireSmart
   ```

2. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

4. **Build the Frontend**:
   ```bash
   npm run build
   ```

5. **Run the Backend Server**:
   ```bash
   python main.py
   ```

6. **Access the Application**:
   Open your browser and navigate to `http://127.0.0.1:5000`.

## Deployment

### Backend Deployment
- Deploy the Flask backend on platforms like **Heroku**, **AWS**, or **Azure**.

### Frontend Deployment
- Deploy the React frontend on platforms like **Vercel** or **Netlify**.

### Connecting Frontend and Backend
- Update the API URLs in the frontend to point to the deployed backend.

## Folder Structure

```
HireSmart/
├── app/                # Backend utilities and models
│   ├── utils.py        # Helper functions for text extraction and cleaning
│   ├── models/         # Pre-trained machine learning models
│   └── data/           # Data files for the application
├── build/              # Production-ready frontend build
├── public/             # Static files for the frontend
├── src/                # React frontend source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components for routing
│   └── ui/             # Shared UI elements like buttons and cards
├── main.py             # Flask backend entry point
├── requirements.txt    # Python dependencies
├── package.json        # Frontend dependencies
└── README.md           # Project documentation
```

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please contact:
- **Name**: Krishang Darji
- **Email**: krishangdarji@gmail.com
- **GitHub**: [krishang2205](https://github.com/krishang2205)