import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/organisms/LoginForm";
import { login } from "../../redux/actions/authActions";
import { AppDispatch, RootState } from "../../redux/store";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(login(email, password) as any);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="w-full max-w-md">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
