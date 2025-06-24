import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AssignWork = () => {
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [workType, setWorkType] = useState("");
  const [projectedDate, setProjectedDate] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const navigate = useNavigate();
  const coordinatorName = localStorage.getItem("name");
  const coordinatorId = localStorage.getItem("id");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://d2-c-b.vercel.app/api/user/teacher"
      );
      if (response.data.success) {
        const teachersOnly = response.data.data.filter(
          (user) => user.role === "Teacher"
        );
        setTeachers(teachersOnly);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    // No need to fetch classes separately as they come with teacher data
    setClasses([]); // We'll populate this from selected teacher
  };

  const handleTeacherChange = (e) => {
    const selectedTeacher = teachers.find(
      (teacher) => teacher._id === e.target.value
    );
    if (selectedTeacher) {
      setTeacherId(selectedTeacher._id);
      setTeacherName(selectedTeacher.name);
      setClasses(selectedTeacher.assignedClasses || []);
      setSubjects(selectedTeacher.assignedSubjects || []);
      setClassName("");
      setSection("");
      setSubject("");
      setSections([]);
    }
  };

  useEffect(() => {
    console.log("Classes state updated:", classes);
  }, [classes]);

  const handleClassChange = (e) => {
    const selectedClass = classes.find((cls) => cls.value === e.target.value);
    setClassName(e.target.value);
    if (selectedClass && selectedClass.sections) {
      setSections(selectedClass.sections);
      setSection("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !teacherId ||
      !className ||
      !section ||
      !subject ||
      !workType ||
      !projectedDate
    ) {
      toast.error("Please fill all the fields!");
      return;
    }

    setLoading(true);

    const workData = {
      teacherId,
      teacherName,
      class: className,
      section,
      subject,
      assignedWorkType: workType,
      projectedDate,
      coordinatorName,
      coordinatorId,
      assignedDate: today,
      status: "assigned",
    };

    try {
      const response = await axios.post(
        "https://d2-c-b.vercel.app/api/coordinator-assignment/",
        workData
      );
      if (response.data.success) {
       
        toast.success("Work assigned successfully!");
       setTimeout(() => {
    navigate("/work-list");
  }, 700); // 1.5 seconds is usually enough
        // Reset form
        setTeacherId("");
        setTeacherName("");
        setClassName("");
        setSection("");
        setWorkType("");
        setProjectedDate("");
        setSubject("");
        setSubjects([]);
      } else {
        toast.error(response.data.message || "Failed to assign work");
      }
    } catch (error) {
      console.error("Error assigning work:", error);
      toast.error("Error assigning work");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Work to Teacher</h1>
        <div>
          {/* <button
            className="btn btn-outline mr-2"
            onClick={() => navigate("/work-list")}
          >
            All Lists
          </button> */}
          <button className="btn btn-outline" onClick={() => navigate("/work-list")}>
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Teacher Name</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={teacherId}
              onChange={handleTeacherChange}
              required
              disabled={loading || teachers.length === 0}
            >
              <option value="" disabled>
                {loading
                  ? "Loading teachers..."
                  : teachers.length === 0
                  ? "No teachers found"
                  : "Select Teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Class</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={className}
              onChange={handleClassChange}
              required
              disabled={!teacherId || classes.length === 0}
            >
              <option value="" disabled>
                {teacherId
                  ? `Select Class (${classes.length} available)`
                  : "Select Teacher First"}
              </option>
              {teacherId &&
                classes.length > 0 &&
                classes.map((cls) => (
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
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              disabled={!className || sections.length === 0}
            >
              <option value="" disabled>
                {className
                  ? `Select Section (${sections.length} available)`
                  : "Select Class First"}
              </option>
              {className &&
                sections.length > 0 &&
                sections.map((sec) => (
                  <option key={sec._id} value={sec.value}>
                    {sec.label}
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
              disabled={!teacherId || subjects.length === 0}
            >
              <option value="" disabled>
                {teacherId
                  ? `Select Subject (${subjects.length} available)`
                  : "Select Teacher First"}
              </option>
              {teacherId &&
                subjects.length > 0 &&
                subjects.map((sub) => (
                  <option key={sub._id} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Type of Assigned Work</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Work Type
              </option>
              <option value="book">Book</option>
              <option value="copy">Copy</option>
              <option value="file">File</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Projected Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={projectedDate}
              onChange={(e) => setProjectedDate(e.target.value)}
              min={today}
              required
            />
          </div>
        </div>

        <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Submit"
        )}
      </button>
        </div>
      </form>
    </div>
  );
};

export default AssignWork;
