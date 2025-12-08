/**
 * Utility functions to parse timeline data from text files
 */

/**
 * Converts time string in format "HH:MM" or "MM:SS" to seconds
 * @param {string} timeString - Time string in format "HH:MM" or "MM:SS"
 * @returns {number} - Time in seconds
 */
export const timeStringToSeconds = (timeString) => {
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
};

/**
 * Cleans markdown formatting from text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
const cleanMarkdown = (text) => {
  if (!text) return '';
  return text.replace(/\*\*/g, '').trim();
};

/**
 * Creates a proxy URL for S3 resources to avoid CORS issues during development
 * @param {string} url - Original S3 URL
 * @returns {string} - Proxy URL for development or original URL for production
 */
const createProxyUrl = (url) => {
  // Only use proxy in development environment
  if (import.meta.env.DEV) {
    // Replace the S3 domain with our proxy endpoint
    return url.replace(
      'https://edu-connect-s3.s3.ap-southeast-1.amazonaws.com',
      '/api/s3-proxy'
    );
  }
  return url;
};

/**
 * Parses timeline text data into structured timestamp objects
 * @param {string} timelineText - Raw timeline text data
 * @returns {Array} - Array of timestamp objects with time, seconds, label, and description
 */
export const parseTimelineText = (timelineText) => {
  if (!timelineText) return [];
  
  // Split text into lines
  const lines = timelineText.split('\n').filter(line => line.trim() !== '');
  
  const timestamps = [];
  let currentStartTime = '';
  let currentLabel = '';
  let currentDesc = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line contains a time range pattern like "[00:02] - [00:39]"
    const timeRangeMatch = line.match(/\[(\d{2}:\d{2})\]\s*-\s*\[(\d{2}:\d{2})\]/);
    
    if (timeRangeMatch) {
      // If we already have a previous item, save it
      if (currentLabel) {
        timestamps.push({
          time: currentStartTime,
          seconds: timeStringToSeconds(currentStartTime),
          label: cleanMarkdown(currentLabel),
          desc: cleanMarkdown(currentDesc)
        });
      }
      
      // Extract start time and initialize new item
      const startTime = timeRangeMatch[1];
      currentStartTime = startTime;
      currentLabel = '';
      currentDesc = '';
      
      // Extract label from the same line (everything after the time range)
      const labelMatch = line.match(/\]\s*:\s*(.+)$/);
      if (labelMatch) {
        currentLabel = labelMatch[1].trim();
      }
    } else if (line.startsWith('>')) {
      // This is a description line
      const desc = line.substring(1).trim(); // Remove '>' and trim
      if (desc) {
        currentDesc = desc;
      }
    } else if (line.startsWith('##') || line.startsWith('#')) {
      // Skip header lines
      continue;
    } else if (line && !currentLabel) {
      // If we haven't found a label yet, treat this line as the label
      currentLabel = line;
    }
  }
  
  // Don't forget the last item
  if (currentLabel && currentStartTime) {
    timestamps.push({
      time: currentStartTime,
      seconds: timeStringToSeconds(currentStartTime),
      label: cleanMarkdown(currentLabel),
      desc: cleanMarkdown(currentDesc)
    });
  }
  
  return timestamps;
};

/**
 * Fetches and parses timeline data from a URL
 * @param {string} timelineUrl - URL to the timeline text file
 * @returns {Promise<Array>} - Promise resolving to array of timestamp objects
 */
export const fetchAndParseTimeline = async (timelineUrl) => {
  try {
    // Use proxy URL in development to avoid CORS issues
    const proxiedUrl = createProxyUrl(timelineUrl);
    
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline data: ${response.status}`);
    }
    
    const timelineText = await response.text();
    return parseTimelineText(timelineText);
  } catch (error) {
    console.error('Error fetching or parsing timeline:', error);
    return []; // Return empty array on error
  }
};