import React, { useState, useEffect } from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { fetchAndParseTimeline } from '../../utils/timelineParser';

const LessonTimestamps = ({ lesson, onTimestampClick }) => {
    const [timestamps, setTimestamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTimelineData = async () => {
            if (!lesson?.lesson_timeline) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                const parsedTimestamps = await fetchAndParseTimeline(lesson.lesson_timeline);
                
                console.log('✅ Timeline loaded successfully:', parsedTimestamps.length, 'timestamps');
                setTimestamps(parsedTimestamps);
            } catch (err) {
                setError('Failed to load timeline data');
            } finally {
                setLoading(false);
            }
        };

        loadTimelineData();
    }, [lesson]);

    if (loading) {
        return (
            <div className="p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Mốc thời gian quan trọng</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full p-4 bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4 mt-1">
                                    <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Mốc thời gian quan trọng</h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (timestamps.length === 0) {
        return (
            <div className="p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Mốc thời gian quan trọng</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500">Không có mốc thời gian nào cho bài học này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mốc thời gian quan trọng</h3>
            
            <div className="space-y-4">
                {timestamps.map((item, index) => (
                    <button 
                        key={index}
                        onClick={() => onTimestampClick && onTimestampClick(item.seconds)}
                        className="w-full text-left group flex items-start p-4 bg-white border border-gray-100 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow-md outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                        <div className="flex-shrink-0 mr-4 mt-1">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {item.time}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors flex items-center">
                                {item.label}
                                <PlayCircleIcon className="w-5 h-5 ml-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                * Nhấp vào mốc thời gian để chuyển đến nội dung tương ứng trong video.
            </div>
        </div>
    );
};

export default LessonTimestamps;