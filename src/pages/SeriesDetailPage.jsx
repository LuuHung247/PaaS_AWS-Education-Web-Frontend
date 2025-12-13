import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import SeriesService from '../services/SeriesService';
import LessonService from '../services/LessonService';
import { getUserById } from '../services/UserService';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import CreateLessonModal from '../components/lessons/CreateLessonModal';
import DeleteLessonModal from '../components/lessons/DeleteLessonModal';
import EditSeriesModal from '../components/series/EditSeriesModal';
import SuccessModal from '../components/common/SuccessModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ErrorModal from '../components/common/ErrorModal';
import NotificationModal from '../components/series/NotificationModal';

const SeriesDetailPage = () => {
    const { seriesId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [state, setState] = useState({
        series: null, lessons: [], loading: true, error: null,
        isOwner: false, isSubmitting: false, isSubscribed: false
    });

    const [modals, setModals] = useState({
        createLesson: false, deleteLesson: false, editSeries: false, editLesson: false,
        selectedLesson: null, subscribeSuccess: false, unsubscribeConfirm: false, subscribeError: null,
        notification: false
    });

    const [formData, setFormData] = useState({
        lesson: { lesson_title: '', lesson_description: '' },
        series: { serie_title: '', serie_description: '', serie_category: '' },
        errors: {}
    });

    // Fetch data & handlers
    useEffect(() => {
        const fetchData = async () => {
            try {
                setState(prev => ({ ...prev, loading: true }));

                const [seriesData, lessonsData] = await Promise.all([
                    SeriesService.getSeriesById(seriesId),
                    LessonService.getAllLessons(seriesId)
                ]);

                let ownerInfo = null;
                if (seriesData.serie_user) {
                    try {
                        const ownerData = await getUserById(seriesData.serie_user);
                        ownerInfo = ownerData.data || ownerData; // Xử lý cả trường hợp response có wrap data hoặc không
                    } catch (error) {
                        console.warn('Could not fetch owner info:', error);
                        // Nếu không lấy được thông tin owner, sử dụng thông tin mặc định
                        ownerInfo = {
                            _id: seriesData.serie_user,
                            name: 'Người dùng',
                            email: 'Không có thông tin'
                        };
                    }
                }

                // Check if current user is subscribed to this series
                let isSubscribed = false;
                if (user && user.serie_subcribe) {
                    isSubscribed = user.serie_subcribe.includes(seriesId);
                }

                setState(prev => ({
                    ...prev,
                    series: {
                        ...seriesData,
                        owner: ownerInfo // Gán thông tin owner vào series
                    },
                    lessons: lessonsData,
                    loading: false,
                    error: null,
                    isOwner: user?._id === seriesData.serie_user,
                    isSubscribed
                }));

                setFormData(prev => ({
                    ...prev, series: {
                        serie_title: seriesData.serie_title || seriesData.title,
                        serie_description: seriesData.serie_description,
                        serie_category: seriesData.serie_category,
                        isPublish: seriesData.isPublish
                    }
                }));
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setState(prev => ({ ...prev, loading: false, error: 'Không thể tải thông tin khóa học' }));
            }
        };
        if (seriesId) fetchData();
    }, [seriesId, user]);

    const handlers = {
        createLesson: async (data) => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                const newLesson = await LessonService.createLesson(seriesId, data);
                setState(prev => ({ ...prev, lessons: [...prev.lessons, newLesson], isSubmitting: false }));
                setModals(prev => ({ ...prev, createLesson: false }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                setFormData(prev => ({ ...prev, errors: { general: 'Lỗi tạo bài học' } }));
            }
        },

        deleteLesson: async () => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                await LessonService.deleteLesson(state.series._id, modals.selectedLesson._id);
                setState(prev => ({
                    ...prev, lessons: prev.lessons.filter(l => l._id !== modals.selectedLesson._id), isSubmitting: false
                }));
                setModals(prev => ({ ...prev, deleteLesson: false, selectedLesson: null }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
            }
        },

        togglePublish: async () => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                const updatedSeries = await SeriesService.updateSeries(seriesId, {
                    ...formData.series, isPublish: !state.series.isPublish
                });
                setState(prev => ({ ...prev, series: updatedSeries, isSubmitting: false }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false, error: 'Lỗi cập nhật trạng thái' }));
            }
        },

        editSeries: async (data, thumbnail) => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                const updatedSeries = await SeriesService.updateSeries(seriesId, data, thumbnail);
                setState(prev => ({ ...prev, series: updatedSeries, isSubmitting: false }));
                setModals(prev => ({ ...prev, editSeries: false }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                setFormData(prev => ({ ...prev, errors: { general: 'Lỗi cập nhật khóa học' } }));
            }
        },

        editLesson: async (data) => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                const updatedLesson = await LessonService.updateLesson(seriesId, modals.selectedLesson._id, data);
                setState(prev => ({
                    ...prev,
                    lessons: prev.lessons.map(l => l._id === modals.selectedLesson._id ? updatedLesson : l),
                    isSubmitting: false
                }));
                setModals(prev => ({ ...prev, editLesson: false, selectedLesson: null }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                setFormData(prev => ({ ...prev, errors: { general: 'Lỗi cập nhật bài học' } }));
            }
        },

        subscribe: async () => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                // Call API to subscribe
                await SeriesService.subscribeSeries(seriesId);

                // Update local state to reflect subscription
                setState(prev => ({ ...prev, isSubmitting: false, isSubscribed: true }));
                setModals(prev => ({ ...prev, subscribeSuccess: true }));

            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                setModals(prev => ({ ...prev, subscribeError: error.message || 'Lỗi khi đăng ký theo dõi' }));
            }
        },

        unsubscribe: async () => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                await SeriesService.unsubscribeSeries(seriesId);
                setState(prev => ({ ...prev, isSubmitting: false, isSubscribed: false }));
                setModals(prev => ({ ...prev, unsubscribeConfirm: false }));
            } catch (error) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                setModals(prev => ({
                    ...prev,
                    unsubscribeConfirm: false,
                    subscribeError: error || 'Lỗi khi hủy đăng ký theo dõi'
                }));
            }
        },

        sendNotification: async (data) => {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                await SeriesService.sendNotification(seriesId, {
                    title: data.notification_title,
                    message: data.notification_content
                });
                
                setModals(prev => ({ ...prev, notification: false }));
                alert('Thông báo đã được gửi thành công đến danh sách học viên qua Email!');
            } catch (error) {
                console.error('Error sending notification:', error);
                alert(error.message || 'Có lỗi xảy ra khi gửi thông báo.');
            } finally {
                setState(prev => ({ ...prev, isSubmitting: false }));
            }
        }
    };

    const { series, lessons, loading, error, isOwner, isSubmitting, isSubscribed } = state;

    if (loading) return <MainLayout><div className="flex justify-center items-center h-64"><Loading /></div></MainLayout>;
    if (error) return <MainLayout><div className="my-8"><ErrorAlert message={error} /></div></MainLayout>;
    if (!series) return (
        <MainLayout>
            <div className="my-8">
                <EmptyState
                    title="Không tìm thấy khóa học"
                    description="Khóa học này không tồn tại hoặc đã bị xóa."
                    actionText="Quay lại danh sách khóa học"
                    actionUrl="/explore"
                />
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            {/* Hero Section */}
            <div className="relative h-96 mb-8 rounded-3xl overflow-hidden shadow-2xl">
                {series.serie_thumbnail ? (
                    <img src={series.serie_thumbnail} alt={series.serie_title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
                )}

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex justify-between items-end">
                        <div className="max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${series.isPublish ? 'bg-green-500' : 'bg-amber-500'
                                    }`}>
                                    {series.isPublish ? '✅ Đã xuất bản' : '⏳ Bản nháp'}
                                </span>
                                {series.serie_category && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs">#{series.serie_category}</span>
                                )}
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">📚 {lessons.length} bài học</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                                {series.serie_title}
                            </h1>

                            {series.serie_description && (
                                <p className="text-lg opacity-90 mb-4 max-w-2xl">{series.serie_description}</p>
                            )}

                            {series.owner && (
                                <div
                                    className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => navigate(`/instructor/${series.owner._id}/from-series/${seriesId}`)}
                                >
                                    {/* Background Layer with Better Contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 backdrop-blur-sm rounded-2xl opacity-80 group-hover:opacity-95 transition-all duration-300"></div>

                                    {/* Subtle Border Glow */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                                    <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>

                                    {/* Content Container */}
                                    <div className="relative flex items-center gap-4 p-4 rounded-2xl">
                                        {/* Enhanced Avatar with Better Visibility */}
                                        <div className="relative flex-shrink-0">
                                            {/* Main Avatar */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-2xl border-3 border-white/90 group-hover:scale-110 group-hover:border-white transition-all duration-300 relative overflow-hidden">
                                                <span className="relative z-10">{series.owner.name?.charAt(0).toUpperCase() || 'U'}</span>
                                                {/* Inner Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            {/* Verified Badge with High Contrast */}
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full border-3 border-white flex items-center justify-center shadow-xl">
                                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>

                                            {/* Animated Ring */}
                                            <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                                        </div>

                                        {/* Text Content with High Contrast */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title with Icon */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-semibold text-white">Giảng viên</span>
                                                </div>

                                                {/* View Profile Icon */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Instructor Name with Shadow for Readability */}
                                            <h4 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-300 mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                {series.owner.name || series.owner.email}
                                            </h4>

                                            {/* Call to Action */}
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-400/30">
                                                    <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-blue-200">Nhấn để xem hồ sơ</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Arrow with Better Visibility */}
                                        <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-all duration-300">
                                            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm group-hover:bg-white/25 rounded-xl border border-white/20 group-hover:border-white/40 flex items-center justify-center transition-all duration-300 shadow-lg">
                                                <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtle Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl"></div>
                                </div>
                            )}
                        </div>

                        {isOwner ? (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setModals(prev => ({ ...prev, editSeries: true }))}
                                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                >
                                    ✏️ Chỉnh sửa
                                </Button>
                                <Button
                                    onClick={handlers.togglePublish}
                                    className={`${series.isPublish ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    disabled={isSubmitting}
                                >
                                    {series.isPublish ? '❌ Hủy xuất bản' : '✅ Xuất bản'}
                                </Button>
                            </div>
                        ) : user && (
                            <div>
                                {isSubscribed ? (
                                    <Button
                                        onClick={() => setModals(prev => ({ ...prev, unsubscribeConfirm: true }))}
                                        className="relative group bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800 hover:from-slate-700 hover:via-gray-800 hover:to-slate-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex items-center gap-3 border border-slate-400/20 backdrop-blur-sm overflow-hidden"
                                        disabled={isSubmitting}
                                    >
                                        {/* Subtle shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                                        {/* Check icon with subtle animation */}
                                        <div className="relative flex items-center justify-center w-8 h-8 bg-white/10 rounded-full">
                                            <svg className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div className="absolute inset-0 bg-green-400/10 rounded-full animate-pulse opacity-50"></div>
                                        </div>

                                        <div className="relative flex flex-col items-start">
                                            <span className="text-sm font-semibold tracking-wide">Đang theo dõi</span>
                                            <span className="text-xs opacity-70 font-medium">Nhấn để hủy</span>
                                        </div>

                                        {/* Minimal accent dots */}
                                        <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-2 left-6 w-1 h-1 bg-slate-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handlers.subscribe}
                                        className="relative group bg-gradient-to-r from-slate-800 via-gray-900 to-black hover:from-slate-900 hover:via-black hover:to-slate-800 text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 flex items-center gap-4 border border-slate-600/30 backdrop-blur-sm overflow-hidden"
                                        disabled={isSubmitting}
                                    >
                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-gray-600/10 to-slate-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Clean shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                                        {/* Plus icon with clean animation */}
                                        <div className="relative flex items-center justify-center w-10 h-10 bg-white/8 rounded-full group-hover:bg-white/12 transition-all duration-500">
                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                            </svg>

                                            {/* Subtle ring animation */}
                                            <div className="absolute inset-0 border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        <div className="relative flex flex-col items-start">
                                            <span className="text-lg font-bold tracking-wide group-hover:text-slate-200 transition-colors duration-300">Theo dõi</span>
                                            <span className="text-xs opacity-70 group-hover:opacity-90 transition-opacity duration-300 font-medium">Nhận thông báo mới</span>
                                        </div>

                                        {/* Minimal accent elements */}
                                        <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-slate-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="absolute bottom-3 right-7 w-1 h-1 bg-gray-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>

                                        {/* Success indicator */}
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity duration-200 transform scale-0 group-active:scale-100">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section with Modern Cards */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Lessons List */}
                    <div className="flex-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    📚 Danh sách bài học
                                </h2>
                                {isOwner && (
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => setModals(prev => ({ ...prev, createLesson: true }))}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            Thêm bài học
                                        </Button>
                                        <Button
                                            onClick={() => setModals(prev => ({ ...prev, notification: true }))}
                                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            Thông báo
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {lessons.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl">
                                        📚
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Chưa có bài học nào</h3>
                                    <p className="text-gray-600 mb-6">
                                        {isOwner ? 'Hãy tạo bài học đầu tiên để bắt đầu khóa học!' : 'Khóa học đang được cập nhật, vui lòng quay lại sau'}
                                    </p>
                                    {isOwner && (
                                        <Button
                                            onClick={() => setModals(prev => ({ ...prev, createLesson: true }))}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            🚀 Tạo bài học đầu tiên
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {lessons.map((lesson, index) => (
                                        <Link
                                            key={lesson._id}
                                            to={`/series/${seriesId}/lessons/${lesson._id}`}
                                            className="block group"
                                        >
                                            <div className="flex items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-6 group-hover:scale-110 transition-transform duration-300">
                                                    {index + 1}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-1">
                                                        {lesson.lesson_title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                        {lesson.lesson_description}
                                                    </p>

                                                    <div className="flex items-center gap-3">
                                                        {lesson.lesson_video && (
                                                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                🎥 Video
                                                            </span>
                                                        )}
                                                        {lesson.lesson_documents?.length > 0 && (
                                                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                📄 {lesson.lesson_documents.length} tài liệu
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {isOwner && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setModals(prev => ({ ...prev, selectedLesson: lesson, editLesson: true }));
                                                            }}
                                                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                            title="Chỉnh sửa bài học"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setModals(prev => ({ ...prev, selectedLesson: lesson, deleteLesson: true }));
                                                            }}
                                                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                            title="Xóa bài học"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="xl:w-80 space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                            <h3 className="text-lg font-bold mb-6 text-gray-800">📊 Thống kê</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Bài học', value: lessons.length, color: 'blue', icon: '📚' },
                                    { label: 'Học viên', value: series.studentsCount || 0, color: 'green', icon: '👥' },
                                    { label: 'Lượt xem', value: series.viewCount || 0, color: 'purple', icon: '👀' }
                                ].map(({ label, value, color, icon }) => (
                                    <div key={label} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{icon}</span>
                                            <span className="text-gray-700">{label}</span>
                                        </div>
                                        <span className={`font-bold text-lg text-${color}-600`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals */}
            {modals.createLesson && (
                <CreateLessonModal
                    isOpen={modals.createLesson}
                    onClose={() => setModals(prev => ({ ...prev, createLesson: false }))}
                    onSubmit={handlers.createLesson}
                    formData={formData.lesson}
                    setFormData={(data) => setFormData(prev => ({ ...prev, lesson: data }))}
                    formErrors={formData.errors}
                    isSubmitting={isSubmitting}
                />
            )}

            {modals.deleteLesson && modals.selectedLesson && (
                <DeleteLessonModal
                    isOpen={modals.deleteLesson}
                    onClose={() => setModals(prev => ({ ...prev, deleteLesson: false, selectedLesson: null }))}
                    onConfirm={handlers.deleteLesson}
                    lesson={modals.selectedLesson}
                    isDeleting={isSubmitting}
                />
            )}

            {modals.editLesson && modals.selectedLesson && (
                <CreateLessonModal
                    isOpen={modals.editLesson}
                    onClose={() => setModals(prev => ({ ...prev, editLesson: false, selectedLesson: null }))}
                    onSubmit={handlers.editLesson}
                    isEdit={true}
                    initialData={modals.selectedLesson}
                />
            )}

            {modals.editSeries && (
                <EditSeriesModal
                    isOpen={modals.editSeries}
                    onClose={() => setModals(prev => ({ ...prev, editSeries: false }))}
                    onSubmit={(data, thumbnail) => handlers.editSeries(data, thumbnail)}
                    formData={formData.series}
                    setFormData={(data) => setFormData(prev => ({ ...prev, series: data }))}
                    formErrors={formData.errors}
                    isSubmitting={isSubmitting}
                    series={series}
                />
            )}

            {/* Subscribe Success Modal */}
            <SuccessModal
                isOpen={modals.subscribeSuccess}
                onClose={() => setModals(prev => ({ ...prev, subscribeSuccess: false }))}
                title="Đăng ký theo dõi thành công!"
                message="Bạn đã đăng ký theo dõi khóa học này thành công. Bạn sẽ nhận được email thông báo mỗi khi giảng viên gửi cập nhật mới."
                buttonText="Đã hiểu"
            />

            {/* Unsubscribe Confirmation Modal */}
            <ConfirmationModal
                isOpen={modals.unsubscribeConfirm}
                onClose={() => setModals(prev => ({ ...prev, unsubscribeConfirm: false }))}
                onConfirm={handlers.unsubscribe}
                title="Xác nhận hủy đăng ký"
                message="Bạn có chắc chắn muốn hủy đăng ký theo dõi khóa học này? Bạn sẽ không còn nhận được thông báo về các cập nhật mới."
                confirmText="Xác nhận hủy"
                cancelText="Giữ đăng ký"
                isLoading={isSubmitting}
                variant="warning"
            />

            {/* Error Modal */}
            {modals.subscribeError && (
                <ErrorModal
                    isOpen={!!modals.subscribeError}
                    onClose={() => setModals(prev => ({ ...prev, subscribeError: null }))}
                    message={modals.subscribeError}
                />
            )}

            {/* Notification Modal */}
            {modals.notification && (
                <NotificationModal
                    isOpen={modals.notification}
                    onClose={() => setModals(prev => ({ ...prev, notification: false }))}
                    onSubmit={handlers.sendNotification}
                    isSubmitting={isSubmitting}
                />
            )}
        </MainLayout>
    );
};

export default SeriesDetailPage;