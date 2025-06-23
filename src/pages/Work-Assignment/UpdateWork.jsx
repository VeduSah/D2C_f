import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateWork = () => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [actualDate, setActualDate] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const navigate = useNavigate();
  const teacherId = localStorage.getItem("id");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/coordinator-assignment/teacher?teacherId=${teacherId}`
      );
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (assignmentId) => {
    if (!actualDate) {
      toast.error("Please select actual submission date!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/coordinator-assignment/submission/${assignmentId}`,
        {
          actualSubmissionDate: actualDate,
        }
      );
      if (response.data.success) {
        toast.success("Work updated successfully!");
        fetchAssignments();
        setActualDate("");
        setSelectedId("");
      } else {
        toast.error(response.data.message || "Failed to update work");
      }
    } catch (error) {
      console.error("Error updating work:", error);
      toast.error("Error updating work");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Work Assignments</h1>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No work assignments found.</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="card bg-base-100 shadow-xl mb-4"
              >
                <div className="card-body">
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4 items-end">
                    {/* <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Teacher
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.teacherName}
                        disabled
                      />
                    </div> */}

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Class
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.class}
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Section
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.section}
                        disabled
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Subject
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.subject || ""}
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Work Type
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.assignedWorkType}
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Projected Date
                        </span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered input-sm"
                        value={
                          assignment.projectedDate
                            ? assignment.projectedDate.split("T")[0]
                            : ""
                        }
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Coordinator
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={assignment.coordinatorName}
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Assigned Date
                        </span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered input-sm"
                        value={
                          assignment.assignedDate
                            ? assignment.assignedDate.split("T")[0]
                            : ""
                        }
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-xs">
                          Actual Date
                        </span>
                      </label>
                      {assignment.actualSubmissionDate ? (
                        <input
                          type="date"
                          className="input input-bordered input-sm"
                          value={assignment.actualSubmissionDate.split("T")[0]}
                          disabled
                        />
                      ) : (
                        <input
                          type="date"
                          className="input input-bordered input-sm"
                          value={
                            selectedId === assignment._id ? actualDate : ""
                          }
                          onChange={(e) => {
                            setActualDate(e.target.value);
                            setSelectedId(assignment._id);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    {assignment.actualSubmissionDate ? (
                      <span className="badge badge-success">Updated</span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdate(assignment._id)}
                        disabled={
                          loading ||
                          selectedId !== assignment._id ||
                          !actualDate
                        }
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateWork;
