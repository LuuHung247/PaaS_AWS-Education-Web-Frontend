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
 * Generate or retrieve unique tab ID for this browser tab
 * Uses sessionStorage so each tab has its own unique ID
 * @returns {string} - Unique tab ID
 */
export const getTabId = () => {
  let tabId = sessionStorage.getItem('educonnect_tab_id');
  if (!tabId) {
    // Generate UUID v4
    tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('educonnect_tab_id', tabId);
  }
  return tabId;
};

/**
 * Notify tracking service that user entered a lesson page in this tab
 * @param {Object} data - Lesson tracking data
 * @param {string} data.user_id - User ID
 * @param {string} data.lesson_id - Lesson ID
 * @param {string} data.serie_id - Serie ID
 * @param {string} data.lesson_title - Lesson title (optional)
 * @param {string} data.tab_id - Browser tab ID (optional, will auto-generate)
 * @returns {Promise} - Promise with the tracking response
 */
export const enterLesson = async ({ user_id, lesson_id, serie_id, lesson_title, tab_id }) => {
  try {
    const finalTabId = tab_id || getTabId();
    const response = await api.post('/tracking/lesson/enter', {
      user_id,
      lesson_id,
      serie_id,
      lesson_title,
      tab_id: finalTabId,
    });
    return response.data;
  } catch (error) {
    console.error("Error entering lesson:", error);
    // Don't throw error - tracking is not critical for lesson viewing
    return null;
  }
};

/**
 * Notify tracking service that user exited a lesson page in this tab
 * @param {string} user_id - User ID
 * @param {string} tab_id - Browser tab ID (optional, will auto-generate)
 * @returns {Promise} - Promise with the tracking response
 */
export const exitLesson = async (user_id, tab_id) => {
  try {
    const finalTabId = tab_id || getTabId();
    const response = await api.post('/tracking/lesson/exit', {
      user_id,
      tab_id: finalTabId,
    });
    return response.data;
  } catch (error) {
    console.error("Error exiting lesson:", error);
    // Don't throw error - tracking is not critical
    return null;
  }
};

/**
 * Update focus when user switches to this tab
 * @param {string} user_id - User ID
 * @param {string} tab_id - Browser tab ID (optional, will auto-generate)
 * @returns {Promise} - Promise with the tracking response
 */
export const updateFocus = async (user_id, tab_id) => {
  try {
    const finalTabId = tab_id || getTabId();
    const response = await api.post('/tracking/lesson/focus', {
      user_id,
      tab_id: finalTabId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating focus:", error);
    // Don't throw error - tracking is not critical
    return null;
  }
};

/**
 * Get user's current lesson (focused tab) and all active lessons
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
