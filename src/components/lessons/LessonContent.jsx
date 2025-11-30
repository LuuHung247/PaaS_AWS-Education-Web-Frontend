import { forwardRef } from 'react';

/**
 * Component to render lesson content (video or document)
 * Sử dụng forwardRef để cho phép component cha điều khiển video player
 */
const LessonContent = forwardRef(({ lesson }, ref) => {
    if (!lesson) return null;

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md h-full">
            <div className="relative h-full">
                {lesson.lesson_video ? (
                    <div className="aspect-w-16 aspect-h-9 bg-black h-full">
                        <video
                            ref={ref} // Gán ref từ component cha vào thẻ video
                            src={lesson.lesson_video}
                            className="w-full h-full object-contain"
                            controls
                            poster={lesson.thumbnail}
                            preload="metadata"
                        />
                    </div>
                ) : lesson.lesson_documents && lesson.lesson_documents.length > 0 ? (
                    <div className="aspect-w-16 aspect-h-9 h-full">
                        <iframe
                            src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(lesson.lesson_documents[0])}`}
                            className="w-full h-full"
                            title={lesson.lesson_title}
                            frameBorder="0"
                        />
                    </div>
                ) : (
                    <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-100 text-gray-600 h-full">
                        <div className="text-center p-6">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <p className="mt-4 text-lg font-medium">Không có nội dung video hoặc tài liệu</p>
                            <p className="mt-2 text-sm text-gray-500">Giảng viên chưa tải lên nội dung cho bài học này</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

// Thêm displayName để thuận tiện cho việc debug
LessonContent.displayName = 'LessonContent';

export default LessonContent;