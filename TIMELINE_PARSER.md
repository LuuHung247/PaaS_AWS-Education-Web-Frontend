# Timeline and Summary Parser Implementation

## Overview
This document describes the implementation of parsers that convert text-based timeline and summary data into interactive frontend elements for the EduConnect platform.

## Components

### 1. Utility Functions (`src/utils/timelineParser.js`)

#### `timeStringToSeconds(timeString)`
Converts time strings in formats "MM:SS" or "HH:MM:SS" to seconds.

#### `parseTimelineText(timelineText)`
Parses raw timeline text into structured timestamp objects with:
- `time`: Original time string (e.g., "00:02")
- `seconds`: Time converted to seconds (e.g., 2)
- `label`: Title of the segment
- `desc`: Description of the segment

#### `fetchAndParseTimeline(timelineUrl)`
Fetches timeline data from a URL and parses it, using a proxy in development to avoid CORS issues.

### 2. Timeline Component (`src/components/lessons/LessonTimestamps.jsx`)

The `LessonTimestamps` component:
- Dynamically loads timeline data from the lesson's `lesson_timeline` URL
- Shows loading states while fetching data
- Handles error states gracefully
- Displays parsed timestamps as interactive elements
- Integrates with the video player to jump to specific times

### 3. Summary Component (`src/components/lessons/LessonArticle.jsx`)

The `LessonArticle` component:
- Fetches lesson summary text from the `lesson_summary` URL
- Uses the same proxy approach to handle CORS in development
- Displays plain text content with proper formatting
- Shows loading and error states

## Data Format

### Timeline Format
The parser expects timeline text in this format:

```
## Timeline & Topics
**[00:02] - [00:39] : Welcome & Course Overview**
> Introduction to the third and final course...

**[00:39] - [01:06] : Week 1: Unsupervised Learning**
> Explore unsupervised learning techniques...
```

### Summary Format
Summaries are plain text files with line breaks for paragraphs.

## Integration Points

1. **Lesson Service**: The `lesson_timeline` and `lesson_summary` fields in lesson data contain URLs to the respective text files
2. **Lesson Page**: Passes lesson data to the `LessonTimestamps` and `LessonArticle` components
3. **Video Player**: The `onTimestampClick` callback connects timestamps to video playback

## Usage

The parsers automatically work when:
1. A lesson has `lesson_timeline` or `lesson_summary` fields with valid URLs
2. The user navigates to the appropriate tab in a lesson
3. The components fetch and parse the data

## CORS Handling

To handle CORS issues during local development:
1. Vite proxy is configured to route `/api/s3-proxy` requests to the S3 bucket
2. URLs are rewritten in development to use the proxy endpoint
3. Production builds use direct S3 URLs

## Error Handling

- Network errors when fetching data
- Malformed timeline text
- Missing data files
- All errors are gracefully handled with user-friendly messages