import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  //baseURL: 'http://localhost:5001/api', // Base API URL
  //baseURL: 'https://websitejuice.onrender.com/api'
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://websitejuice.onrender.com/api',
});

// Automatically add the Authorization header if the token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth-related API calls
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const fetchProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const fetchAdminData = () => API.get('/auth/admin');

// Classes-related API calls
//export const getClasses = () => API.get('/classes'); // Fetch all classes
export const getClasses = async () => {
  try {
    const response = await API.get('/classes');
    return response.data; // Make sure this returns an array
  } catch (error) {
    console.error("Error fetching classes:", error);
    return []; // Prevent frontend crashes
  }
};

export const addChapter = (data) => API.post('/classes/add-chapter', data); // Add a chapter (admin only)
export const addLesson = (data) => API.post('/classes/add-lesson', data); // Add a lesson to a chapter (admin only)
export const updateLesson = (lessonId, data) =>
  API.put(`/classes/update-lesson/${lessonId}`, data); // Update a specific lesson (admin only)

export const watchLesson = async (chapterId, lessonId) => {
  try {
    const response = await API.post('/classes/watch-lesson', { chapterId, lessonId });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to watch lesson: ${error.response?.data?.message || error.message}`);
  }
};


export const deleteLesson = async (lessonId) => {
  try {
    const token = localStorage.getItem('token');
    //const response = await axios.delete(`${BASE_URL}/api/classes/delete-lesson/${lessonId}`, {
      const response = await axios.delete(`/classes/delete-lesson/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete lesson: ${error.response?.data?.message || error.message}`);
  }
};

// export const addClass = async (classData) => {
//   const token = localStorage.getItem("token"); // Get auth token
//   //const response = await fetch("${BASE_URL}/api/classes/add-class", {
//     const response = await API.post("/classes/add-class", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // Ensure only admins can add classes
//     },
//     body: JSON.stringify(classData),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to add class");
//   }

//   return await response.json();
// };
export const addClass = async (classData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.post("/classes/add-class", classData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding class:", error.response?.data || error.message);
    throw error;
  }
};

export const updateClassTitle = async (classId, updatedData) => {
  const response = await API.put(`/classes/update-class/${classId}`, updatedData);
  return response.data;
};
// export const deleteClass = async (classId) => {
//   const response = await API.delete(`/classes/delete-class/${classId}`);
//   return response.data;
// };
export const deleteClass = async (classId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.delete(`/classes/delete-class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting class:", error.response?.data || error.message);
    throw error;
  }
};

//export:
export default API;
