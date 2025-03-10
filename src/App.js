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

  const generateStory = async (formData) => {
    setLoading(true);
    setError(null);
    setStreamingData([]);
    setIsStreaming(true);
    
    try {
      const response = await fetch('/api/released-app/03ebb9ea-1fda-493c-86da-597e2801635e/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ww-5916h52zF1qi3SxMASUJ1HScxn1LibbpYmewHyfrJBs56tixAjGvR1'
        },
        body: JSON.stringify({
          inputs: {
            childname: formData.childName,
            interests: formData.interests,
            readinglevel: formData.readingLevel
          },
          version: "^3.0"
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate story');
      }
      
      // For streaming, just display the raw text first
      const text = await response.text();
      
      // Try to extract and display any images from the response
      const imageUrlRegex = /"image_url":"([^"]+)"/g;
      let match;
      const imageUrls = [];
      
      while ((match = imageUrlRegex.exec(text)) !== null) {
        imageUrls.push(match[1]);
      }
      
      // Extract text content
      const textContentRegex = /"(introduction|adventure|resolution)_text":"([^"]+)"/g;
      const textContents = [];
      
      while ((match = textContentRegex.exec(text)) !== null) {
        textContents.push({
          type: match[1],
          text: match[2]
        });
      }
      
      // Create a simple story object from the extracted data
      if (imageUrls.length > 0 && textContents.length > 0) {
        const pages = textContents.map((content, index) => ({
          text: content.text,
          image: index < imageUrls.length ? imageUrls[index] : null
        }));
        
        setStory({
          output: { pages }
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

  // Function to parse streaming response data
  const parseStreamingResponse = (data) => {
    if (data.type === 'outputs') {
      const storyData = data.values;
      
      // Extract text and images
      const pages = [];
      
      if (storyData.story_generation) {
        // Add introduction page
        if (storyData.story_generation.introduction_text) {
          pages.push({
            text: storyData.story_generation.introduction_text,
            image: storyData.Intro_image?.output?.image_url || null
          });
        }
        
        // Add adventure page
        if (storyData.story_generation.adventure_text) {
          pages.push({
            text: storyData.story_generation.adventure_text,
            image: storyData.adventure_image?.output?.image_url || null
          });
        }
        
        // Add resolution page
        if (storyData.story_generation.resolution_text) {
          pages.push({
            text: storyData.story_generation.resolution_text,
            image: storyData.Resolution_image?.output?.image_url || null
          });
        }
      }
      
      return {
        output: {
          pages
        }
      };
    }
    
    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Personalized Storybook Generator</h1>
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
        
        {story && !loading && <Storybook story={story} onNewStory={() => {
          setStory(null);
          setStreamingData([]);
        }} />}
      </main>
      <footer>
        <p>Powered by Wordware AI</p>
      </footer>
    </div>
  );
}

export default App; 