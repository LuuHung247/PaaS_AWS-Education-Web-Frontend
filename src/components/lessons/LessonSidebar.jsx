import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import icon đóng

const LessonSidebar = ({
    series,
    allLessons,
    currentLessonId,
    seriesId,
    className,
    style,
    toggleSidebar // Nhận thêm prop này để xử lý đóng
}) => {
    if (!series || !allLessons) return null;

    return (
        <aside
            className={className || `fixed top-16 bottom-0 z-30 left-0 w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
            style={style}
        >
            <div className="h-full flex flex-col">
                
                {/* --- PHẦN MỚI THÊM: Header của Sidebar --- */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg">Danh sách bài học</h3>
                    <button 
                        onClick={toggleSidebar}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                        title="Đóng danh sách"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                {/* ----------------------------------------- */}

                {/* Lesson List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* (Giữ nguyên phần render danh sách bài học cũ) */}
                    {series.sections && series.sections.length > 0 ? (
                        series.sections.map((section, sectionIndex) => (
                            <div key={section._id || `section-${sectionIndex}`} className="mb-6">
                                <div className="flex items-center px-2 py-1 mb-2 border-b border-gray-100">
                                    <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                                        {sectionIndex + 1}
                                    </span>
                                    <span className="font-medium text-gray-800">{section.title}</span>
                                </div>

                                <div className="space-y-1">
                                    {section.lessons && section.lessons.map((item, lessonIndex) => (
                                        <Link
                                            key={item._id}
                                            to={`/series/${seriesId}/lessons/${item._id}`}
                                            className={`flex items-center px-3 py-2 rounded-md transition-colors ${item._id === currentLessonId
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium text-gray-500">
                                                {lessonIndex + 1}
                                            </span>
                                            <span className="truncate text-sm">{item.lesson_title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-1">
                            {allLessons.map((item, index) => (
                                <Link
                                    key={item._id}
                                    to={`/series/${seriesId}/lessons/${item._id}`}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${item._id === currentLessonId
                                        ? 'bg-indigo-50 text-indigo-700 '
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium text-gray-500">
                                        {index + 1}
                                    </span>
                                    <span className="truncate text-sm">{item.lesson_title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default LessonSidebar;