import React, { useState } from 'react';
import './Storybook.css';

const Storybook = ({ story, options = [], onSelectOption, onNewStory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Ensure we have valid pages
  const pages = story?.output?.pages || [];
  const totalPages = pages.length; // Allow for 4 pages now
  const isLastPage = currentPage === totalPages - 1;
  
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
  
  // Get story options from the story output or use the provided options
  const storyOptions = story?.output?.options || options || [];
  
  // Group adventure pages together
  const renderPageContent = () => {
    const currentPageData = pages[currentPage];
    
    if (!currentPageData) return null;
    
    // For question page, show only the question part
    if (currentPageData.type === 'question') {
      const questionText = currentPageData.text;
      // Extract just the question part before the options
      const questionPart = questionText.split(/\d+\./)[0].trim();
      
      return (
        <div className="page-text">
          {questionPart}
        </div>
      );
    }
    
    // For regular pages
    return (
      <div className="page-text">
        {currentPageData.text}
      </div>
    );
  };
  
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
          
          {renderPageContent()}
          
          {/* Add the choice buttons on the last page */}
          {isLastPage && storyOptions.length > 0 && (
            <div className="story-choices">
              <h3>What happens next?</h3>
              <div className="choice-buttons">
                {storyOptions.map((option, index) => (
                  <button 
                    key={index} 
                    className={`choice-btn ${index % 2 === 0 ? 'option-1-btn' : 'option-2-btn'}`}
                    onClick={() => onSelectOption(option)}
                  >
                    <i className="fa-solid fa-arrow-right"></i> {option}
                  </button>
                ))}
              </div>
            </div>
          )}
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
      
      {!isLastPage && (
        <button onClick={onNewStory} className="new-story-btn">
          Create New Story
        </button>
      )}
    </div>
  );
};

export default Storybook; 