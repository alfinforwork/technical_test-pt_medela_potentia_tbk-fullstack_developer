import { attendanceAPI } from "../../services/api";
import {
  createAttendanceFailure,
  createAttendanceStart,
  createAttendanceSuccess,
  fetchAttendanceFailure,
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendancesFailure,
  fetchAttendancesStart,
  fetchAttendancesSuccess,
  updateAttendanceFailure,
  updateAttendanceStart,
  updateAttendanceSuccess,
} from "../slices/attendanceSlice";
import { AppDispatch } from "../store";

export const fetchAttendances =
  (page = 1, limit = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchAttendancesStart());
    try {
      const response = await attendanceAPI.getAll(page, limit);
      dispatch(fetchAttendancesSuccess(response.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendances";
      dispatch(fetchAttendancesFailure(errorMessage));
    }
  };

export const fetchUnverifiedAttendances =
  (page = 1, limit = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchAttendancesStart());
    try {
      const response = await attendanceAPI.getUnverified(page, limit);
      dispatch(fetchAttendancesSuccess(response.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendances";
      dispatch(fetchAttendancesFailure(errorMessage));
    }
  };

export const fetchTodayAttendance =
  (employeeId: number) => async (dispatch: AppDispatch) => {
    dispatch(fetchAttendanceStart());
    try {
      const response = await attendanceAPI.getToday(employeeId);
      dispatch(fetchAttendanceSuccess(response.data.data));
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch today attendance";
      dispatch(fetchAttendanceFailure(errorMessage));
      throw error;
    }
  };

export const fetchUserAttendances =
  (userId: number, page = 1, limit = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchAttendancesStart());
    try {
      const response = await attendanceAPI.getByUser(userId, page, limit);
      dispatch(fetchAttendancesSuccess(response.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendances";
      dispatch(fetchAttendancesFailure(errorMessage));
    }
  };

export const fetchEmployeeAttendances =
  (employeeId: number, page = 1, limit = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchAttendancesStart());
    try {
      const response = await attendanceAPI.getByEmployee(
        employeeId,
        page,
        limit,
      );
      dispatch(fetchAttendancesSuccess(response.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendances";
      dispatch(fetchAttendancesFailure(errorMessage));
    }
  };

export const createAttendance =
  (data: any) => async (dispatch: AppDispatch) => {
    dispatch(createAttendanceStart());
    try {
      const response = await attendanceAPI.create(data);
      dispatch(createAttendanceSuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create attendance";
      dispatch(createAttendanceFailure(errorMessage));
      throw error;
    }
  };

export const checkOutAttendance =
  (id: string, checkOutTime: string, photoFile?: File) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateAttendanceStart());
    try {
      const response = await attendanceAPI.checkOut(
        id,
        checkOutTime,
        photoFile,
      );
      dispatch(updateAttendanceSuccess(response.data.data));
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to check out";
      dispatch(updateAttendanceFailure(errorMessage));
      throw error;
    }
  };
