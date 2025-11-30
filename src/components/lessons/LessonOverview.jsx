// src/components/lessons/LessonOverview.jsx
import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const LessonOverview = ({ lesson, series }) => {
    return (
        <div className="p-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.lesson_title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center mr-6">
                    <span className="font-medium text-gray-900 mr-2">Giảng viên:</span>
                    <span className="text-indigo-600 font-medium">
                        {series.owner?.name || 'EduConnect Instructor'}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">Cập nhật:</span>
                    <span>{new Date(lesson.updatedAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            <div className="prose prose-indigo max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả bài học</h3>
                <p className="leading-relaxed">{lesson.lesson_description || 'Chưa có mô tả cho bài học này.'}</p>
            </div>

            {/* Documents Section */}
            {lesson.lesson_documents && lesson.lesson_documents.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        Tài liệu đính kèm
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lesson.lesson_documents.map((doc, idx) => (
                            <a
                                key={idx}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm transition-all group bg-white"
                            >
                                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <DocumentTextIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                                        Tài liệu học tập {idx + 1}
                                    </p>
                                    <p className="text-xs text-gray-500 group-hover:text-indigo-600 transition-colors">
                                        Nhấn để xem hoặc tải xuống
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonOverview;