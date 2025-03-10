/**
 * Parses the API response into a format usable by the Storybook component
 * This function may need to be adjusted based on the actual API response structure
 */
export const parseStoryResponse = (apiResponse) => {
  // If the API already returns a structured format with pages, use it directly
  if (apiResponse.output && Array.isArray(apiResponse.output.pages)) {
    return apiResponse;
  }
  
  // Otherwise, try to parse the response into pages
  try {
    const output = apiResponse.output || {};
    const storyText = output.story || '';
    const storyImages = output.images || [];
    
    // Split the story into paragraphs
    const paragraphs = storyText.split('\n\n').filter(p => p.trim());
    
    // Create pages from paragraphs and images
    const pages = paragraphs.map((text, index) => ({
      text,
      image: storyImages[index] || null
    }));
    
    return {
      ...apiResponse,
      output: {
        ...output,
        pages
      }
    };
  } catch (error) {
    console.error('Error parsing story response:', error);
    return {
      ...apiResponse,
      output: {
        pages: []
      }
    };
  }
}; 