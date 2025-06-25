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
  const [activeTab, setActiveTab] = useState("");
  const [selectedDates, setSelectedDates] = useState({});
  const [filteredHomeworks, setFilteredHomeworks] = useState({});
  const [activeClass, setActiveClass] = useState("");
  const [activeSection, setActiveSection] = useState("");

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

  useEffect(() => {
    const filtered = {};
    Object.keys(groupedHomeworks).forEach((classSection) => {
      const selectedDate = selectedDates[classSection];
      if (selectedDate) {
        const homeworksForDate = groupedHomeworks[classSection].filter(
          (homework) => {
            const homeworkDate = new Date(homework.createdAt)
              .toISOString()
              .split("T")[0];
            return homeworkDate === selectedDate;
          }
        );
        filtered[classSection] = homeworksForDate;
      } else {
        filtered[classSection] = groupedHomeworks[classSection];
      }
    });
    setFilteredHomeworks(filtered);
  }, [selectedDates, homeworks]);

  const fetchTeacherHomeworks = () => {
    setFetchingHomeworks(true);
    axios
      .get(`https://d2-c-b.vercel.app/api/homework/teacher/${uid}`)
      .then((res) => {
        if (res.data.success) {
          setHomeworks(res.data.data || []);
          //Set first tab as active
          if (res.data.data && res.data.data.length > 0) {
            const firstClass = `${res.data.data[0].className}-${res.data.data[0].section}`;
            setActiveTab(firstClass);
          }
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

  // Group homeworks by class-section
  const groupedHomeworks = homeworks.reduce((acc, homework) => {
    const key = `${homework.className}-${homework.section}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(homework);
    return acc;
  }, {});

  // Sort class sections in the desired order
  const sortClassSections = (classSections) => {
    return classSections.sort((a, b) => {
      const [classA, sectionA] = a.toLowerCase().split("-");
      const [classB, sectionB] = b.toLowerCase().split("-");

      // Define order: nursery -> lkg -> ukg -> numeric classes
      const getClassOrder = (className) => {
        if (className === "nursery") return 0;
        if (className === "l.k.g") return 1;
        if (className === "u.k.g") return 2;
        if (!isNaN(className)) return 3 + parseInt(className);
        return 999; // other classes at the end
      };

      const orderA = getClassOrder(classA);
      const orderB = getClassOrder(classB);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Same class type, sort by section
      return sectionA.localeCompare(sectionB);
    });
  };

  const sortedClassSections = sortClassSections(Object.keys(filteredHomeworks));

  const handleShareClass = (classSection) => {
    const allHomeworksForClass = groupedHomeworks[classSection] || [];
    const todaysHomeworks = allHomeworksForClass.filter((homework) => {
      const homeworkDate = new Date(homework.createdAt)
        .toISOString()
        .split("T")[0];
      return homeworkDate === today;
    });

    if (todaysHomeworks.length === 0) {
      toast.error("No homework assigned for today");
      return;
    }
    const [className, section] = classSection.split("-");
    let message = `*Homework for Class ${className.toUpperCase()}-${section.toUpperCase()}*\n`;
    message += `*Date: ${new Date().toLocaleDateString()}*\n\n`;

    // if (todaysHomeworks.length > 0) {
    //   message += `*Date: ${new Date().toLocaleDateString()}*\n\n`;
    // } else {
    //   message += `\n`;
    // }

    todaysHomeworks.forEach((homework, index) => {
      message += `*${index + 1}. ${homework.subject}*\n`;
      message += `${homework.description}\n\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  // const shareOnWhatsApp = (e, homework) => {
  //   e.stopPropagation(); // Prevent row click

  //   const message =
  //     `*Homework for Class ${
  //       homework.className
  //     }-${homework.section.toUpperCase()}*\n\n` +
  //     `*Subject:* ${homework.subject}\n` +
  //     `*Description:* ${homework.description}\n` +
  //     `*Due Date:* ${new Date(homework.dueDate).toLocaleDateString()}\n` +
  //     `*Teacher:* ${homework.teacherName}`;

  //   const encodedMessage = encodeURIComponent(message);
  //   window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  // };

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
    <>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Homework Management
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-homework")}
        >
          Add New Homework
        </button>
      </div>

      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        {/* Class Selection Buttons */}
        <div className="mb-4 p-4">
          <div className="font-semibold mb-2">Select Class</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              ...new Set(sortedClassSections.map((cs) => cs.split("-")[0])),
            ].map((className) => (
              <button
                key={className}
                className={`btn w-full text-base mb-2 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 ${
                  activeClass === className
                    ? "btn-primary !text-white font-bold border-2 border-blue-700 scale-105"
                    : "btn-outline"
                }`}
                onClick={() => {
                  setActiveClass(className);
                  setActiveSection("");
                  setActiveTab("");
                }}
                title={className.toUpperCase()}
                tabIndex={0}
              >
                {/* <span className="mr-2" role="img" aria-label="class">
                  📚
                </span> */}
                {className.toUpperCase()}
              </button>
            ))}
          </div>

          {activeClass && (
            <>
              <div className="font-semibold mb-2 mt-4">Select Section</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  ...new Set(
                    sortedClassSections
                      .filter((cs) => cs.startsWith(activeClass))
                      .map((cs) => cs.split("-")[1])
                  ),
                ].map((section) => (
                  <button
                    key={section}
                    className={`btn w-full text-base mb-2 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 ${
                      activeSection === section
                        ? "btn-primary !text-white font-bold border-2 border-green-700 scale-105"
                        : "btn-outline"
                    }`}
                    onClick={() => {
                      setActiveSection(section);
                      setActiveTab(`${activeClass}-${section}`);
                    }}
                    title={`Section ${section.toUpperCase()}`}
                    tabIndex={0}
                  >
                    {section.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Show selected info */}
          {activeClass && activeSection && (
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold shadow">
                Selected: {activeClass.toUpperCase()} -&nbsp;
                {activeSection.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-semibold">
            {activeTab
              ? `Class ${activeTab.toUpperCase()} Homework`
              : "Homework"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filter by Date:</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={selectedDates[activeTab] || ""}
                onChange={(e) =>
                  setSelectedDates((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value,
                  }))
                }
              />
            </div>
            <button
              className="btn btn-success mt-8"
              onClick={() => handleShareClass(activeTab)}
              disabled={!activeTab}
            >
              Share Homework
            </button>
          </div>
        </div>

        {/* Mobile Card List */}
        <div className="block md:hidden px-4">
          {activeTab && filteredHomeworks[activeTab] ? (
            filteredHomeworks[activeTab].map((homework) => (
              <div
                key={homework._id}
                className="bg-white rounded-lg shadow p-4 mb-3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-bold text-base">{homework.subject}</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {homework.description}
                </div>
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  <span className="bg-gray-100 rounded px-2 py-1">
                    Created: {new Date(homework.createdAt).toLocaleDateString()}
                  </span>
                  <span className="bg-gray-100 rounded px-2 py-1">
                    Due: {new Date(homework.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="btn btn-xs btn-primary w-full mt-2"
                  onClick={(e) => openModal(e, homework)}
                >
                  Edit
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No homework found
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="table w-full">
            <thead className="text-black text-sm">
              <tr>
                <th>Subject</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Submission Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab && filteredHomeworks[activeTab] ? (
                filteredHomeworks[activeTab].map((homework) => (
                  <tr key={homework._id} className="hover:bg-gray-50">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No homework found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for editing homework */}
      {isModalOpen && selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Edit Homework for{" "}
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
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={closeModal}
                disabled={isEditing}
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
    </>
  );
};

export default Homework;
