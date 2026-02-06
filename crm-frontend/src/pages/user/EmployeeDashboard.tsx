import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../components/atoms/Alert";
import Card from "../../components/atoms/Card";
import Heading from "../../components/atoms/Heading";
import Loader from "../../components/atoms/Loader";
import CheckInForm from "../../components/organisms/CheckInForm";
import {
  checkOutAttendance,
  createAttendance,
  fetchTodayAttendance,
} from "../../redux/actions/attendanceActions";
import { fetchEmployeeByUserId } from "../../redux/actions/employeeActions";
import { AppDispatch, RootState } from "../../redux/store";
import getImageUrl from "../../utils/getImageUrl";

const EmployeeDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    currentEmployee,
    isLoading: employeeLoading,
    error: employeeError,
  } = useSelector((state: RootState) => state.employee);
  const {
    isLoading: attendanceLoading,
    error: attendanceError,
    currentAttendance,
  } = useSelector((state: RootState) => state.attendance);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchEmployeeByUserId(user.id) as any);
    }
  }, [dispatch, user?.id]);

  const employeeId = currentEmployee?.id;

  useEffect(() => {
    console.log("employeeId", employeeId);
    if (employeeId) {
      dispatch(fetchTodayAttendance(employeeId) as any);
    }
  }, [dispatch, employeeId]);

  const handleCheckIn = async (data: { photoFile: File; notes: string }) => {
    if (!employeeId) {
      throw new Error("Employee record not found for this account");
    }
    const now = new Date().toISOString();
    const today = new Date().toISOString().split("T")[0];

    try {
      await dispatch(
        createAttendance({
          userId: user?.id,
          employeeId,
          checkInTime: now,
          photoFile: data.photoFile,
          notes: data.notes,
          attendanceDate: today,
        }) as any,
      );
      await dispatch(fetchTodayAttendance(employeeId) as any);
    } catch (error) {
      console.error("Check-in error:", error);
    }
  };

  const handleCheckOut = async (data: { photoFile: File }) => {
    if (!currentAttendance?.id) return;
    const now = new Date().toISOString();
    try {
      await dispatch(
        checkOutAttendance(currentAttendance.id, now, data.photoFile) as any,
      );
      if (employeeId) {
        await dispatch(fetchTodayAttendance(employeeId) as any);
      }
    } catch (error) {
      console.error("Check-out error:", error);
    }
  };

  if (employeeLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const mode = currentAttendance?.checkOutTime
    ? "done"
    : currentAttendance?.checkInTime
      ? "checkout"
      : "checkin";

  return (
    <div className="space-y-6">
      {attendanceError && <Alert type="error">{attendanceError}</Alert>}
      {employeeError && <Alert type="error">{employeeError}</Alert>}

      {!employeeId && (
        <Alert type="error">
          Employee record not found for this account. Please contact HR.
        </Alert>
      )}

      <CheckInForm
        mode={mode}
        attendance={currentAttendance}
        employeeName={currentEmployee?.name}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isLoading={attendanceLoading}
      />

      {currentAttendance && (
        <Card className="border-l-4 border-l-blue-500">
          <Heading level={4} className="mb-4">
            Today&apos;s Attendance Details
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-In Time</p>
              <p className="text-lg font-semibold">
                {new Date(currentAttendance.checkInTime).toLocaleString()}
              </p>
            </div>

            {currentAttendance.checkOutTime && (
              <div>
                <p className="text-sm text-gray-600">Check-Out Time</p>
                <p className="text-lg font-semibold">
                  {new Date(currentAttendance.checkOutTime).toLocaleString()}
                </p>
              </div>
            )}

            {currentAttendance.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-base">{currentAttendance.notes}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold capitalize">
                {currentAttendance.status?.replace("_", " ")}
              </p>
            </div>

            {currentAttendance.photoUrl && (
              <div>
                <p className="text-sm text-gray-600">Check-In Photo</p>
                <img
                  src={getImageUrl(currentAttendance.photoUrl)}
                  alt="Check-in"
                  className="w-full h-32 object-cover rounded-lg border border-gray-300 mt-2"
                />
              </div>
            )}

            {currentAttendance.checkOutPhoto && (
              <div>
                <p className="text-sm text-gray-600">Check-Out Photo</p>
                <img
                  src={getImageUrl(currentAttendance.checkOutPhoto)}
                  alt="Check-out"
                  className="w-full h-32 object-cover rounded-lg border border-gray-300 mt-2"
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDashboard;
