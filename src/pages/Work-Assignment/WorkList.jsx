import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WorkList = () => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      let url = "";

      if (role === "Teacher") {
        url = `http://localhost:8000/api/coordinator-assignment/teacher?teacherId=${userId}`;
      } else if (
        role === "Senior Coordinator" ||
        role === "Junior Coordinator"
      ) {
        url = `http://localhost:8000/api/coordinator-assignment/all?coordinatorId=${userId}`;
      } else {
        url = "http://localhost:8000/api/coordinator-assignment/all";
      }

      const response = await axios.get(url);
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Assignments</h1>
        <div className="flex gap-2">
          {(role === "Senior Coordinator" || role === "Junior Coordinator") && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/assign-work")}
            >
              Assign New Work
            </button>
          )}
          <button className="btn btn-outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Work Type</th>
                <th>Projected Date</th>
                <th>Assigned Date</th>
                <th>Actual Date</th>
                {role === "Teacher" && <th>Coordinator</th>}

                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "Teacher" ? "10" : "9"}
                    className="text-center py-8"
                  >
                    No assignments found.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.teacherName}</td>
                    <td>{assignment.class}</td>
                    <td>{assignment.section}</td>
                    <td>{assignment.subject || "N/A"}</td>

                    <td className="capitalize">
                      {assignment.assignedWorkType}
                    </td>
                    <td>
                      {new Date(assignment.projectedDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </td>
                    <td>
                      {assignment.actualSubmissionDate
                        ? new Date(
                            assignment.actualSubmissionDate
                          ).toLocaleDateString()
                        : "Not submitted"}
                    </td>
                    {role === "Teacher" && (
                      <td>{assignment.coordinatorName}</td>
                    )}

                    {/* <td>
                      <span
                        className={`badge ${
                          assignment.actualSubmissionDate
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {assignment.actualSubmissionDate
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkList;
