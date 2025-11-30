import { useState, useEffect } from 'react';
import LessonService from '../services/LessonService';
import SeriesService from '../services/SeriesService';
import { getUserById } from '../services/UserService'; // Import thêm hàm này

/**
 * Custom hook to fetch and manage lesson and series data
 * @param {string} seriesId - ID of the series
 * @param {string} lessonId - ID of the lesson
 * @returns {Object} - The lesson, series, and loading/error states
 */
const useLessonData = (seriesId, lessonId) => {
  const [lesson, setLesson] = useState(null);
  const [series, setSeries] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Lấy thông tin bài học và danh sách bài học
        const lessonData = await LessonService.getLessonById(seriesId, lessonId);
        setLesson(lessonData);

        const allLessonsData = await LessonService.getAllLessons(seriesId);
        setAllLessons(allLessonsData);

        // 2. Lấy thông tin Series
        const seriesData = await SeriesService.getSeriesById(seriesId);
        
        // 3. Lấy thông tin giảng viên (Owner) dựa trên serie_user từ seriesData
        let ownerInfo = null;
        if (seriesData.serie_user) {
            try {
                const ownerData = await getUserById(seriesData.serie_user);
                ownerInfo = ownerData.data || ownerData;
            } catch (err) {
                console.warn("Không thể lấy thông tin giảng viên:", err);
                // Fallback nếu lỗi
                ownerInfo = { name: 'EduConnect Instructor' };
            }
        }

        // 4. Gộp thông tin owner vào object series
        setSeries({
            ...seriesData,
            owner: ownerInfo
        });

      } catch (err) {
        console.error("Error fetching lesson or series details:", err);
        setError(err.message || 'Không thể tải dữ liệu bài học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (seriesId && lessonId) {
      fetchData();
    }
  }, [seriesId, lessonId]);

  return {
    lesson,
    series,
    allLessons,
    loading,
    error
  };
};

export default useLessonData;