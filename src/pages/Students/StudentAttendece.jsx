import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [activeClass, setActiveClass] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    // Load assigned classes from localStorage
    const storedClasses = JSON.parse(
      localStorage.getItem("assignedClasses") || "[]"
    );
    setAssignedClasses(storedClasses);

    // Get stored selections from previous page
    const storedClass = localStorage.getItem("selectedAttendanceClass");
    const storedSection = localStorage.getItem("selectedAttendanceSection");

    // If we have stored class/section from previous page, use those
    if (storedClass) {
      setActiveClass(storedClass);

      if (storedSection) {
        setActiveSection(storedSection);
      } else if (storedClasses.length > 0) {
        // Find the selected class and get its first section
        const selectedClassObj = storedClasses.find(
          (cls) => cls.value === storedClass
        );
        if (selectedClassObj?.sections?.length > 0) {
          setActiveSection(selectedClassObj.sections[0].value);
        }
      }
      // Clear the stored values after using them
      localStorage.removeItem("selectedAttendanceClass");
      localStorage.removeItem("selectedAttendanceSection");
    }
    // Otherwise use defaults
    else if (storedClasses.length > 0) {
      setActiveClass(storedClasses[0].value);
      if (storedClasses[0].sections && storedClasses[0].sections.length > 0) {
        setActiveSection(storedClasses[0].sections[0].value);
      }
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!activeClass || !activeSection) return;

      try {
        const url = `https://d2-c-b.vercel.app/api/student/filter-by-class?studentClass=${activeClass}&studentSection=${activeSection}&page=1`;
        const res = await axios.get(url);

        // Filter to only active students
        const filteredStudents = res.data.data.filter(
          (student) => student.isActive === true
        );
        setStudents(filteredStudents);

        // Check existing attendance for the selected date
        await checkExistingAttendance(filteredStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        toast.error("Error fetching students. Please try again later.");
        setStudents([]);
      }
    };

    const checkExistingAttendance = async (students) => {
      try {
        const response = await axios.get(
          `https://d2-c-b.vercel.app/api/student-attendance?date=${selectedDate}&class=${activeClass}&section=${activeSection}`
        );

        const existingAttendance = response.data.data || [];
        const initialStatus = {};

        students.forEach((student) => {
          const existing = existingAttendance.find(
            (a) => a.student === student._id
          );
          // Default to Present instead of Absent
          initialStatus[student._id] = existing ? existing.status : "Present";
        });

        setAttendanceStatus(initialStatus);
        setPendingChanges(false);
      } catch (error) {
        console.error("Error checking existing attendance:", error);
        // Initialize all as Present if check fails
        const initialStatus = {};
        students.forEach((student) => {
          initialStatus[student._id] = "Present";
        });
        setAttendanceStatus(initialStatus);
        setPendingChanges(false);
      }
    };

    fetchStudents();
  }, [activeClass, activeSection, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus((prev) => {
      const newStatus = { ...prev, [studentId]: status };
      // Check if there are any changes from the initial state
      const hasChanges = students.some((student) => {
        const initialStatus = prev[student._id];
        return newStatus[student._id] !== initialStatus;
      });
      setPendingChanges(hasChanges);
      return newStatus;
    });
  };

  const handleAttendanceAction = async (studentId, status) => {
    try {
      const student = students.find((s) => s._id === studentId);
      // First try to update existing attendance
      const updateResponse = await axios.put(
        "https://d2-c-b.vercel.app/api/student-attendance/update",
        {
          student: studentId,
          status,
          date: selectedDate,
        }
      );

      if (updateResponse.data.success) {
        return { success: true, name: student.name };
      }
    } catch (updateError) {
      // If update fails (likely because record doesn't exist), try to create
      try {
        const student = students.find((s) => s._id === studentId);
        const createResponse = await axios.post(
          "https://d2-c-b.vercel.app/api/student-attendance/create",
          {
            student: studentId,
            name: student.name,
            rollNumber: student.rollNumber,
            studentClass: student.studentClass,
            studentSection: student.studentSection,
            status,
            date: selectedDate,
          }
        );

        if (createResponse.data.success) {
          return { success: true, name: student.name };
        }
      } catch (createError) {
        console.error("Error creating attendance:", createError);
        return {
          success: false,
          name: student.name,
          error:
            createError.response?.data?.error || "Error recording attendance",
        };
      }
    }
  };

  const confirmBulkSubmit = () => {
    if (!pendingChanges) {
      toast.error("No changes to save");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleBulkSubmit = async () => {
    setShowConfirmModal(false);

    if (!selectedDate) {
      toast.error("Please select a date before submitting.");
      return;
    }

    if (students.length === 0) {
      toast.error("No active students found to submit attendance for.");
      return;
    }

    setIsSubmitting(true);

    const results = await Promise.allSettled(
      students.map(async (student) => {
        try {
          // Default to Present if status is undefined
          const status = attendanceStatus[student._id] || "Present";
          const result = await handleAttendanceAction(student._id, status);
          return result;
        } catch (error) {
          return {
            success: false,
            name: student.name,
            error: error.response?.data?.error || error.message,
          };
        }
      })
    );

    const successful = results.filter((r) => r.value?.success);
    const failed = results.filter((r) => !r.value?.success);

    if (successful.length > 0) {
      toast.success(`Attendance saved for ${successful.length} students`);
    }
    if (failed.length > 0) {
      failed.forEach((f) => {
        toast.error(`Failed for ${f.value.name}: ${f.value.error}`);
      });
    }

    setIsSubmitting(false);
    setPendingChanges(false);

    // Refresh the attendance data
    const response = await axios.get(
      `https://d2-c-b.vercel.app/api/student-attendance?date=${selectedDate}&class=${activeClass}&section=${activeSection}`
    );

    const existingAttendance = response.data.data || [];
    const updatedStatus = {};

    students.forEach((student) => {
      const existing = existingAttendance.find(
        (a) => a.student === student._id
      );
      updatedStatus[student._id] = existing ? existing.status : "Present";
    });

    setAttendanceStatus(updatedStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Confirm Attendance Submission
            </h3>
            <p className="mb-4">
              Are you sure you want to save the attendance for {selectedDate}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-lg">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/display-attendence-stu")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Student Attendance
        </h2>

        {/* Class Tabs */}
        {assignedClasses.length > 0 && (
          <div className="mb-4">
            <div role="tablist" className="tabs tabs-boxed flex-wrap">
              {assignedClasses.map((cls) => (
                <button
                  key={cls._id}
                  onClick={() => {
                    setActiveClass(cls.value);
                    if (cls.sections && cls.sections.length > 0) {
                      setActiveSection(cls.sections[0].value);
                    }
                  }}
                  className={`tab ${
                    activeClass === cls.value ? "tab-active" : ""
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Tabs */}
        {assignedClasses.find((c) => c.value === activeClass)?.sections
          ?.length > 0 && (
          <div className="mb-6">
            <div role="tablist" className="tabs tabs-boxed flex-wrap">
              {assignedClasses
                .find((c) => c.value === activeClass)
                ?.sections?.map((section) => (
                  <button
                    key={section._id}
                    onClick={() => setActiveSection(section.value)}
                    className={`tab ${
                      activeSection === section.value ? "tab-active" : ""
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date:</label>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active students found for {activeClass} - {activeSection}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Roll No.</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.studentClass}</td>
                    <td className="px-4 py-2">{student.studentSection}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="Present"
                            checked={
                              attendanceStatus[student._id] === "Present"
                            }
                            onChange={() =>
                              handleStatusChange(student._id, "Present")
                            }
                            className="accent-green-500"
                          />
                          <span className="text-sm">Present</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="Absent"
                            checked={
                              attendanceStatus[student._id] === "Absent"
                            }
                            onChange={() =>
                              handleStatusChange(student._id, "Absent")
                            }
                            className="accent-red-500"
                          />
                          <span className="text-sm">Absent</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={confirmBulkSubmit}
          className={`mt-4 text-white px-4 py-2 rounded transition w-full ${
            pendingChanges
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={
            isSubmitting ||
            !selectedDate ||
            students.length === 0 ||
            !pendingChanges
          }
        >
          {isSubmitting ? "Processing..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
};

export default StudentAttendance;