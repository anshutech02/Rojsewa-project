import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rojsewa-project-1.onrender.com/api',
  withCredentials: true,
  timeout: 60000, // 60s timeout to handle Render cold starts (~30-50s)
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Token refresh queue ---
// Prevents multiple concurrent 401s from each firing their own refresh request.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Auto Refresh Token + Retry on network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- Retry once on network/timeout errors (Render cold-start) ---
    if (
      !error.response &&
      !originalRequest._networkRetry &&
      (error.code === 'ECONNABORTED' || error.message === 'Network Error')
    ) {
      originalRequest._networkRetry = true;
      // Wait 3 seconds then retry — gives Render time to spin up
      await new Promise((r) => setTimeout(r, 3000));
      return api(originalRequest);
    }

    // --- Handle 401 TOKEN_EXPIRED with refresh ---
    if (
      error.response?.status === 401 &&
      error.response.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // If a refresh is already in-flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          'https://rojsewa-project-1.onrender.com/auth/refresh',
          {},
          { withCredentials: true, timeout: 60000 }
        );
        const newToken = data.accessToken;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;        await api.get("/api/health");
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed");
        console.log("Status:", refreshError.response?.status);
        console.log("Data:", refreshError.response?.data);
        console.log("Message:", refreshError.message);

        processQueue(refreshError, null);

        // if (refreshError.response?.status === 401) {
        //   localStorage.removeItem("accessToken");
        //   window.location.href = "/login";
        // }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
