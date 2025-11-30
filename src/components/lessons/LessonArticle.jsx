// src/components/lessons/LessonArticle.jsx
import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const LessonArticle = ({ lesson }) => {
    return (
        <div className="p-6 animate-fade-in">
            {lesson.content ? (
                <div 
                    className="prose prose-lg prose-indigo max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600"
                    dangerouslySetInnerHTML={{ __html: lesson.content }} 
                />
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Không có nội dung văn bản</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Bài học này tập trung vào video và không có nội dung bài viết chi tiết kèm theo.
                    </p>
                </div>
            )}
        </div>
    );
};

export default LessonArticle;