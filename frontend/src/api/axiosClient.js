import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Bắt buộc để trình duyệt gửi HttpOnly Cookie (Câu 3d, 4c)
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về định dạng chuẩn { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const customError = {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý yêu cầu',
      timestamp: error.response?.data?.timestamp,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
