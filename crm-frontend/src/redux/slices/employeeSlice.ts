import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Employee {
  id: number;
  name: string;
  nip: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  joinDate?: string;
  address?: string;
  status?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (
      state,
      action: PayloadAction<{
        data: Employee[];
        pagination: any;
      }>,
    ) => {
      state.isLoading = false;
      state.employees = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchEmployeesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchEmployeeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
      state.isLoading = false;
      state.currentEmployee = action.payload;
    },
    fetchEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createEmployeeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
      state.isLoading = false;
      state.employees.push(action.payload);
    },
    createEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateEmployeeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
      state.isLoading = false;
      const index = state.employees.findIndex(
        (e) => e.id === action.payload.id,
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      state.currentEmployee = action.payload;
    },
    updateEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteEmployeeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteEmployeeSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
    deleteEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  fetchEmployeeStart,
  fetchEmployeeSuccess,
  fetchEmployeeFailure,
  createEmployeeStart,
  createEmployeeSuccess,
  createEmployeeFailure,
  updateEmployeeStart,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeStart,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
} = employeeSlice.actions;

export default employeeSlice.reducer;
