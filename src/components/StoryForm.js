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
      <h2>Create a Personalized Storybook</h2>
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
          <select
            id="readingLevel"
            name="readingLevel"
            value={formData.readingLevel}
            onChange={handleChange}
            required
          >
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Generate Storybook</button>
      </form>
    </div>
  );
};

export default StoryForm; 