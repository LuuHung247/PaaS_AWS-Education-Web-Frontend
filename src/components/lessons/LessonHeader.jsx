import React from 'react';
import { Link } from 'react-router-dom';

const LessonHeader = ({ seriesId, series }) => {
    // Đã xóa props isSidebarOpen và toggleSidebar vì không còn dùng ở đây

    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
            <div className="container mx-auto flex justify-between items-center px-4 py-4 max-w-full">
                <div className="flex items-center space-x-4 w-full">
                    <Link
                        to={`/series/${seriesId}`}
                        className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors group flex-shrink-0"
                    >
                        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-indigo-50 transition-colors mr-2">
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="font-medium hidden sm:inline">Quay lại</span>
                    </Link>
                    
                    <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>
                    
                    <h1 className="text-lg font-bold text-gray-900 truncate flex-1" title={series?.serie_title || series?.title}>
                        {series?.serie_title || series?.title || 'Đang tải...'}
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default LessonHeader;