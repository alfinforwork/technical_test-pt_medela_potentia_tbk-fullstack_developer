import { authAPI } from "../../services/api";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
} from "../slices/authSlice";
import { AppDispatch } from "../store";

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {
      const response = await authAPI.login(email, password);
      const { data } = response.data;
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.accessToken,
        }),
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  };

export const register =
  (email: string, password: string, name: string, role?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(registerStart());
    try {
      const response = await authAPI.register(email, password, name, role);
      dispatch(registerSuccess());
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch(registerFailure(errorMessage));
      throw error;
    }
  };
