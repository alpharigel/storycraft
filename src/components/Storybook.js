import React, { useState } from 'react';
import './Storybook.css';

const Storybook = ({ story, onNewStory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Ensure we have valid pages
  const pages = story?.output?.pages || [];
  const totalPages = Math.min(pages.length, 3); // Limit to 3 pages maximum
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // If no pages, show an error
  if (totalPages === 0) {
    return (
      <div className="storybook-container">
        <div className="storybook-error">
          <h3>Oops! Something went wrong.</h3>
          <p>We couldn't generate a story. Please try again.</p>
          <button onClick={onNewStory} className="new-story-btn">Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="storybook-container">
      <div className="storybook">
        <div className="page-counter">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        <div className="page-content">
          {pages[currentPage]?.image && (
            <div className="page-image">
              <img src={pages[currentPage].image} alt={`Story illustration page ${currentPage + 1}`} />
            </div>
          )}
          
          <div className="page-text">
            {pages[currentPage]?.text || "No text available for this page."}
          </div>
        </div>
        
        <div className="page-navigation">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages - 1}
            className="nav-btn"
          >
            Next →
          </button>
        </div>
      </div>
      
      <button onClick={onNewStory} className="new-story-btn">
        Create New Story
      </button>
    </div>
  );
};

export default Storybook; 