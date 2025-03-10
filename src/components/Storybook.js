import React, { useState } from 'react';
import './Storybook.css';

const Storybook = ({ story, onNewStory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // This is a placeholder - we'll need to adapt this based on the actual API response structure
  const pages = story.output?.pages || [];
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  if (!pages.length) {
    return (
      <div className="storybook-error">
        <h2>Oops! Something went wrong with the story generation.</h2>
        <p>The API didn't return a proper story format.</p>
        <button onClick={onNewStory}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="storybook-container">
      <div className="storybook">
        <div className="page">
          {pages[currentPage].image && (
            <div className="page-image">
              <img src={pages[currentPage].image} alt={`Page ${currentPage + 1}`} />
            </div>
          )}
          <div className="page-text">
            <p>{pages[currentPage].text}</p>
          </div>
          <div className="page-number">Page {currentPage + 1} of {pages.length}</div>
        </div>
      </div>
      
      <div className="storybook-controls">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 0}
          className="nav-btn"
        >
          Previous Page
        </button>
        <button 
          onClick={nextPage} 
          disabled={currentPage === pages.length - 1}
          className="nav-btn"
        >
          Next Page
        </button>
        <button onClick={onNewStory} className="new-story-btn">
          Create New Story
        </button>
      </div>
    </div>
  );
};

export default Storybook; 