import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/atoms/Alert";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Heading from "../../components/atoms/Heading";
import FormField from "../../components/molecules/FormField";
import { register } from "../../redux/actions/authActions";
import { AppDispatch, RootState } from "../../redux/store";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        register(formData.email, formData.password, formData.name) as any,
      );
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen py-12">
      <Card className="w-full max-w-md">
        <Heading level={2} className="mb-6 text-center">
          Create Account
        </Heading>

        {error && (
          <Alert type="error" onClose={() => {}}>
            {error}
          </Alert>
        )}
        {localError && (
          <Alert type="error" onClose={() => setLocalError("")}>
            {localError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Full Name"
            required
            inputValue={formData.name}
            inputOnChange={handleChange}
            inputName="name"
            inputPlaceholder="John Doe"
            inputDisabled={isLoading}
          />

          <FormField
            label="Email"
            required
            inputType="email"
            inputValue={formData.email}
            inputOnChange={handleChange}
            inputName="email"
            inputPlaceholder="your@email.com"
            inputDisabled={isLoading}
          />

          <FormField
            label="Password"
            required
            inputType="password"
            inputValue={formData.password}
            inputOnChange={handleChange}
            inputName="password"
            inputPlaceholder="Enter password"
            inputDisabled={isLoading}
          />

          <FormField
            label="Confirm Password"
            required
            inputType="password"
            inputValue={formData.confirmPassword}
            inputOnChange={handleChange}
            inputName="confirmPassword"
            inputPlaceholder="Confirm password"
            inputDisabled={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            className="w-full mt-6"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
