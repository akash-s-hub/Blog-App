import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let refreshPromise = null;

const shouldSkipRefresh = (config) =>
  Boolean(config?.skipAuthRefresh) || config?.url?.includes("/auth/refresh");

const shouldSkipRedirect = (config) => Boolean(config?.skipAuthRedirect);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post("/auth/refresh", null, {
          skipAuthRefresh: true,
          skipAuthRedirect: true,
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      if (!shouldSkipRedirect(originalRequest) && typeof window !== "undefined") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api; import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends httpOnly cookies (accessToken, refreshToken)
});

let isRefreshing = false;
let queue = []; // requests waiting on a refresh in progress

function processQueue(error) {
  queue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  queue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another request already triggered a refresh — wait for it
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest); // retry the original request
      } catch (refreshError) {
        processQueue(refreshError);
        // refresh itself failed — session is truly dead
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;