import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaWhatsapp, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Homework = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [fetchingHomeworks, setFetchingHomeworks] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState("");

  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const uid = localStorage.getItem("id");
  const assignedSubjects = JSON.parse(localStorage.getItem("assignedSubjects"));

  // Get current date for default due date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  useEffect(() => {
    fetchTeacherHomeworks();
  }, []);

  const fetchTeacherHomeworks = () => {
    setFetchingHomeworks(true);
    axios
      .get(`https://d2-c-b.vercel.app/api/homework/teacher/${uid}`)
      .then((res) => {
        if (res.data.success) {
          setHomeworks(res.data.data || []);
        } else {
          setHomeworks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching homeworks:", error);
        setHomeworks([]);
      })
      .finally(() => {
        setFetchingHomeworks(false);
      });
  };

  const shareOnWhatsApp = (e, homework) => {
    e.stopPropagation(); // Prevent row click

    const message =
      `*Homework for Class ${
        homework.className
      }-${homework.section.toUpperCase()}*\n\n` +
      `*Subject:* ${homework.subject}\n` +
      `*Description:* ${homework.description}\n` +
      `*Due Date:* ${new Date(homework.dueDate).toLocaleDateString()}\n` +
      `*Teacher:* ${homework.teacherName}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const openModal = (e, homework) => {
    e.stopPropagation();
    setSelectedHomework(homework);
    setEditDescription(homework.description);
    setEditDueDate(homework.dueDate.split("T")[0]);
    setEditSubject(homework.subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHomework(null);
    setEditDescription("");
    setEditDueDate("");
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    if (!editDescription || !editDueDate) {
      toast.error("Please fill all fields");
      return;
    }

    setIsEditing(true);
    axios
      .put(`https://d2-c-b.vercel.app/api/homework/${selectedHomework._id}`, {
        description: editDescription,
        dueDate: editDueDate,
        subject: editSubject,
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Homework updated successfully!");
          fetchTeacherHomeworks();
          closeModal();
        } else {
          toast.error(res.data.message || "Failed to update homework");
        }
      })
      .catch((error) => {
        console.error("Error updating homework:", error);
        toast.error("Error updating homework");
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    axios
      .delete(`https://d2-c-b.vercel.app/api/homework/${selectedHomework._id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success("Homework deleted successfully!");
          fetchTeacherHomeworks();
          closeModal();
        } else {
          toast.error(res.data.message || "Failed to delete homework");
        }
      })
      .catch((error) => {
        console.error("Error deleting homework:", error);
        toast.error("Error deleting homework");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Homework List</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-homework")}
        >
          Add New Homework
        </button>
      </div>

      <div className="mb-8 text-gray-600">
        {fetchingHomeworks ? (
          <div className="flex justify-center my-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : homeworks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-gray-700">
                  <th>Class-Section</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Due Date</th>
                  <th>Action</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {homeworks.map((homework) => (
                  <tr
                    key={homework._id}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td>{`${
                      homework.className
                    }-${homework.section.toUpperCase()}`}</td>
                    <td>{homework.subject}</td>
                    <td>{homework.description}</td>
                    <td>{new Date(homework.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(homework.dueDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-xl"
                        onClick={(e) => openModal(e, homework)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button
                        className="text-green-600 hover:text-green-800 text-xl"
                        onClick={(e) => shareOnWhatsApp(e, homework)}
                      >
                        <FaWhatsapp />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No homeworks assigned yet.</p>
        )}
      </div>

      {/* Modal for editing/deleting homework */}
      {isModalOpen && selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Homework for{" "}
              {`${
                selectedHomework.className
              }-${selectedHomework.section.toUpperCase()}`}
            </h3>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {assignedSubjects?.map((sub) => (
                  <option key={sub._id} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Due Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                min={today}
              />
            </div>
            <div className="flex justify-between">
              {/* <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Delete"
                )}
              </button> */}

              <button
                className="btn btn-ghost mr-2"
                onClick={closeModal}
                disabled={isEditing || isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdate}
                disabled={isEditing}
              >
                {isEditing ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homework;
