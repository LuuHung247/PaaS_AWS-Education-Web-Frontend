# Timeline Parser Implementation

## Overview
This document describes the implementation of the timeline parser that converts text-based timeline data into interactive frontend elements for the EduConnect platform.

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
Fetches timeline data from a URL and parses it.

### 2. Frontend Component (`src/components/lessons/LessonTimestamps.jsx`)

The `LessonTimestamps` component now:
- Dynamically loads timeline data from the lesson's `lesson_timeline` URL
- Shows loading states while fetching data
- Handles error states gracefully
- Displays parsed timestamps as interactive elements
- Integrates with the video player to jump to specific times

## Data Format

The parser expects timeline text in this format:

```
## Timeline & Topics
**[00:02] - [00:39] : Welcome & Course Overview**
> Introduction to the third and final course...

**[00:39] - [01:06] : Week 1: Unsupervised Learning**
> Explore unsupervised learning techniques...
```

## Integration Points

1. **Lesson Service**: The `lesson_timeline` field in lesson data contains the URL to the timeline text file
2. **Lesson Page**: Passes lesson data to the `LessonTimestamps` component
3. **Video Player**: The `onTimestampClick` callback connects timestamps to video playback

## Usage

The timeline parser automatically works when:
1. A lesson has a `lesson_timeline` field with a valid URL
2. The user navigates to the "Timestamps" tab in a lesson
3. The component fetches and parses the timeline data

## Error Handling

- Network errors when fetching timeline data
- Malformed timeline text
- Missing timeline data
- All errors are gracefully handled with user-friendly messages