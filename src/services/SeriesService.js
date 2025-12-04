import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

class SeriesService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    }); // Thêm interceptor để đính kèm token xác thực vào mỗi request
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const { tokens } = await fetchAuthSession();
          const token = tokens?.idToken?.toString();

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
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
   * Tạo series mới
   * @param {Object} seriesData - Dữ liệu series cần tạo
   * @param {File} thumbnailFile - File hình ảnh thumbnail (nếu có)
   * @returns {Promise} - Promise với dữ liệu series sau khi tạo
   */
  async createSeries(seriesData, thumbnailFile) {
    try {
      // Luôn sử dụng FormData để đảm bảo xử lý file đúng cách
      const formData = new FormData();

      // Thêm các trường thông tin series với tên chính xác
      formData.append("serie_title", seriesData.serie_title || "");
      formData.append("serie_description", seriesData.serie_description || "");
      formData.append("serie_category", seriesData.serie_category || "");

      if (seriesData.isPublished !== undefined) {
        formData.append("isPublished", seriesData.isPublished);
      }

      // Thêm file thumbnail nếu có
      if (thumbnailFile) {
        formData.append("serie_thumbnail", thumbnailFile);
      }

      // Gửi request với Content-Type là multipart/form-data
      const response = await this.api.post("/series", formData, {
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
   * Lấy tất cả series
   * @returns {Promise} - Promise với danh sách series
   */
  async getAllSeries() {
    try {
      const response = await this.api.get("/series");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách series của người dùng hiện tại
   * @returns {Promise} - Promise với danh sách series của người dùng hiện tại
   */
  async getUserSeries() {
    try {
      const response = await this.api.get("/series/me");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy thông tin chi tiết của một series theo ID
   * @param {string|number} seriesId - ID của series cần lấy thông tin
   * @returns {Promise} - Promise với thông tin series
   */
  async getSeriesById(seriesId) {
    try {
      const response = await this.api.get(`/series/${seriesId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  /**
   * Cập nhật một phần thông tin series
   * @param {string|number} seriesId - ID của series cần cập nhật
   * @param {Object} updateData - Dữ liệu cần cập nhật
   * @param {File} thumbnailFile - File hình ảnh thumbnail mới (nếu có)
   * @returns {Promise} - Promise với thông tin series sau khi cập nhật
   */
  async updateSeries(seriesId, updateData, thumbnailFile) {
    try {
      // Sử dụng FormData nếu có file thumbnail, nếu không sử dụng JSON
      if (thumbnailFile) {
        const formData = new FormData();

        // Thêm các trường thông tin series
        if (updateData.serie_title !== undefined) {
          formData.append("serie_title", updateData.serie_title);
        }
        if (updateData.serie_description !== undefined) {
          formData.append("serie_description", updateData.serie_description);
        }
        if (updateData.serie_category !== undefined) {
          formData.append("serie_category", updateData.serie_category);
        }
        if (updateData.isPublished !== undefined) {
          formData.append("isPublished", updateData.isPublished);
        }

        // Thêm file thumbnail
        formData.append("serie_thumbnail", thumbnailFile);

        const response = await this.api.patch(`/series/${seriesId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        // Nếu không có file, sử dụng JSON
        const response = await this.api.patch(
          `/series/${seriesId}`,
          updateData
        );
        return response.data;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  /**
   * Upload hình ảnh thumbnail cho series
   * @param {string|number} seriesId - ID của series
   * @param {File} file - File hình ảnh cần upload
   * @returns {Promise} - Promise với URL của hình ảnh sau khi upload
   */
  async uploadThumbnail(seriesId, file) {
    try {
      const formData = new FormData();
      formData.append("serie_thumbnail", file);

      const response = await this.api.patch(`/series/${seriesId}`, formData, {
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
   * Xóa series theo ID
   * @param {string|number} seriesId - ID của series cần xóa
   * @returns {Promise} - Promise với kết quả sau khi xóa
   */
  async deleteSeries(seriesId) {
    try {
      const response = await this.api.delete(`/series/${seriesId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tìm kiếm series theo từ khóa trong tiêu đề
   * @param {string} keyword - Từ khóa tìm kiếm trong tiêu đề series
   * @returns {Promise} - Promise với danh sách series phù hợp với từ khóa
   */
  async searchSeriesByTitle(keyword) {
    try {
      if (!keyword || keyword.trim() === "") {
        throw new Error("Từ khóa tìm kiếm không được để trống");
      }

      const response = await this.api.get("/series/search", {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Đăng ký theo dõi series
   * @param {string|number} seriesId - ID của series cần đăng ký theo dõi
   * @returns {Promise} - Promise với kết quả sau khi đăng ký
   */
  async subscribeSeries(seriesId) {
    try {
      const response = await this.api.post(`/series/${seriesId}/subscribe`);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Hủy đăng ký theo dõi series
   * @param {string|number} seriesId - ID của series cần hủy đăng ký theo dõi
   * @returns {Promise} - Promise với kết quả sau khi hủy đăng ký
   */
  async unsubscribeSeries(seriesId) {
    try {
      const response = await this.api.post(`/series/${seriesId}/unsubscribe`);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.result?.message;
      return Promise.reject(message);
    }
  }

  /**
   * Lấy danh sách tất cả series mà user hiện tại đã đăng ký theo dõi
   * @returns {Promise} - Promise với danh sách series đã đăng ký
   */
  async getAllSeriesSubscribe() {
    try {
      const response = await this.api.get("/series/subscriptions");
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

// Export instance để sử dụng trong toàn bộ ứng dụng
const seriesService = new SeriesService();
export default seriesService;
