import React from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const LessonTimestamps = ({ lesson, onTimestampClick }) => {
    // Dữ liệu mẫu bao gồm số giây (seconds) để tua video
    const timestamps = [
        { time: "00:00", seconds: 0, label: "Giới thiệu tổng quan", desc: "Mở đầu và giới thiệu nội dung chính." },
        { time: "00:10", seconds: 10, label: "Cài đặt môi trường", desc: "Hướng dẫn cài đặt các công cụ cần thiết." },
        { time: "05:40", seconds: 340, label: "Viết code Hello World", desc: "Thực hành viết chương trình đầu tiên." },
        { time: "10:20", seconds: 620, label: "Giải thích chi tiết", desc: "Phân tích cú pháp và logic code." },
        { time: "15:00", seconds: 900, label: "Tổng kết", desc: "Tóm tắt lại kiến thức đã học." }
    ];

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