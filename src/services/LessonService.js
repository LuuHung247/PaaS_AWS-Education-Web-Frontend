import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Service để tương tác với API endpoint quản lý bài học
 */
class LessonService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Thêm interceptor để đính kèm token xác thực vào mỗi request
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const { tokens } = await fetchAuthSession();
          const token = tokens?.idToken?.toString();

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          return config;
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Lấy danh sách tất cả bài học trong một series
   * @param {string} seriesId - ID của series
   * @returns {Promise} - Promise chứa danh sách bài học
   */
  async getAllLessons(seriesId) {
    try {
      const response = await this.api.get(`/series/${seriesId}/lessons`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  /**
   * Lấy thông tin chi tiết của một bài học
   * @param {string} seriesId - ID của series
   * @param {string} lessonId - ID của bài học
   * @returns {Promise} - Promise chứa thông tin bài học
   */
  async getLessonById(seriesId, lessonId) {
    try {
      const response = await this.api.get(`/series/${seriesId}/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo bài học mới trong series
   * @param {string} seriesId - ID của series
   * @param {FormData} lessonData - Dữ liệu bài học (FormData chứa các file)
   * @returns {Promise} - Promise chứa thông tin bài học đã tạo
   */
  async createLesson(seriesId, lessonData) {
    try {
      const response = await this.api.post(`/series/${seriesId}/lessons`, lessonData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật thông tin bài học
   * @param {string} seriesId - ID của series
   * @param {string} lessonId - ID của bài học
   * @param {FormData} lessonData - Dữ liệu bài học (FormData chứa các file)
   * @returns {Promise} - Promise chứa thông tin bài học đã cập nhật
   */
  async updateLesson(seriesId, lessonId, lessonData) {
    try {
      const response = await this.api.patch(`/series/${seriesId}/lessons/${lessonId}`, lessonData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Xóa một bài học
   * @param {string} seriesId - ID của series
   * @param {string} lessonId - ID của bài học
   * @returns {Promise} - Promise chứa kết quả xóa bài học
   */
  async deleteLesson(seriesId, lessonId) {
    try {
      const response = await this.api.delete(`/series/${seriesId}/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle trạng thái xuất bản của bài học
   * @param {string} seriesId - ID của series
   * @param {string} lessonId - ID của bài học
   * @param {boolean} isPublish - Trạng thái xuất bản mới
   * @returns {Promise} - Promise chứa thông tin bài học đã cập nhật
   */
  async toggleLessonPublish(seriesId, lessonId, isPublish) {
    try {
      const formData = new FormData();
      formData.append('isPublish', isPublish);
      
      const response = await this.api.patch(`/series/${seriesId}/lessons/${lessonId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Xử lý lỗi từ API
   * @param {Error} error - Đối tượng lỗi
   * @returns {Error} - Error với thông tin chi tiết
   */
  handleError(error) {
    let errorMessage = "Đã xảy ra lỗi khi gọi API";

    if (error.response) {
      // Lỗi từ phản hồi của server
      const { status, data } = error.response;
      errorMessage = data.message || `Lỗi ${status}: ${data}`;
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      errorMessage =
        "Không thể kết nối đến server, vui lòng kiểm tra kết nối của bạn.";
    }

    return new Error(errorMessage);
  }
}

const lessonService = new LessonService();
export default lessonService;
