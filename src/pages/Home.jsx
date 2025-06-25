import studentsGif from "../assets/students.gif";
import { useNavigate } from "react-router-dom";
import adminGif from "../assets/admin.gif";
import teacherGif from "../assets/teachers.gif";
import axios from "axios";
import { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import usePendingAssignments from "../hooks/usePendingAssignments";

// import staffsGif from "../assets/staffs.gif";
// import dashboardGif from "../assets/dashboard.gif";
// import attendanceGif from "../assets/attendanceGif.gif";
// import timetableGif from "../assets/timeTableGif.gif";
// import feesGif from "../assets/feesGif.gif";
const Home = () => {
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [count, setCount] = useState(null);

  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
  const day = String(currentDate.getDate()).padStart(2, "0");
  const getDate = `${year}-${month}-${day}`;

  const [remarkDate, setRemarkDate] = useState(getDate);
  const [remarkData, setRemarkData] = useState(null);
  const [remarkDataAll, setRemarkDataAll] = useState(null);
  const [remarkDataByAdmin, setRemarkDataByAdmin] = useState(null);
  const [userRoleData, setUserRoleData] = useState(null);
  const [roleForRemark, setRoleForRemark] = useState("");
  const [remarkComment, setRemarkComment] = useState("");
  const [teacherNameForRemark, setTeacherNameForRemark] = useState("");
  const [teacherIdForRemark, setTeacherIdForRemark] = useState("");
  const [counts, setCounts] = useState("");
  const { pendingCount, refreshCount } = usePendingAssignments();
  const [showTooltip, setShowTooltip] = useState(false);
  const [workAssignments, setWorkAssignments] = useState([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [remarksSent, setRemarksSent] = useState(null);
  const [sentRemarksDate, setSentRemarksDate] = useState(getDate);

  const getCount = () => {
    setLoading(true);
    try {
      axios
        .get(`https://d2-c-b.vercel.app/api/home?role=${role}`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setCount(res.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchRemarksSent = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/remark/by?remarkById=${uid}&remarkDate=${sentRemarksDate}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarksSent(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setRemarksSent(null);
        });
    } catch (error) {
      console.log(error);
      setRemarksSent(null);
      setLoading(false);
    }
  };

  const fetchStudents = () => {
    try {
      axios
        .get("https://d2-c-b.vercel.app/api/student/all")
        .then((res) => {
          if (res.data.success) {
            setCounts(res.data.count); // adjust if response structure differs
          }
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
          setCounts(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  const fetchRemark = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/remark?remarkToId=${uid}&remarkDate=${remarkDate}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarkData(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setRemarkData(null);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchCoRemark = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/remark/by?remarkById=${uid}&remarkDate=${remarkDate}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarkData(res.data.data);
            console.log(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setRemarkData(null);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchCoRemarkByAdmin = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/remark?remarkToId=${uid}&remarkDate=${remarkDate}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarkDataByAdmin(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setRemarkDataByAdmin(null);
    }
  };

  const fetchAdminRemark = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/remark?remarkToId=${uid}&remarkDate=${remarkDate}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarkData(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setRemarkData(null);
        });
    } catch (error) {
      console.log(error);
      setRemarkData(null);
      setLoading(false);
    }
  };

  const fetchAllRemark = () => {
    try {
      axios
        .get(`https://d2-c-b.vercel.app/api/remark/${uid}`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setRemarkDataAll(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setRemarkDataAll(null);
        });
    } catch (error) {
      console.log(error);
      setRemarkDataAll(null);
      setLoading(false);
    }
  };
  const updateRemark = (data, status) => {
    try {
      axios
        .put(`https://d2-c-b.vercel.app/api/remark/${data._id}`, {
          ...data,
          isChecked: status == "approve" ? true : false,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            toast.success("Remark Updated Successfully !");
            if (role == "Admin") {
              fetchAdminRemark();
            }
            if (role == "Teacher") {
              fetchRemark();
            }
            if (
              role === "Senior Coordinator" ||
              role === "Junior Coordinator"
            ) {
              fetchCoRemark();
              fetchCoRemarkByAdmin();
            }

            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (role == "Teacher") {
      fetchRemark();
    }
    if (role == "Senior Coordinator") {
      fetchCoRemark();
      fetchCoRemarkByAdmin();
    }
    if (role == "Junior Coordinator") {
      fetchCoRemark();
      fetchCoRemarkByAdmin();
    }
    if (role == "Admin") {
      fetchAdminRemark();
      fetchWorkAssignments();
    }
    fetchAllRemark();
    fetchRemarksSent();
    getCount();
  }, [remarkDate, sentRemarksDate]);

  const fetchListingByRole = () => {
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/user/list-role?role=${roleForRemark}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setUserRoleData(res.data.data);
            setLoading(false);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          setUserRoleData(null);
        });
    } catch (error) {
      console.log(error);
      setUserRoleData(null);
      setLoading(false);
    }
  };

  const fetchWorkAssignments = async () => {
    if (role === "Admin") {
      setWorkLoading(true);
      try {
        const response = await axios.get(
          "https://d2-c-b.vercel.app/api/coordinator-assignment/all"
        );
        if (response.data.success) {
          setWorkAssignments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching work assignments:", error);
      } finally {
        setWorkLoading(false);
      }
    }
  };

  useEffect(() => {
    if (roleForRemark) {
      fetchListingByRole();
    }
  }, [roleForRemark]);
  const handleTeacherByClass = (e) => {
    setTeacherNameForRemark(e.target.selectedOptions[0].text);
    setTeacherIdForRemark(e.target.value);
  };
  const handleRemarkSend = () => {
    if (!teacherNameForRemark || !teacherIdForRemark) {
      toast.error("Please select a user");
      return;
    }
    let data = {
      remarkBy: name,
      remarkById: uid,
      remarkByRole: role,
      remarkTo: teacherNameForRemark,
      remarkToRole: roleForRemark,
      remarkToId: teacherIdForRemark,
      isChecked: false,
      remarkComment: remarkComment,
      remarkDate: getDate,
    };
    console.log(data);

    try {
      axios
        .post(`https://d2-c-b.vercel.app/api/remark`, data)
        .then((res) => {
          console.log(res.data.data);
          if (res.data.success) {
            toast.success("Remark sent successfully !", { id: "Errorr" });
            setRemarkComment("");
            setTeacherNameForRemark("");
            setTeacherIdForRemark("");
            setRoleForRemark("");
            fetchRemarksSent();
            fetchAdminRemark();
          }
        })
        .finally(() => {})
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message, { id: "Errorr" });
        });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { id: "Errorr" });
    }
  };
  // https://d2-c-portal-backend-master.vercel.app
  return (
    <>
      <Toaster />
      <div className="relative">
        <div className="flex justify-center mt-8 mb-8 mr-8">
          <p className="text-3xl font-semibold uppercase">
            Dust To Crown Public School
          </p>
        </div>

        {/* Notification for Teachers */}
        {role === "Teacher" && pendingCount > 0 && (
          <div className="fixed top-4 right-4 z-50">
            <div className="relative">
              <div
                className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6m2 13V7a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2h-3"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              </div>

              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                  You have {pendingCount} assignments left
                  <button
                    className="ml-2 text-blue-300 underline"
                    onClick={() => navigate("/update-work")}
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!loading ? (
        <>
          <div className="grid md:grid-cols-3 gap-4 content-center">
            {role == "Admin" ? (
              <>
                {" "}
                <div
                  onClick={() => navigate("/manage-admins")}
                  className="hover:border shadow cursor-pointer w-fit  py-4 px-6"
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src={adminGif} alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Total Admins
                        <div className="badge badge-secondary">
                          {count?.admins}
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button className="btn">Go to Admin&apos;s panel</button>
                  </div>
                </div>{" "}
                <div
                  onClick={() => navigate("/manage-teacher")}
                  className=" shadow cursor-pointer w-fit  px-6 py-4"
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src={teacherGif} alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Total Teachers
                        <div className="badge badge-secondary">
                          {count?.teachers}
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button className="btn">Go to Teacher&apos;s panel</button>
                  </div>
                </div>{" "}
                <div
                  className="hover:border shadow cursor-pointer w-fit  px-6 py-4"
                  onClick={() => navigate("/manage-students")}
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src={studentsGif} alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Total Students
                        <div className="badge badge-secondary">
                          {count?.students}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button className="btn">Go to Student&apos;s panel</button>
                  </div>
                </div>{" "}
                <div
                  className="hover:border shadow cursor-pointer w-fit  px-6 py-4"
                  onClick={() => navigate("/manage-coordinator")}
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src="/coordinator.gif" alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Total Coordinator
                        <div className="badge badge-secondary">
                          {count?.coordinators}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button className="btn">
                      Go to Coordinator&apos;s panel
                    </button>
                  </div>
                </div>{" "}
                <div
                  className="hover:border shadow cursor-pointer w-fit  px-6 py-4"
                  onClick={() => navigate("/display-attendence")}
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src="/Teacher.gif" alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Teacher Attendance
                        <div className="badge badge-secondary">
                          {count?.teachers}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button className="btn">Go to Teacher&apos;s panel</button>
                  </div>
                </div>{" "}
                <div
                  className="hover:border shadow cursor-pointer w-fit  px-6 py-4"
                  onClick={() => navigate("/stu-attendence-view")}
                >
                  <div className="flex items-center gap-8 ">
                    <div>
                      <img width={150} src="/Student.gif" alt="adminGif" />
                    </div>
                    <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Student Attendance
                        <div className="badge badge-secondary">
                          {count?.students}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button className="btn">
                      Go to Student's&apos;s Attendence
                    </button>
                  </div>
                </div>
              </>
            ) : role == "Teacher" ? (
              <>
                {/* <div>
                  <div
                    className="hover:border shadow w-fit  px-6 py-4"
                    onClick={() => navigate("/manage-students")}
                  >
                    <div className="flex items-center gap-8 ">
                      <div>
                        <img width={150} src={studentsGif} alt="adminGif" />
                      </div>
                      <div>
                      <button className="flex items-center gap-4 font-semibold">
                        Total Students
                        <div className="badge badge-secondary">
                          {counts}
                        </div>
                      </button>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                <button className="btn">Go to Student&apos;s panel</button>
              </div>
                  </div>
                </div> */}
              </>
            ) : (
              ""
            )}
          </div>
          {/* {role == "Teacher" && (
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
              <div className="p-1 flex items-center gap-3">
                <label htmlFor="">Select Date</label>
                <input
                  type="date"
                  onChange={(e) => setRemarkDate(e.target.value)}
                  className="input input-secondary"
                  value={remarkDate}
                />
              </div>
              <table className="w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Remark</th>
                    <th className="py-3 px-6">Remark By</th>
                    <th className="py-3 px-6">Administration</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {remarkData &&
                    remarkData?.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.remarkTo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.remarkComment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.remarkBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.remarkByRole}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.isChecked ? (
                            <span className="badge badge-success badge-md text-white">
                              Acknowledged
                            </span>
                          ) : (
                            <span className="badge badge-error text-white">
                              Not-Acknowledged
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => updateRemark(item, "approve")}
                            className="btn btn-outline btn-xs"
                            disabled={item.isChecked}
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => updateRemark(item, "reject")}
                            className="btn btn-warning ml-2 btn-xs text-white"
                            disabled={item.isChecked}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )} */}
          {(role === "Senior Coordinator" || role === "Junior Coordinator") && (
            <>
              {/* <div>
                <p className="text-2xl font-semibold">
                  {role === "Senior Coordinator"
                    ? "Remarks Given To Teachers & Junior Coordinators"
                    : "Remarks Given To Teachers"}
                </p>
              </div>
              <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
                <div className="p-1 flex items-center gap-3">
                  <label htmlFor="">Select Date</label>
                  <input
                    type="date"
                    onChange={(e) => setRemarkDate(e.target.value)}
                    className="input input-secondary"
                    value={remarkDate}
                  />
                </div>
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Remark</th>
                      <th className="py-3 px-6">Remark To</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {remarkData &&
                      remarkData
                        .filter((item) => item.remarkBy === name) // or currentUser._id
                        .map((item, idx) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.remarkBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.remarkComment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.remarkTo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.isChecked ? (
                                <span className="badge badge-success badge-md text-white">
                                  Acknowledged
                                </span>
                              ) : (
                                <span className="badge badge-error text-white">
                                  Not-Acknowledged
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => updateRemark(item, "approve")}
                                className="btn btn-outline btn-xs"
                                disabled={item.isChecked}
                              >
                                Acknowledge
                              </button>
                              <button
                                onClick={() => updateRemark(item, "reject")}
                                className="btn btn-warning ml-2 btn-xs text-white"
                                disabled={item.isChecked}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div> */}

              {/* <div className="mt-12">
                <p className="text-2xl font-semibold">
                  {role === "Junior Coordinator"
                    ? "Remarks Received"
                    : "Remarks Received"}
                </p>
              </div>

              <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
                <div className="p-1 flex items-center gap-3">
                  <label htmlFor="">Select Date</label>
                  <input
                    type="date"
                    onChange={(e) => setRemarkDate(e.target.value)}
                    className="input input-secondary"
                    value={remarkDate}
                  />
                </div>
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Remark</th>
                      <th className="py-3 px-6">Remark To</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {remarkDataByAdmin &&
                      remarkDataByAdmin?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkComment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.isChecked ? (
                              <span className="badge badge-success badge-md text-white">
                                Acknowledged
                              </span>
                            ) : (
                              <span className="badge badge-error text-white">
                                Not-Acknowledged
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => updateRemark(item, "approve")}
                              className="btn btn-outline btn-xs"
                              disabled={item.isChecked}
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => updateRemark(item, "reject")}
                              className="btn btn-warning ml-2 btn-xs text-white"
                              disabled={item.isChecked}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div> */}

              {/* New Section: Send Remark for Coordinators */}
              {/* <div className="mt-12">
                <p className="text-2xl font-semibold">Send Remark</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="form-control mt-5">
                    <label htmlFor="">Select Role</label>
                    <select
                      onChange={(e) => setRoleForRemark(e.target.value)}
                      className="select select-bordered border-gray-300"
                    >
                      <option value="" selected disabled>
                        Select Role
                      </option>
                      <option value="Teacher">Teacher</option>
                      {role === "Senior Coordinator" && (
                        <option value="Junior Coordinator">
                          Junior Coordinator
                        </option>
                      )}
                    </select>
                  </div>

                  {roleForRemark && (
                    <div className="form-control mt-5">
                      <label htmlFor="">Select Teacher</label>
                      <select
                        onChange={handleTeacherByClass}
                        className="select select-bordered border-gray-300"
                      >
                        <option value="" selected disabled>
                          Select Teacher
                        </option>
                        {userRoleData?.map((res) => (
                          <option value={res._id} key={res._id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {roleForRemark && (
                    <>
                      <div className="form-control mt-5">
                        <label htmlFor="">Remark For {roleForRemark}</label>
                        <textarea
                          className="textarea textarea-bordered"
                          cols="30"
                          placeholder="Enter remark"
                          rows="1"
                          onChange={(e) => setRemarkComment(e.target.value)}
                          value={remarkComment}
                        ></textarea>
                      </div>
                      <div className="form-control relative top-5 mt-6">
                        <button
                          className="btn btn-outline"
                          onClick={() => handleRemarkSend()}
                          disabled={!teacherIdForRemark || !remarkComment}
                        >
                          Send Remark
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div> */}
            </>
          )}
          <div className="mt-12">
            <p className="text-2xl font-semibold">Send Remark</p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="form-control mt-5">
                <label htmlFor="">Select Role</label>
                <select
                  onChange={(e) => setRoleForRemark(e.target.value)}
                  className="select select-bordered border-gray-300"
                  value={roleForRemark}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {[
                    "Admin",
                    "Teacher",
                    "Senior Coordinator",
                    "Junior Coordinator",
                  ]
                    .filter((r) => r !== role)
                    .map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                </select>
              </div>
              {roleForRemark && (
                <div className="form-control mt-5">
                  <label htmlFor="">Select User</label>
                  <select
                    onChange={handleTeacherByClass}
                    className="select select-bordered border-gray-300"
                    value={teacherIdForRemark}
                  >
                    <option value="" disabled>
                      Select User
                    </option>
                    {userRoleData?.map((res) => (
                      <option value={res._id} key={res._id}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {roleForRemark && (
                <>
                  <div className="form-control mt-5">
                    <label htmlFor="">Remark For {roleForRemark}</label>
                    <textarea
                      className="textarea textarea-bordered"
                      cols="30"
                      placeholder="Remark"
                      rows="1"
                      onChange={(e) => setRemarkComment(e.target.value)}
                      value={remarkComment}
                    ></textarea>
                  </div>
                  <div className="form-control relative top-5 mt-6 ">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleRemarkSend()}
                      disabled={!remarkComment}
                    >
                      Send Remark
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
            <div className="px-4 py-2 font-semibold text-xl">Remarks Sent</div>
            <div className="px-4 py-2 flex items-center gap-3">
              <label htmlFor="">Select Date</label>
              <input
                type="date"
                onChange={(e) => setSentRemarksDate(e.target.value)}
                className="input input-bordered"
                value={sentRemarksDate}
              />
            </div>
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6">Remark To</th>
                  <th className="py-3 px-6">Remark</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {remarksSent &&
                  remarksSent?.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkComment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkToRole}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isChecked ? (
                          <span className="badge badge-success badge-md text-white">
                            Acknowledged
                          </span>
                        ) : (
                          <span className="badge badge-error text-white">
                            Not-Acknowledged
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
            <div className="px-4 py-2 font-semibold text-xl">
              Remarks Received
            </div>
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Remark</th>
                  <th className="py-3 px-6">Remark By</th>
                  <th className="py-3 px-6">Administration</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {(role === "Senior Coordinator" || role === "Junior Coordinator"
                  ? remarkDataByAdmin
                  : remarkData) &&
                  (role === "Senior Coordinator" ||
                  role === "Junior Coordinator"
                    ? remarkDataByAdmin
                    : remarkData
                  )?.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkComment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkByRole}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.remarkDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isChecked ? (
                          <span className="badge badge-success badge-md text-white">
                            Acknowledged
                          </span>
                        ) : (
                          <span className="badge badge-error text-white">
                            Not-Acknowledged
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => updateRemark(item, "approve")}
                          className="btn btn-outline btn-xs"
                          disabled={item.isChecked}
                        >
                          Acknowledge
                        </button>
                        {/* <button
                          onClick={() => updateRemark(item, "reject")}
                          className="btn btn-warning ml-2 btn-xs text-white"
                          disabled={item.isChecked}
                        >
                          Reject
                        </button> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* <div className="mt-12">
            <p className="text-2xl font-semibold">Send Remark</p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="form-control mt-5">
                <label htmlFor="">Select Role</label>
                <select
                  onChange={(e) => setRoleForRemark(e.target.value)}
                  className="select select-bordered border-gray-300"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {/* Show all other roles except the current user's own role *
                  {[
                    "Admin",
                    "Teacher",
                    "Senior Coordinator",
                    "Junior Coordinator",
                  ]
                    .filter((r) => r !== role)
                    .map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                </select>
              </div>
              {roleForRemark && (
                <div className="form-control mt-5">
                  <label htmlFor="">Select User</label>
                  <select
                    onChange={handleTeacherByClass}
                    className="select select-bordered border-gray-300"
                  >
                    <option value="" selected disabled>
                      Select User
                    </option>
                    {userRoleData?.map((res) => (
                      <option value={res._id} key={res._id}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {roleForRemark && (
                <>
                  {" "}
                  <div className="form-control mt-5">
                    <label htmlFor="">Remark For {roleForRemark}</label>
                    <textarea
                      className=" textarea textarea-bordered"
                      cols="30"
                      placeholder="Remark"
                      rows="1"
                      onChange={(e) => setRemarkComment(e.target.value)}
                      value={remarkComment}
                    ></textarea>
                  </div>
                  <div className="form-control relative top-5 mt-6 ">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleRemarkSend()}
                      disabled={!teacherIdForRemark || !remarkComment}
                    >
                      Send Remark
                    </button>
                  </div>
                </>
              )}
            </div>
          </div> */}
          {role == "Admin" && (
            <>
              {/* <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
                <div className="p-1 flex items-center gap-3">
                  <label htmlFor="">Select Date</label>
                  <input
                    type="date"
                    onChange={(e) => setRemarkDate(e.target.value)}
                    className="input input-secondary"
                    value={remarkDate}
                  />
                </div>
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-3 px-6">Remark To</th>
                      <th className="py-3 px-6">Remark</th>
                      <th className="py-3 px-6">Remark By</th>

                      <th className="py-3 px-6">Administration</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {remarkData &&
                      remarkData?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkTo} ({item.remarkToRole})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkComment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkBy} ({item.remarkByRole})
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkByRole}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.isChecked ? (
                              <span className="badge badge-success badge-md text-white">
                                Acknowledged
                              </span>
                            ) : (
                              <span className="badge badge-error text-white">
                                Not-Acknowledged
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => updateRemark(item, "approve")}
                              className="btn btn-outline btn-xs"
                              disabled={item.isChecked}
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => updateRemark(item, "reject")}
                              className="btn btn-warning ml-2 btn-xs text-white"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div> */}

              <></>
              {/* Work Assignments Section for Admin */}
              <div className="mt-12">
                <p className="text-2xl font-semibold">All Work Assignments</p>
              </div>
              <div className="mt-4 shadow-sm border rounded-lg overflow-x-auto w-full">
                {workLoading ? (
                  <div className="flex justify-center p-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Teacher</th>
                        <th className="py-3 px-6">Class</th>
                        <th className="py-3 px-6">Section</th>
                        <th className="py-3 px-6">Subject</th>
                        <th className="py-3 px-6">Work Type</th>
                        <th className="py-3 px-6">Projected Date</th>
                        <th className="py-3 px-6">Actual Date</th>
                        <th className="py-3 px-6">Coordinator</th>
                        <th className="py-3 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {workAssignments.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-8">
                            No work assignments found.
                          </td>
                        </tr>
                      ) : (
                        workAssignments.map((assignment) => (
                          <tr key={assignment._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.teacherName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.class}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.section}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.subject || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize">
                              {assignment.assignedWorkType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(
                                assignment.projectedDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.actualSubmissionDate
                                ? new Date(
                                    assignment.actualSubmissionDate
                                  ).toLocaleDateString()
                                : "Not submitted"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignment.coordinatorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`badge ${
                                  assignment.actualSubmissionDate
                                    ? "badge-success"
                                    : "badge-warning"
                                } text-white`}
                              >
                                {assignment.actualSubmissionDate
                                  ? "Completed"
                                  : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
          {(role === "Teacher" ||
            role === "Senior Coordinator" ||
            role === "Junior Coordinator") && (
            <>
              {/* <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto w-full">
                <div className="px-4 py-2 font-semibold text-xl">
                  All Remarks
                </div>{" "}
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-3 px-6">Remark Date</th>
                      <th className="py-3 px-6">Remark To</th>
                      <th className="py-3 px-6">Remark</th>
                      <th className="py-3 px-6">Remark By</th>

                      <th className="py-3 px-6">Administration</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {remarkDataAll &&
                      remarkDataAll?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkTo} ({item.remarkToRole})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkComment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkBy} ({item.remarkByRole})
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.remarkByRole}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.isChecked ? (
                              <span className="badge badge-success badge-md text-white">
                                Acknowledged
                              </span>
                            ) : (
                              <span className="badge badge-error text-white">
                                Not-Acknowledged
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => updateRemark(item, "approve")}
                              className="btn btn-outline btn-xs"
                              disabled={item.isChecked}
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => updateRemark(item, "reject")}
                              className="btn btn-warning ml-2 btn-xs text-white"
                              disabled={item.isChecked}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div> */}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-center m-auto mt-12">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
