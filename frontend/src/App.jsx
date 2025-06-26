import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [chapter, setChapter] = useState('');
  const [chapterDetails, setChapterDetails] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:5000';

  const fetchChapterDetails = async () => {
    if (!chapter || chapter < 1 || chapter > 18) {
      setError('Please enter a valid chapter number (1–18).');
      return;
    }

    setIsLoading(true);
    setError('');
    setChapterDetails(null);

    try {
      const response = await axios.post(`${backendURL}/api/chapter`, { chapter });
      setChapterDetails(response.data);
    } catch (err) {
      setError('Failed to fetch chapter details. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 className="title" style={{ color: 'white' }}>
          Bhagavad Gita Chapter Explainer
        </h1>
        <p className="subtitle" style={{ color: 'white' }}>
          Enter the chapter number to explore its details.
        </p>

        <div className="input-container">
          <input
            type="number"
            placeholder="Chapter (1-18)"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="input-field"
            min="1"
            max="18"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              color: 'white',
            }}
          />
          <button
            onClick={fetchChapterDetails}
            className="submit-button"
            disabled={isLoading}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              color: 'white',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          >
            {isLoading ? 'Loading...' : 'Get Chapter Details'}
          </button>
        </div>

        {error && (
          <p className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
            {error}
          </p>
        )}

        <AnimatePresence>
          {chapterDetails && (
            <motion.div
              className="details-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginTop: '2rem',
                textAlign: 'left',
                color: 'white',
                width: '60%',
                maxWidth: '600px',
              }}
            >
              <h2 className="chapter-title">
                Chapter {chapterDetails.chapter_number}: {chapterDetails.name}
              </h2>
              <p className="detail">
                <strong>Slug:</strong> {chapterDetails.slug}
              </p>
              <p className="detail">
                <strong>Transliterated Name:</strong> {chapterDetails.name_transliterated}
              </p>
              <p className="detail">
                <strong>Total Verses Count:</strong> {chapterDetails.verses_count}
              </p>
              <p className="detail">
                <strong>Chapter Summary (English):</strong> {chapterDetails.chapter_summary}
              </p>
              <p className="detail">
                <strong>Chapter Summary (Hindi):</strong> {chapterDetails.chapter_summary_hindi}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
