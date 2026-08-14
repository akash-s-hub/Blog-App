import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = []; // holds { resolve, reject } for requests waiting on refresh

function processQueue(error) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh on 401, and never for the refresh/login routes themselves
    // (avoids infinite loop if refresh itself returns 401)
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // A refresh is already in flight — queue this request until it's done
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; // prevent infinite retry loop
      isRefreshing = true;

      try {
        await api.post("/auth/refresh"); // adjust path if yours differs
        processQueue(null);
        return api(originalRequest); // retry the original failed request
      } catch (refreshError) {
        processQueue(refreshError);
        // refresh failed too — session is truly dead, let AuthContext handle logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;