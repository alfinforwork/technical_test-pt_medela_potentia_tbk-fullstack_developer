import { employeeAPI } from "../../services/api";
import {
  createEmployeeFailure,
  createEmployeeStart,
  createEmployeeSuccess,
  deleteEmployeeFailure,
  deleteEmployeeStart,
  deleteEmployeeSuccess,
  fetchEmployeeFailure,
  fetchEmployeesFailure,
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeeStart,
  fetchEmployeeSuccess,
  updateEmployeeFailure,
  updateEmployeeStart,
  updateEmployeeSuccess,
} from "../slices/employeeSlice";
import { AppDispatch } from "../store";

export const fetchEmployees =
  (page = 1, limit = 10) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeesStart());
    try {
      const response = await employeeAPI.getAll(page, limit);
      dispatch(fetchEmployeesSuccess(response.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch employees";
      dispatch(fetchEmployeesFailure(errorMessage));
    }
  };

export const fetchEmployee = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(fetchEmployeeStart());
  try {
    const response = await employeeAPI.getById(id);
    dispatch(fetchEmployeeSuccess(response.data.data));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch employee";
    dispatch(fetchEmployeeFailure(errorMessage));
  }
};

export const fetchEmployeeByUserId =
  (userId: number) => async (dispatch: AppDispatch) => {
    dispatch(fetchEmployeeStart());
    try {
      const response = await employeeAPI.getByUserId(userId);
      dispatch(fetchEmployeeSuccess(response.data.data));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch employee";
      dispatch(fetchEmployeeFailure(errorMessage));
    }
  };

export const createEmployee = (data: any) => async (dispatch: AppDispatch) => {
  dispatch(createEmployeeStart());
  try {
    const response = await employeeAPI.create(data);
    dispatch(createEmployeeSuccess(response.data.data));
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to create employee";
    dispatch(createEmployeeFailure(errorMessage));
    throw error;
  }
};

export const updateEmployee =
  (id: number, data: any) => async (dispatch: AppDispatch) => {
    dispatch(updateEmployeeStart());
    try {
      const response = await employeeAPI.update(id, data);
      dispatch(updateEmployeeSuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update employee";
      dispatch(updateEmployeeFailure(errorMessage));
      throw error;
    }
  };

export const deleteEmployee = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(deleteEmployeeStart());
  try {
    await employeeAPI.delete(id);
    dispatch(deleteEmployeeSuccess(id));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete employee";
    dispatch(deleteEmployeeFailure(errorMessage));
    throw error;
  }
};
