import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import '../../styles/explore.css';

// Categories used for filtering - could be fetched from an API in a real app
const CATEGORIES = [
    { id: 'programming', name: 'Lập trình', icon: '💻' },
    { id: 'design', name: 'Thiết kế', icon: '🎨' },
    { id: 'business', name: 'Kinh doanh', icon: '💼' },
    { id: 'personal-dev', name: 'Phát triển cá nhân', icon: '📈' },
    { id: 'languages', name: 'Ngôn ngữ', icon: '🗣️' },
    { id: 'soft-skills', name: 'Kỹ năng mềm', icon: '🤝' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'science', name: 'Khoa học', icon: '🔬' },
    { id: 'math', name: 'Toán học', icon: '🔢' },
    { id: 'music', name: 'Âm nhạc', icon: '🎵' },
    { id: 'art', name: 'Nghệ thuật', icon: '🎭' }
];

// Sort options
const SORT_OPTIONS = [
    { value: 'relevance', label: 'Phù hợp nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
];

const SearchFilters = ({
    onApplyFilters,
    selectedCategories = [],
    totalResults,
    sortOption,
    onSortChange
}) => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [localCategories, setLocalCategories] = useState(selectedCategories);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setLocalCategories(selectedCategories);
    }, [selectedCategories]);

    const toggleCategory = (categoryName) => {
        const newCategories = localCategories.includes(categoryName)
            ? localCategories.filter(cat => cat !== categoryName)
            : [...localCategories, categoryName];

        setLocalCategories(newCategories);
    };

    const handleApply = () => {
        onApplyFilters(localCategories);
        if (isMobile) {
            setMobileFiltersOpen(false);
        }
    };

    const clearFilters = () => {
        setLocalCategories([]);
        onApplyFilters([]);
    };

    const renderMobileFilters = () => (
        <div className="lg:hidden">
            <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-300 btn-hover-effect"
            >
                <FunnelIcon className="w-4 h-4" />
                Lọc & Sắp xếp {localCategories.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-indigo-800 bg-white rounded-full">
                        {localCategories.length}
                    </span>
                )}
            </button>

            {/* Mobile filters modal */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setMobileFiltersOpen(false)}
                    />

                    {/* Slide-in panel */}
                    <div className="relative max-w-xs w-full h-full bg-white shadow-xl flex flex-col overflow-y-auto p-6 ml-auto animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 gradient-text">Bộ lọc</h2>
                            <button
                                type="button"
                                className="-mr-2 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                                onClick={() => setMobileFiltersOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Filters content */}
                        <div className="space-y-6 flex-1">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-indigo-700 mb-3">Sắp xếp theo</h3>
                                <div className="space-y-2">
                                    {SORT_OPTIONS.map((option) => (
                                        <div key={option.value} className="flex items-center">
                                            <input
                                                id={`sort-${option.value}-mobile`}
                                                name="sort-option-mobile"
                                                type="radio"
                                                checked={sortOption === option.value}
                                                onChange={() => onSortChange(option.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor={`sort-${option.value}-mobile`} className="ml-3 text-sm text-gray-700 font-medium">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-purple-700 mb-3">Danh mục</h3>
                                <div className="space-y-3">
                                    {CATEGORIES.map((category) => (
                                        <div key={category.id} className="flex items-center">
                                            <input
                                                id={`category-${category.id}-mobile`}
                                                type="checkbox"
                                                checked={localCategories.includes(category.name)}
                                                onChange={() => toggleCategory(category.name)}
                                                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                                            />
                                            <label htmlFor={`category-${category.id}-mobile`} className="ml-3 text-sm text-gray-700 font-medium flex items-center">
                                                <span className="mr-2 text-lg">{category.icon}</span>
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="border-t border-gray-200 pt-4 mt-6 flex space-x-3">
                            <button
                                type="button"
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc
                            </button>
                            <button
                                type="button"
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 btn-hover-effect"
                                onClick={handleApply}
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderDesktopFilters = () => (
        <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
                <div className="glass-effect rounded-xl shadow-lg p-5 border border-white">
                    <div className="pb-4 mb-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold gradient-text mb-3">Kết quả</h3>
                        <p className="text-sm text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg inline-block">
                            {totalResults} khóa học được tìm thấy
                        </p>
                    </div>

                    <div className="pb-4 mb-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold gradient-text mb-3">Sắp xếp theo</h3>
                        <div className="space-y-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl">
                            {SORT_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        id={`sort-${option.value}`}
                                        name="sort-option"
                                        type="radio"
                                        checked={sortOption === option.value}
                                        onChange={() => onSortChange(option.value)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <label htmlFor={`sort-${option.value}`} className="ml-3 text-sm text-gray-700 font-medium">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold gradient-text">Danh mục</h3>
                            {localCategories.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                >
                                    Xóa tất cả
                                </button>
                            )}
                        </div>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
                            {CATEGORIES.map((category) => (
                                <div key={category.id} className="flex items-center">
                                    <input
                                        id={`category-${category.id}`}
                                        type="checkbox"
                                        checked={localCategories.includes(category.name)}
                                        onChange={() => toggleCategory(category.name)}
                                        className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                                    />
                                    <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700 font-medium flex items-center transition-transform duration-200 hover:translate-x-1">
                                        <span className="mr-2 text-lg">{category.icon}</span>
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {localCategories.length > 0 && (
                        <button
                            onClick={handleApply}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 transition-all duration-300 btn-hover-effect"
                        >
                            Áp dụng bộ lọc
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {renderMobileFilters()}
            {renderDesktopFilters()}
        </>
    );
};

export default SearchFilters;
