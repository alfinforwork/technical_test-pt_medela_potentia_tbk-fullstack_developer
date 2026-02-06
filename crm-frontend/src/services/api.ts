import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string, role?: string) =>
    api.post("/auth/register", { email, password, name, role }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
};

export const employeeAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get("/employees", { params: { page, limit } }),
  getActive: () => api.get("/employees/active"),
  getByUserId: (userId: number) => api.get(`/employees/user/${userId}`),
  getById: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post("/employees", data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
  activate: (id: number) => api.put(`/employees/${id}/activate`),
  deactivate: (id: number) => api.put(`/employees/${id}/deactivate`),
};

export const attendanceAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get("/attendances", { params: { page, limit } }),
  getUnverified: (page = 1, limit = 10) =>
    api.get("/attendances/unverified", { params: { page, limit } }),
  getByUser: (userId: number, page = 1, limit = 10) =>
    api.get(`/attendances/user/${userId}`, { params: { page, limit } }),
  getByEmployee: (employeeId: number, page = 1, limit = 10) =>
    api.get(`/attendances/employee/${employeeId}`, { params: { page, limit } }),
  getToday: (employeeId: number) => api.get(`/attendances/today/${employeeId}`),
  getById: (id: string) => api.get(`/attendances/${id}`),
  create: (data: any) => {
    const formData = new FormData();

    if (data.photoFile) {
      formData.append("photo", data.photoFile);
    }

    formData.append("userId", data.userId);
    formData.append("employeeId", data.employeeId);
    formData.append("checkInTime", data.checkInTime);
    formData.append("attendanceDate", data.attendanceDate);
    if (data.notes) {
      formData.append("notes", data.notes);
    }

    return api.post("/attendances", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  checkOut: (id: string, checkOutTime: string, photoFile?: File) => {
    if (photoFile) {
      const formData = new FormData();
      formData.append("checkOutTime", checkOutTime);
      formData.append("photo", photoFile);

      return api.put(`/attendances/${id}/checkout`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return api.put(`/attendances/${id}/checkout`, { checkOutTime });
  },
  update: (id: string, data: any) => api.put(`/attendances/${id}`, data),
  delete: (id: string) => api.delete(`/attendances/${id}`),
};

export default api;
