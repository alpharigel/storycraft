import React, { useState } from 'react';
import './App.css';
import StoryForm from './components/StoryForm';
import Storybook from './components/Storybook';
import { parseStoryResponse } from './utils/storyParser';

function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [storyHistory, setStoryHistory] = useState('');
  const [storyOptions, setStoryOptions] = useState([]);
  const [formData, setFormData] = useState({
    childName: '',
    interests: 'Futbol',
    readingLevel: 'Level 1'
  });

  const generateStory = async (newFormData, selectedOption = null) => {
    setLoading(true);
    setError(null);
    setStreamingData([]);
    setIsStreaming(true);
    
    // Store the form data for future use
    if (!selectedOption) {
      setFormData(newFormData);
    }
    
    // If continuing the story with an option, update the history
    let history = storyHistory;
    if (selectedOption) {
      history = history + ' ' + selectedOption;
    } else {
      // Reset history if starting a new story
      history = ' ';
    }
    
    // Use the stored form data or the new form data
    const currentFormData = selectedOption ? formData : newFormData;
    
    try {
      const response = await fetch('/api/released-app/5f0bbd5b-d933-4fac-912f-aaa4e6772386/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ww-EFkpTZJlBulVgy6lkkX4KY01Q6UtN6g9x0dC3MdGkwVHIpn0jjVbOt'
        },
        body: JSON.stringify({
          inputs: {
            childname: currentFormData.childName,
            interests: currentFormData.interests,
            readinglevel: currentFormData.readingLevel,
            history: history
          },
          version: "^1.0"
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      
      // For streaming, just display the raw text first
      const text = await response.text();
      console.log(text);
      
      // Try to extract and display any images from the response
      const imageUrlRegex = /"image_url":"([^"]+)"/g;
      let match;
      const imageUrls = [];
      
      while ((match = imageUrlRegex.exec(text)) !== null) {
        imageUrls.push(match[1]);
      }
      
      // Extract text content
      const introTextRegex = /"introduction_text":"([^"]+)"/;
      const adventureText1Regex = /"adventure_text_1":"([^"]+)"/;
      const adventureText2Regex = /"adventure_text_2":"([^"]+)"/;
      const adventureText3Regex = /"adventure_text_3":"([^"]+)"/;
      const questionTextRegex = /"question_text":"([^"]+)"/;

      const introMatch = text.match(introTextRegex);
      const adventure1Match = text.match(adventureText1Regex);
      const adventure2Match = text.match(adventureText2Regex);
      const adventure3Match = text.match(adventureText3Regex);
      const questionMatch = text.match(questionTextRegex);

      const textContents = [];

      if (introMatch && introMatch[1]) {
        textContents.push({
          type: 'introduction',
          text: introMatch[1]
        });
      }

      if (adventure1Match && adventure1Match[1]) {
        textContents.push({
          type: 'adventure_1',
          text: adventure1Match[1]
        });
      }

      if (adventure2Match && adventure2Match[1]) {
        textContents.push({
          type: 'adventure_2',
          text: adventure2Match[1]
        });
      }

      if (adventure3Match && adventure3Match[1]) {
        textContents.push({
          type: 'adventure_3',
          text: adventure3Match[1]
        });
      }

      // Extract options from the question text
      let options = [];
      if (questionMatch && questionMatch[1]) {
        const questionText = questionMatch[1];
        
        // Extract numbered options (1. Option text, 2. Option text, etc.)
        const optionsRegex = /\d+\.\s+([^.]+)(?:\.|\?|$)/g;
        let optionMatch;
        while ((optionMatch = optionsRegex.exec(questionText)) !== null) {
          options.push(optionMatch[1].trim());
        }
        
        // Add the question text as the last page
        textContents.push({
          type: 'question',
          text: questionText
        });
      }

      // Update story history with the current story text
      const allText = textContents.map(content => content.text).join(' ');
      setStoryHistory(history ? history + ' ' + allText : allText);
      setStoryOptions(options);
      
      // Create a simple story object from the extracted data
      if (imageUrls.length > 0 && textContents.length > 0) {
        // Create pages from the text contents
        const pages = textContents.map((content, index) => ({
          text: content.text,
          image: index < imageUrls.length ? imageUrls[index] : null,
          type: content.type
        }));
        
        setStory({
          output: { 
            pages,
            options
          }
        });
      } else {
        // Try to parse as JSON as a fallback
        try {
          const data = JSON.parse(text);
          const parsedStory = parseStoryResponse(data);
          setStory(parsedStory);
        } catch (e) {
          console.error('Failed to parse response:', e);
          setError('Failed to parse the story response');
        }
      }
      
      // Display the raw response for debugging
      setStreamingData([{ type: 'raw', value: text }]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const continueStory = (option) => {
    generateStory(formData, option);
  };

  return (
    <div className="App">
      <header className="App-header-minimal">
        <div className="logo-container">
          <i className="fa-solid fa-book-open"></i>
          <span className="logo-text">StoryCraft</span>
        </div>
      </header>
      <main>
        {!story && !isStreaming && <StoryForm onSubmit={generateStory} />}
        {loading && <div className="loading">Generating your storybook... Please wait!</div>}
        {error && <div className="error">Error: {error}</div>}
        
        {isStreaming && streamingData.length > 0 && (
          <div className="streaming-container">
            <h2>Generating your story...</h2>
            <div className="streaming-content">
              {streamingData.map((chunk, index) => {
                // Display text chunks
                if (chunk.type === 'chunk' && chunk.value.type === 'chunk') {
                  return <span key={index}>{chunk.value.value}</span>;
                }
                
                // Display images as they come in
                if (chunk.type === 'chunk' && chunk.value.type === 'tool' && 
                    chunk.value.output && chunk.value.output.type === 'image') {
                  return (
                    <div key={index} className="streaming-image">
                      <img src={chunk.value.output.image_url} alt="Story illustration" />
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
          </div>
        )}
        
        {story && !loading && (
          <Storybook 
            story={story} 
            options={storyOptions}
            onSelectOption={continueStory}
            onNewStory={() => {
              setStory(null);
              setStreamingData([]);
              setStoryHistory('');
              setStoryOptions([]);
              setFormData({
                childName: '',
                interests: 'Futbol',
                readingLevel: 'Level 1'
              });
            }} 
          />
        )}
      </main>
      <footer>
        <p>Powered by Wordware AI</p>
      </footer>
    </div>
  );
}

export default App; 