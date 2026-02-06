import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../components/atoms/Alert";
import Card from "../../components/atoms/Card";
import Heading from "../../components/atoms/Heading";
import Loader from "../../components/atoms/Loader";
import Pagination from "../../components/molecules/Pagination";
import { fetchAttendances } from "../../redux/actions/attendanceActions";
import { AppDispatch, RootState } from "../../redux/store";
import getImageUrl from "../../utils/getImageUrl";

const AttendanceMonitoring: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { attendances, isLoading, pagination } = useSelector(
    (state: RootState) => state.attendance,
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAttendances(currentPage) as any);
  }, [dispatch, currentPage]);

  return (
    <div className="space-y-6 overflow-auto">
      <div>
        <Heading level={1}>Attendance Records</Heading>
        <p className="text-gray-600 mt-1">
          View all employee attendance records
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : attendances.length === 0 ? (
        <Alert type="info">No attendance records found</Alert>
      ) : (
        <div className="grid gap-4">
          {attendances.map((attendance) => (
            <Card key={attendance.id} className="hover:shadow-lg transition">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {attendance.photoUrl ? (
                    <a
                      href={getImageUrl(attendance.photoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-sm text-gray-600 mb-2 font-semibold">
                        Check-In Photo
                      </p>
                      <img
                        src={getImageUrl(attendance.photoUrl)}
                        alt="Attendance proof"
                        className="w-60 h-40 object-cover rounded-lg border border-gray-300"
                      />
                    </a>
                  ) : (
                    <div className="w-60 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No photo
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <Heading level={3} className="mb-0">
                        {attendance.employee?.name}
                      </Heading>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700">
                          Check-in Time
                        </p>
                        <p className="text-gray-600">
                          {new Date(attendance.checkInTime).toLocaleString()}
                        </p>
                      </div>

                      {attendance.checkOutTime && (
                        <div>
                          <p className="font-semibold text-gray-700">
                            Check-out Time
                          </p>
                          <p className="text-gray-600">
                            {new Date(attendance.checkOutTime).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-700">Status</p>
                        <p className="text-gray-600 capitalize">
                          {attendance.status?.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {attendance.notes && (
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">
                          Notes
                        </p>
                        <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                          {attendance.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {attendance.checkOutPhoto && (
                  <div className="flex-shrink-0">
                    {" "}
                    <a
                      href={getImageUrl(attendance.checkOutPhoto)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-sm text-gray-600 mb-2 font-semibold">
                        Check-Out Photo
                      </p>
                      <img
                        src={getImageUrl(attendance.checkOutPhoto)}
                        alt="Checkout proof"
                        className="w-60 h-40 object-cover rounded-lg border border-gray-300"
                      />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination?.pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AttendanceMonitoring;
