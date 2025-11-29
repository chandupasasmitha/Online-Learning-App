// Axios instance + API calls
import axios from "axios";
import { getToken, removeToken } from "../utils/storage";

// Configure your backend URL here
const API_URL = "https://online-learning-app-0vcd.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Course APIs
export const courseAPI = {
  getAllCourses: (params) => api.get("/courses", { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  getInstructorCourses: () => api.get("/courses/instructor/my-courses"),
  getCourseStudents: (id) => api.get(`/courses/${id}/students`),
};

// Enrollment APIs
export const enrollmentAPI = {
  enrollInCourse: (courseId) => api.post("/enrollments", { courseId }),
  getMyEnrollments: () => api.get("/enrollments/my-courses"),
  checkEnrollment: (courseId) => api.get(`/enrollments/check/${courseId}`),
  updateProgress: (id, progress) =>
    api.put(`/enrollments/${id}/progress`, { progress }),
  unenrollFromCourse: (id) => api.delete(`/enrollments/${id}`),
};

// GPT APIs
export const gptAPI = {
  getCourseRecommendations: (prompt) =>
    api.post("/gpt/recommendations", { prompt }),
};

export default api;
