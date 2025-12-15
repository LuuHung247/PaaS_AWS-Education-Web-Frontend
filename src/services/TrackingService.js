import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add authentication token to each request
api.interceptors.request.use(
  async (config) => {
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken;

      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken.toString()}`;
      }
      return config;
    } catch (error) {
      // If no session (not logged in), continue request without token
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Notify tracking service that user entered a lesson page
 * @param {Object} data - Lesson tracking data
 * @param {string} data.user_id - User ID
 * @param {string} data.lesson_id - Lesson ID
 * @param {string} data.serie_id - Serie ID
 * @param {string} data.lesson_title - Lesson title (optional)
 * @returns {Promise} - Promise with the tracking response
 */
export const enterLesson = async ({ user_id, lesson_id, serie_id, lesson_title }) => {
  try {
    const response = await api.post('/tracking/lesson/enter', {
      user_id,
      lesson_id,
      serie_id,
      lesson_title,
    });
    return response.data;
  } catch (error) {
    console.error("Error entering lesson:", error);
    // Don't throw error - tracking is not critical for lesson viewing
    return null;
  }
};

/**
 * Notify tracking service that user exited a lesson page
 * @param {string} user_id - User ID
 * @returns {Promise} - Promise with the tracking response
 */
export const exitLesson = async (user_id) => {
  try {
    const response = await api.post('/tracking/lesson/exit', {
      user_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error exiting lesson:", error);
    // Don't throw error - tracking is not critical
    return null;
  }
};

/**
 * Get user's current lesson (for chatbot context)
 * @param {string} user_id - User ID
 * @returns {Promise} - Promise with current lesson data
 */
export const getCurrentLesson = async (user_id) => {
  try {
    const response = await api.get(`/tracking/user/${user_id}/current`);
    return response.data;
  } catch (error) {
    console.error("Error getting current lesson:", error);
    throw error;
  }
};
