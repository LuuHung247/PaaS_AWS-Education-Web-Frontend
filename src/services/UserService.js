import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_USER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add authentication token to each request
api.interceptors.request.use(
  async (config) => {
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens.idToken;

      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken.toString()}`;
      }
      return config;
      // eslint-disable-next-line no-unused-vars
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
 * Creates a new user profile - No authentication required
 * @param {Object} profileData - User profile data
 * @param {string} profileData.userId - User ID
 * @param {string} profileData.email - User email
 * @param {string} profileData.name - User full name
 * @param {string} profileData.gender - User gender
 * @param {string} profileData.birthdate - User birthdate (format: YYYY-MM-DD)
 * @returns {Promise} - Promise with the created profile data
 */
export const createUserProfile = async (profileData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USER_URL}/users/profile`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

/**
 * Fetches user profile by user ID only if user is logged in
 * @returns {Promise} - Promise with the user profile data or null if not logged in
 */
export const getCurrentUserProfile = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    if (!tokens?.idToken) {
      throw new Error("User not authenticated");
    }
    const response = await api.get(`/users/profile`);
    return response.data;
  } catch (error) {
    if (error?.response?.status !== 401) {
      throw error;
    }
  }
};

/**
 * Updates user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Promise with the updated profile data
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Updates user profile with avatar file upload
 * @param {string} userId - User ID
 * @param {File} avatarFile - Avatar image file
 * @param {Object} additionalData - Additional profile data (optional)
 * @returns {Promise} - Promise with the updated profile data
 */
export const updateUserProfileWithAvatar = async (
  userId,
  avatarFile,
  additionalData = {}
) => {
  try {
    const formData = new FormData();

    // Append avatar file
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    // Append additional profile data
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user profile with avatar:", error);
    throw error;
  }
};

/**
 * Fetches user profile by user ID
 * @param {string} userId - User ID to fetch profile for
 * @returns {Promise} - Promise with the user profile data
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
