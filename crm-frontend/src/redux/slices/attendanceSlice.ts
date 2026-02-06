import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Attendance {
  id: string;
  userId: number;
  employeeId: number;
  checkInTime: string;
  checkOutTime?: string;
  photoUrl?: string;
  checkOutPhoto?: string;
  notes?: string;
  status: string;
  attendanceDate: string;
  createdAt: string;
  updatedAt: string;
  employee?: any;
  user?: any;
}

interface AttendanceState {
  attendances: Attendance[];
  currentAttendance: Attendance | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: AttendanceState = {
  attendances: [],
  currentAttendance: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    fetchAttendancesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAttendancesSuccess: (
      state,
      action: PayloadAction<{
        data: Attendance[];
        pagination: any;
      }>,
    ) => {
      state.isLoading = false;
      state.attendances = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchAttendancesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchAttendanceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAttendanceSuccess: (state, action: PayloadAction<Attendance>) => {
      state.isLoading = false;
      state.currentAttendance = action.payload;
    },
    fetchAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createAttendanceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createAttendanceSuccess: (state, action: PayloadAction<Attendance>) => {
      state.isLoading = false;
      state.attendances.push(action.payload);
      state.currentAttendance = action.payload;
    },
    createAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateAttendanceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAttendanceSuccess: (state, action: PayloadAction<Attendance>) => {
      state.isLoading = false;
      const index = state.attendances.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.attendances[index] = action.payload;
      }
      state.currentAttendance = action.payload;
    },
    updateAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAttendancesStart,
  fetchAttendancesSuccess,
  fetchAttendancesFailure,
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  createAttendanceStart,
  createAttendanceSuccess,
  createAttendanceFailure,
  updateAttendanceStart,
  updateAttendanceSuccess,
  updateAttendanceFailure,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
