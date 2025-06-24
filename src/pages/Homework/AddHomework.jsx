import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddHomework = () => {
  const [loading, setLoading] = useState(false);
  const [activeClass, setActiveClass] = useState("");
  const [activeDivision, setActiveDivision] = useState("");
  const [subject, setSubject] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const uid = localStorage.getItem("id");

  const assignedClasses = JSON.parse(localStorage.getItem("assignedClasses"));
  const assignedSubjects = JSON.parse(localStorage.getItem("assignedSubjects"));

  // Get current date for default due date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  useEffect(() => {
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tYear = tomorrow.getFullYear();
    const tMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const tDay = String(tomorrow.getDate()).padStart(2, "0");
    setDueDate(`${tYear}-${tMonth}-${tDay}`);

    // Set default class if available
    if (assignedClasses && assignedClasses.length > 0) {
      setActiveClass(assignedClasses[0].value);
      // Remove the automatic section setting
    }

    // Set default subject if available
    if (assignedSubjects && assignedSubjects.length > 0) {
      setSubject(assignedSubjects[0].value);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !activeClass ||
      !activeDivision ||
      !subject ||
      !homeworkText ||
      !dueDate
    ) {
      toast.error("Please fill all the fields!");
      return;
    }

    setLoading(true);

    const homeworkData = {
      description: homeworkText,
      className: activeClass,
      section: activeDivision,
      subject: subject,
      dueDate: dueDate,
      teacherId: uid,
      teacherName: name,
    };

    axios
      .post("https://d2-c-b.vercel.app/api/homework", homeworkData)
      .then((res) => {
        if (res.data.success) {
          toast.success("Homework assigned successfully!");
          setHomeworkText("");
          // Navigate back to homework list after a short delay
          setTimeout(() => {
            navigate("/homework");
          }, 1500);
        } else {
          toast.error(res.data.message || "Failed to assign homework");
        }
      })
      .catch((error) => {
        console.error("Error assigning homework:", error);
        toast.error("Error assigning homework");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Homework</h1>
        <button
          className="btn btn-outline"
          onClick={() => navigate("/homework")}
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Class</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={activeClass}
              onChange={(e) => {
                setActiveClass(e.target.value);
                setActiveDivision("");
              }}
              required
            >
              <option value="" disabled>
                Select Class
              </option>
              {assignedClasses?.map((cls) => (
                <option key={cls._id} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Section</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={activeDivision}
              onChange={(e) => setActiveDivision(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Section
              </option>
              {assignedClasses
                ?.find((cls) => cls.value === activeClass)
                ?.sections?.map((section) => (
                  <option key={section._id} value={section.value}>
                    {section.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Subject</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Submission Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Homework Details</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32"
            placeholder="Enter homework details here..."
            value={homeworkText}
            onChange={(e) => setHomeworkText(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Assign Homework"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHomework;
