import React, { useState } from 'react';
import './StoryForm.css';

const StoryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    childName: '',
    interests: 'Futbol',
    readingLevel: 'Level 1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="story-form-container">
      <div className="hero-image-container">
        <img 
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4796b7851d-08fcfd4502f1ae248dbd.png" 
          alt="Child reading a magical book" 
          className="hero-image"
        />
      </div>
      
      <h2>Create a Personalized Storybook</h2>
      <p className="form-subtitle">Enter your child's details below to generate a unique story just for them!</p>
      
      <form onSubmit={handleSubmit} className="story-form">
        <div className="form-group">
          <label htmlFor="childName">Child's Name:</label>
          <input
            type="text"
            id="childName"
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            required
            placeholder="Enter your child's name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="interests">Interests:</label>
          <select
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            required
          >
            <option value="Futbol">Futbol</option>
            <option value="Space">Space</option>
            <option value="Minecraft">Minecraft</option>
            <option value="Dragons">Dragons</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="readingLevel">Reading Level:</label>
          <div className="reading-level-buttons">
            {['Level 1', 'Level 2', 'Level 3'].map(level => (
              <button
                key={level}
                type="button"
                className={`level-btn ${formData.readingLevel === level ? 'active' : ''}`}
                onClick={() => setFormData({...formData, readingLevel: level})}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <button type="submit" className="submit-btn">
          <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Storybook
        </button>
      </form>
    </div>
  );
};

export default StoryForm; 