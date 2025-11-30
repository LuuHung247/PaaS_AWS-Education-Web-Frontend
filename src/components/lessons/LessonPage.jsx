import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsiveSidebar, useLessonData, useLessonNavigation } from '../../hooks';
import CommentSection from '../courses/CommentSection';
import LessonContent from './LessonContent';
import LessonSidebar from './LessonSidebar';
import LessonNavigation from './LessonNavigation';
import LessonHeader from './LessonHeader';
import LessonLoadingState from './LessonLoadingState';
import LessonErrorState from './LessonErrorState';

// Import components
import LessonOverview from './LessonOverview';
import LessonArticle from './LessonArticle';
import LessonTimestamps from './LessonTimestamps';

import { DocumentTextIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import '../../styles/lessonDetail.css';
import '../../styles/lessonSidebar.css';

const LessonDetailPage = () => {
    const { seriesId, lessonId } = useParams();
    const navigate = useNavigate();
    const mainContentRef = useRef(null);
    const videoRef = useRef(null); // Ref để điều khiển video
    const [activeTab, setActiveTab] = useState('overview');

    // Custom hooks
    const [isSidebarOpen, toggleSidebar] = useResponsiveSidebar(false, 1024);
    const { lesson, series, allLessons, loading, error } = useLessonData(seriesId, lessonId);
    const { prevLesson, nextLesson } = useLessonNavigation(allLessons, lessonId);

    const handleCompleteSeries = () => {
        navigate(`/series/${seriesId}`);
    };

    // Hàm xử lý tua video
    const handleJumpToTime = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
            
            // Cuộn mượt lên vị trí video nếu đang ở dưới
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <LessonLoadingState />;
    if (error) return <LessonErrorState error={error} seriesId={seriesId} />;
    if (!lesson || !series) return <LessonErrorState notFound={true} seriesId={seriesId} />;

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: InformationCircleIcon },
        { id: 'content', label: 'Nội dung bài học', icon: DocumentTextIcon },
        { id: 'timestamps', label: 'Mốc thời gian', icon: ClockIcon },
    ];

    return (
        <div className="lesson-detail-page min-h-screen flex flex-col bg-gray-50 font-sans">
            <LessonHeader
                seriesId={seriesId}
                series={series}
                allLessons={allLessons}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex-1 flex relative overflow-hidden">
                <LessonSidebar
                    series={series}
                    allLessons={allLessons}
                    currentLessonId={lessonId}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    seriesId={seriesId}
                    className="fixed top-16 bottom-0 z-30 left-0 w-80 bg-white shadow-xl border-r border-gray-100 transition-transform duration-300 ease-in-out"
                    style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                />

                <main
                    ref={mainContentRef}
                    className={`w-full transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : ''}`}
                >
                    <div className="container mx-auto px-4 py-6 lg:px-8 max-w-6xl">
                        {/* Video Player với ref */}
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-6 ring-1 ring-black/5">
                            <div className="aspect-video w-full">
                                <LessonContent 
                                    lesson={lesson} 
                                    ref={videoRef} 
                                />
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="border-b border-gray-200 bg-white sticky top-0 z-10 px-2 pt-2">
                                <div className="flex overflow-x-auto no-scrollbar gap-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`
                                                    relative flex items-center px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none focus:outline-none rounded-t-lg
                                                    ${isActive
                                                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
                                                        : 'text-gray-500 border-b-2 border-transparent hover:text-gray-900 hover:bg-gray-100'
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-5 h-5 mr-2 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[300px]">
                                {activeTab === 'overview' && (
                                    <LessonOverview lesson={lesson} series={series} />
                                )}
                                {activeTab === 'content' && (
                                    <LessonArticle lesson={lesson} />
                                )}
                                {activeTab === 'timestamps' && (
                                    <LessonTimestamps 
                                        lesson={lesson} 
                                        onTimestampClick={handleJumpToTime} // Truyền hàm xử lý xuống
                                    />
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                            <LessonNavigation
                                prevLesson={prevLesson}
                                nextLesson={nextLesson}
                                seriesId={seriesId}
                                onCompleteSeries={handleCompleteSeries}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LessonDetailPage;