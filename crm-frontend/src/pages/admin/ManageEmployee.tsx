import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../components/atoms/Alert";
import Button from "../../components/atoms/Button";
import Card from "../../components/atoms/Card";
import Heading from "../../components/atoms/Heading";
import Loader from "../../components/atoms/Loader";
import FormField from "../../components/molecules/FormField";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "../../redux/actions/employeeActions";
import { AppDispatch, RootState } from "../../redux/store";

const ManageEmployee: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, isLoading } = useSelector(
    (state: RootState) => state.employee,
  );
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    department: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees() as any);
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (isEditing && editingId) {
        await dispatch(updateEmployee(editingId, formData) as any);
        setSuccessMessage("Employee updated successfully!");
      } else {
        await dispatch(createEmployee(formData) as any);
        setSuccessMessage("Employee added successfully!");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        position: "",
        department: "",
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (isEditing ? "Failed to update employee" : "Failed to add employee");
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteEmployee = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await dispatch(deleteEmployee(id) as any);
        setSuccessMessage("Employee deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleEditEmployee = (employee: any) => {
    setIsEditing(true);
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: "",
      phone: employee.phone || "",
      position: employee.position || "",
      department: employee.department || "",
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      position: "",
      department: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Employee Management</Heading>
          <p className="text-gray-600 mt-1">
            Manage and monitor your employees
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? (
            <>
              <MdClose className="inline mr-2" size={18} />
              Cancel
            </>
          ) : (
            <>
              <MdAdd className="inline mr-2" size={18} />
              Add Employee
            </>
          )}
        </Button>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      {errorMessage && <Alert type="error">{errorMessage}</Alert>}

      {showForm && (
        <Card className="border-l-4 border-blue-500">
          <Heading level={2} className="mb-4">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </Heading>
          <form
            onSubmit={handleAddEmployee}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              label="Name"
              required
              inputValue={formData.name}
              inputOnChange={handleInputChange}
              inputName="name"
              inputPlaceholder="Employee Name"
            />
            <FormField
              label="Email"
              required
              inputType="email"
              inputValue={formData.email}
              inputOnChange={handleInputChange}
              inputName="email"
              inputPlaceholder="email@company.com"
            />
            <FormField
              label={
                isEditing
                  ? "Password (leave empty to keep current)"
                  : "Password"
              }
              required={!isEditing}
              inputType="password"
              inputValue={formData.password}
              inputOnChange={handleInputChange}
              inputName="password"
              inputPlaceholder="Minimum 6 characters"
            />
            <FormField
              label="Phone"
              inputValue={formData.phone}
              inputOnChange={handleInputChange}
              inputName="phone"
              inputPlaceholder="08xxx"
            />
            <FormField
              label="Position"
              inputValue={formData.position}
              inputOnChange={handleInputChange}
              inputName="position"
              inputPlaceholder="Job Position"
            />
            <FormField
              label="Department"
              inputValue={formData.department}
              inputOnChange={handleInputChange}
              inputName="department"
              inputPlaceholder="Department"
            />
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" variant="primary" className="flex-1">
                {isEditing ? "Update Employee" : "Add Employee"}
              </Button>
              <Button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No employees found. Add one to get started!
              </p>
            </Card>
          ) : (
            employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Heading level={3} className="mb-0">
                        {employee.name}
                      </Heading>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          employee.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                      <div>
                        <p className="font-semibold text-gray-800">Email</p>
                        <p>{employee.email}</p>
                      </div>
                      {employee.position && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            Position
                          </p>
                          <p>{employee.position}</p>
                        </div>
                      )}
                      {employee.department && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            Department
                          </p>
                          <p>{employee.department}</p>
                        </div>
                      )}
                      {employee.phone && (
                        <div>
                          <p className="font-semibold text-gray-800">Phone</p>
                          <p>{employee.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 whitespace-nowrap">
                    <Button
                      variant="primary"
                      onClick={() => handleEditEmployee(employee)}
                      className="text-sm"
                    >
                      <MdEdit className="inline mr-1" size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDeleteEmployee(employee.id, employee.name)
                      }
                      className="text-sm"
                    >
                      <FaTrash className="inline mr-1" size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
