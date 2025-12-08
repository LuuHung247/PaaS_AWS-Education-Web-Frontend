// src/components/lessons/LessonArticle.jsx
import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

/**
 * Sanitizes and formats markdown-like text into HTML elements
 * @param {string} text - Raw text with markdown-like formatting
 * @returns {Array} - Array of React elements
 */
const sanitizeAndFormatText = (text) => {
  if (!text) return [];

  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  // Regex patterns
  const headingRegex = /^(#{1,3})\s+(.*)$/; // #, ##, ###
  const boldRegex = /\*\*(.*?)\*\*/g; // **bold**
  const italicRegex = /\*(.*?)\*/g; // *italic*
  const listItemRegex = /^[\-*]\s+(.*)$/; // - item or * item
  const orderedListItemRegex = /^\d+\.\s+(.*)$/; // 1. item
  const emptyLineRegex = /^\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    key++;

    // Skip empty lines
    if (emptyLineRegex.test(line)) {
      continue;
    }

    // Check for headings
    const headingMatch = line.match(headingRegex);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      
      // Apply bold and italic formatting to heading content
      const formattedContent = content
        .replace(boldRegex, '<strong>$1</strong>')
        .replace(italicRegex, '<em>$1</em>');
      
      const Tag = `h${Math.min(level + 2, 6)}`; // h3, h4, h5 (avoiding h1/h2 for better hierarchy)
      elements.push(
        React.createElement(Tag, {
          key,
          className: "font-bold text-gray-900 mt-6 mb-3",
          dangerouslySetInnerHTML: { __html: formattedContent }
        })
      );
      continue;
    }

    // Check for list items
    const listItemMatch = line.match(listItemRegex);
    const orderedListItemMatch = line.match(orderedListItemRegex);
    
    if (listItemMatch || orderedListItemMatch) {
      const content = listItemMatch ? listItemMatch[1] : orderedListItemMatch[1];
      
      // Apply bold and italic formatting to list item content
      const formattedContent = content
        .replace(boldRegex, '<strong>$1</strong>')
        .replace(italicRegex, '<em>$1</em>');
      
      elements.push(
        React.createElement('li', {
          key,
          className: "ml-4 mb-2",
          dangerouslySetInnerHTML: { __html: formattedContent }
        })
      );
      continue;
    }

    // Regular paragraph
    // Apply bold and italic formatting
    const formattedLine = line
      .replace(boldRegex, '<strong>$1</strong>')
      .replace(italicRegex, '<em>$1</em>');
    
    elements.push(
      React.createElement('p', {
        key,
        className: "mb-4 text-gray-700 leading-relaxed",
        dangerouslySetInnerHTML: { __html: formattedLine }
      })
    );
  }

  // Group consecutive list items into ul or ol elements
  const groupedElements = [];
  let listItems = [];
  let listType = null;
  let listKey = 0;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    // Check if current element is a list item
    if (element.type === 'li') {
      listItems.push(element);
      // Determine list type based on the first list item
      if (listItems.length === 1) {
        // Look at the original line to determine if it was ordered
        const originalLine = lines.find((line, idx) => {
          const orderedMatch = line.match(orderedListItemRegex);
          const unorderedMatch = line.match(listItemRegex);
          return (orderedMatch || unorderedMatch) && 
                 (orderedMatch ? orderedMatch[1] : unorderedMatch[1]) === element.props.dangerouslySetInnerHTML.__html;
        });
        
        listType = originalLine && orderedListItemRegex.test(originalLine) ? 'ol' : 'ul';
      }
    } else {
      // Flush any pending list items
      if (listItems.length > 0) {
        listKey++;
        groupedElements.push(
          React.createElement(listType, {
            key: `list-${listKey}`,
            className: listType === 'ul' 
              ? "list-disc list-inside mb-4 text-gray-700" 
              : "list-decimal list-inside mb-4 text-gray-700",
          }, listItems)
        );
        listItems = [];
        listType = null;
      }
      
      // Add non-list element
      groupedElements.push(element);
    }
  }

  // Flush any remaining list items
  if (listItems.length > 0) {
    listKey++;
    groupedElements.push(
      React.createElement(listType, {
        key: `list-${listKey}`,
        className: listType === 'ul' 
          ? "list-disc list-inside mb-4 text-gray-700" 
          : "list-decimal list-inside mb-4 text-gray-700",
      }, listItems)
    );
  }

  return groupedElements;
};

const LessonArticle = ({ lesson }) => {
    const [formattedContent, setFormattedContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            // Reset state
            setLoading(true);
            setError(null);
            
            // Check if lesson has summary URL
            if (!lesson?.lesson_summary) {
                setLoading(false);
                return;
            }

            try {
                // Create proxy URL for development to avoid CORS issues
                let summaryUrl = lesson.lesson_summary;
                if (import.meta.env.DEV) {
                    summaryUrl = summaryUrl.replace(
                        'https://edu-connect-s3.s3.ap-southeast-1.amazonaws.com',
                        '/api/s3-proxy'
                    );
                }
                
                const response = await fetch(summaryUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch summary: ${response.status}`);
                }
                
                const text = await response.text();
                const formatted = sanitizeAndFormatText(text);
                setFormattedContent(formatted);
            } catch (err) {
                console.error('Error fetching lesson summary:', err);
                setError('Failed to load lesson summary');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [lesson]);

    if (loading) {
        return (
            <div className="p-6 animate-fade-in">
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 animate-fade-in">
                <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <DocumentTextIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-red-900">Error Loading Summary</h3>
                    <p className="text-red-500 mt-2 max-w-md mx-auto">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (formattedContent.length === 0) {
        return (
            <div className="p-6 animate-fade-in">
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Summary Available</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        This lesson doesn't have a text summary available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 animate-fade-in">
            <div className="prose prose-lg prose-indigo max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600">
                {formattedContent}
            </div>
        </div>
    );
};

export default LessonArticle;