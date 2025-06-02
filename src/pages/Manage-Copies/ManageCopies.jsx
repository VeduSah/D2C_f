import { useEffect, useRef, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import annyang from "annyang";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import Fuse from "fuse.js";

const ManageCopies = () => {
  const tableRef = useRef(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
  const day = String(currentDate.getDate()).padStart(2, "0");
  const getDate = `${year}-${month}-${day}`;

  console.log(getDate);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userData, setUserData] = useState([]);
  const [subject, setSubject] = useState("");
  const [copyCheckData, setCopyCheckData] = useState([]);

  const [remarkComment, setRemarkComment] = useState("");
  const [typeOf, setTypeOf] = useState("");
  const [activeClass, setActiveClass] = useState("");
  const [activeDivision, setActiveDivision] = useState("");
  const [teacherForClassSubjectDiv, setTeacherForClassSubjectDiv] =
    useState(null);

  const [teacherNameForRemark, setTeacherNameForRemark] = useState("");
  const [teacherIdForRemark, setTeacherIdForRemark] = useState("");
  const [date, setDate] = useState(getDate);
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const uid = localStorage.getItem("id");
  const [classOfTeacher, setClassOfTeacher] = useState(
    localStorage.getItem("class")
  );
  const [divisionOfTeacher, setDivisionOfTeacher] = useState(
    localStorage.getItem("section")
  );

  const assignedClasses = JSON.parse(localStorage.getItem("assignedClasses"));
  const assignedWings = JSON.parse(localStorage.getItem("assignedWings"));
  const assignedSubjects = JSON.parse(localStorage.getItem("assignedSubjects"));
  const assignedDivisions = JSON.parse(
    localStorage.getItem("assignedSections")
  );
  const assignUser = JSON.parse(localStorage.getItem('User'));
  console.log('Current user:', assignUser); // Verify user data structure
  // LIST
  // Define a function to merge copyRes with today's date for each student
  const mergeCopyResWithToday = (students) => {
    return students?.map((student) => ({
      ...student,
      date: date, // Merging getDate with each student's data
    }));
  };

  // Define a function to filter copyRes based on the selected subject and date
  const filterCopyResBySubjectAndDate = (students, subject, resCopy) => {
    return students?.map((student) => ({
      ...student,
      copyRes: resCopy?.filter(
        (copy) =>
          copy?.subject === subject &&
          copy?.date === date &&
          copy?.studentId === student._id &&
          copy?.submitType == typeOf
      ),
    }));
  };

  const fetchAllCopies = () => {
    setLoading(true);
    try {
      axios
        .get(
          `http://localhost:8000/api/copy-check/all?date=${date}`
        )
        .then((resCopy) => {
          console.log(resCopy.data.data);
          setCopyCheckData(resCopy.data.data)
          try {
            axios
              .get(
                `http://localhost:8000/api/student/filter-by-class?studentClass=${role == "Teacher" ? classOfTeacher : activeClass
                }&studentSection=${role == "Teacher" ? divisionOfTeacher : activeDivision
                }&page=${currentPage}`
              )
              .then((res) => {
                if (res.data.success) {
                  const studentsWithCopyRes = mergeCopyResWithToday(
                    res.data.data
                  );
                  const studentsFilteredBySubjectAndDate =
                    filterCopyResBySubjectAndDate(
                      studentsWithCopyRes,
                      subject,
                      resCopy.data.data
                    );
                  setUserData(studentsFilteredBySubjectAndDate);
                  setTotalPages(res.data.count);
                  setLoading(false);
                } else {
                  // Handle unsuccessful response from student filter API
                  console.error(
                    "Failed to fetch student data:",
                    res.data.message
                  );
                  toast.error(res.data.message);
                  setUserData(null);
                  setLoading(false);
                }
              })
              .catch((error) => {
                console.error("Error fetching student data:", error);
                toast.error("Error fetching student data");
                setUserData(null);
                setLoading(false);
              });
          } catch (error) {
            console.error("Error fetching student data:", error);
            toast.error("Error fetching student data");
            setUserData(null);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching copy check data:", error);
          toast.error("Error fetching copy check data");
          setUserData(null);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching copy check data:", error);
      toast.error("Error fetching copy check data");
      setUserData(null);
      setLoading(false);
    }
  };

  const fetchTeacherByClassSubjectSection = () => {
    if (activeClass && subject && activeDivision) {
      try {
        axios
          .get(
            `http://localhost:8000/api/user/list-teacher?className=${activeClass}&subject=${subject}&section=${activeDivision}`
          )
          .then((res) => {
            console.log(res.data.data);

            setTeacherForClassSubjectDiv(res.data.data);
          })
          .finally(() => { })
          .catch((error) => {
            console.log(error);
            setTeacherForClassSubjectDiv(null);
          });
      } catch (error) {
        console.log(error);
        setTeacherForClassSubjectDiv(null);
      }
    }
  };
  useEffect(() => {
    fetchAllCopies();
    fetchTeacherByClassSubjectSection();
  }, [subject, typeOf, activeClass, activeDivision, date]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const maxPage = Math.ceil(totalPages / 15);
    console.log(maxPage);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(i);
    }

    let startPage;
    let endPage;

    if (maxPage <= maxPagesToShow) {
      startPage = 1;
      endPage = maxPage;
    } else {
      if (currentPage <= maxPagesToShow - 2) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + 1 >= maxPage) {
        startPage = maxPage - maxPagesToShow + 1;
        endPage = maxPage;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 2;
      }
    }

    const visiblePages = pageNumbers.slice(startPage - 1, endPage);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === maxPage;

    return (
      <nav className="mt-12 flex justify-center">
        <ul className="join ">
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 cursor-pointer rounded-md  mx-1 ${isFirstPage ? "disabled" : ""
                }`}
              disabled={isFirstPage}
            >
              Previous
            </button>
          </li>
          {visiblePages?.map((number) => (
            <li key={number} className="page-item">
              <button
                onClick={() => handlePageChange(number)}
                className={`${currentPage === number ? "bg-gray-400 text-white" : ""
                  } px-4 py-2 mx-1 rounded-md`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 cursor-pointer mx-1 bg-black rounded-md text-white ${isLastPage ? "disabled" : ""
                }`}
              disabled={isLastPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

const handleCopySubmit = (data) => {
  if (!assignUser) {
    toast.error("User not found. Please log in again.");
    return;
  }

  if (subject === "" || typeOf === "") {
    toast.error("Please select Subject and Type first!");
    return;
  }

  const dataObj = {
    studentId: data._id,
    date: date,
    subject: subject,
    submitType: typeOf,
    user: {
      _id: assignUser._id,
      name: assignUser.name,
      role: assignUser.role,
      class: assignUser.class,
      section: assignUser.section
    }
  };

  console.log("Submitting with user data:", dataObj);

  setLoading(true);
  axios.post(`http://localhost:8000/api/copy-check`, dataObj, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    const { success, message } = res.data;

    if (success) {
      const action = assignUser.role === "Teacher" ? "checked" : "re-checked";
      toast.success(`${typeOf} ${action} successfully for ${data.name}`);
      fetchAllCopies();
    } else {
      // For already checked cases
      if (message.includes("already checked")) {
        toast.success(message);  // or toast.warning(message)
      } else {
       
      }
    }
  })
  .catch((error) => {
    console.error("Submission error:", error);
    toast.error(error?.message || "Something went wrong");
  })
  .finally(() => {
    setLoading(false);
  });
};

  useEffect(() => {

    // annyang.start();

    annyang.addCallback("result", (userSaidArray) => {
      const userSaid = userSaidArray[0];
      if (userSaid.toLowerCase().includes("dtc")) {
        const studentName = userSaid.split("dtc")[1]?.trim(); // Use optional chaining to prevent error if split returns undefined
        console.log(studentName);
        const student = userData?.find(
          (s) =>
            s?.name?.toLowerCase()?.trim() == studentName?.toLowerCase()?.trim()
        );
        if (student) {
          console.log("Student found:", student);
          if (subject && typeOf) {
            handleCopySubmit(student);
          }
          // Logic to handle student details
        } else {
          console.log("Student not found. Please try again.");
          // Voice response: "Student not found. Please try again."
        }

      }
    });
    const fuse = new Fuse(userData, {
      keys: ["name"],
      threshold: 0.4,
      includeScore: true,
    });

    annyang.addCallback("result", (userSaidArray) => {
      const userSaid = userSaidArray[0];
      if (userSaid?.toLowerCase()?.includes("check")) {
        const studentName = userSaid?.split("check")[1]?.trim();
        console.log(studentName);

        // Perform fuzzy search
        const result = fuse.search(studentName);

        if (result?.length > 0) {
          const student = result[0]; // Assuming you want the top match
          console.log("Student found:", student);
          if (subject && typeOf) {
            handleCopySubmit(student.item);
          }
          // Logic to handle student details
        } else {
          console.log("Student not found. Please try again.");
          // Voice response: "Student not found. Please try again."
        }
      }
    });
    // Clean up when the component unmounts
    return () => {
      annyang.removeCommands();
      annyang.abort();
    };
  }, [subject, typeOf]);
  function generateWhatsAppMessage(userData) {
    const notSubmittedStudents = userData?.filter(
      (item) => !item?.copyRes[item?.copyRes?.length - 1]?.isCopyChecked
    );
    if (notSubmittedStudents?.length === 0) {
      return "All students have submitted their copy today.";
    }

    const message = `Please find the list of students who haven't submitted their ${subject} ${typeOf} today - ${getDate}:\n`;
    const studentList = notSubmittedStudents
      ?.map(
        (student) =>
          `(${student.name} Class: ${student.studentClass} Roll Number: ${student.rollNumber})`
      )
      .join("\n");
    return `${message}${studentList}`;
  }

  console.log(activeClass);

  const handleTeacherByClass = (e) => {
    setTeacherNameForRemark(e.target.selectedOptions[0].text);
    setTeacherIdForRemark(e.target.value);
  };
  const handleRemarkSend = () => {
    let data = {
      remarkBy: name,
      remarkById: uid,
      remarkByRole: role,
      remarkTo: teacherNameForRemark,
      remarkToRole:
        role === "Senior Coordinator" || role === "Junior Coordinator"
          ? "Teacher"
          : role === "Teacher"
            ? "Junior Coordinator"
            : role === "Admin"
              ? "Senior Coordinator"
              : "",
      remarkToId: teacherIdForRemark,
      isChecked: false,
      remarkComment: remarkComment,
      remarkDate: getDate,
    };
    try {
      axios
        .post(`http://localhost:8000/api/remark`, data)
        .then((res) => {
          console.log(res.data.data);
          if (res.data.success) {
            toast.success("Remark sent successfully !", { id: "Errorr" });
            setRemarkComment("");
          }
        })
        .finally(() => { })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message, { id: "Errorr" });
        });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { id: "Errorr" });
    }
  };
  return (
    <>
      <Toaster />
      <div className="grid md:grid-cols-4 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Subject</span>
          </label>
          <select
            onChange={(e) => setSubject(e.target.value)}
            className="select select-bordered border-gray-300"
          >
            <option value="" selected disabled>
              Select Subject
            </option>
            {/* {activeClass == "L.K.G" ? (
              <>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Maths">Maths</option>
                <option value="General">General</option>
              </>
            ) : activeClass == "Nursery" ? (
              <>
                {" "}
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Maths">Maths</option>
                <option value="General">General</option>
              </>
            ) : role == "Teacher" ? (
              <>
                {role == "Teacher" && assignedSubjects
                  ? assignedSubjects.map((res) => {
                      return (
                        <option key={res.value} value={res.value}>
                          {res.value}
                        </option>
                      );
                    })
                  : ""}
              </>
            ) : (
              <>
                {" "}
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="General">General</option>
                <option value="Hindi-1">Hindi-1</option>
                <option value="Hindi-2">Hindi-2</option>
                <option value="English-1">English-1</option>
                <option value="English-2">English-2</option>
                <option value="Maths">Maths</option>{" "}
                <option value="G.K">G.K</option>
                <option value="Science">Science</option>
                <option value="E.V.S">E.V.S</option>
                <option value="S.S.T">S.S.T</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Art">Art</option>
                <option value="Computer">Computer</option>
              </>
            )} */}

            {assignedSubjects?.map((res) => (
              <option key={res.value} value={res.value}>
                {res.value}
              </option>
            ))}

            {role == "Admin" && (
              <>
                {" "}
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="General">General</option>
                <option value="Hindi-1">Hindi-1</option>
                <option value="Hindi-2">Hindi-2</option>
                <option value="English-1">English-1</option>
                <option value="English-2">English-2</option>
                <option value="Maths">Maths</option>{" "}
                <option value="G.K">G.K</option>
                <option value="Science">Science</option>
                <option value="E.V.S">E.V.S</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="S.S.T">S.S.T</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Art">Art</option>
                <option value="Computer">Computer</option>
              </>
            )}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Type</span>
          </label>
          <select
            onChange={(e) => setTypeOf(e.target.value)}
            className="select select-bordered border-gray-300"
          >
            <option value="" selected disabled>
              Select Type
            </option>
            {activeClass == "L.K.G" ? (
              <>
                {" "}
                <option value="Work Book">Work Book</option>
                <option value="Book">Book</option>
                <option value="Copy">Copy</option>
                <option value="Picture Book">Picture Book</option>
                <option value="Drawing With Craft">Drawing With Craft</option>
                <option value="Rhymes">Rhymes</option>
              </>
            ) : activeClass == "Nursery" ? (
              <>
                {" "}
                <option value="Work Book">Work Book</option>
                <option value="Book">Book</option>
                <option value="Copy">Copy</option>
                <option value="Picture Book">Picture Book</option>
                <option value="Drawing With Craft">Drawing With Craft</option>
                <option value="Rhymes">Rhymes</option>
              </>
            ) : (
              <>
                {" "}
                <option value="Book">Book</option>
                <option value="Copy">Copy</option>
                <option value="File">File</option>
              </>
            )}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end font-semibold mt-4">
        Date : {getDate}
      </div>
      <div className="flex justify-end font-semibold mt-4">
        {typeOf && subject && (
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              generateWhatsAppMessage(userData)
            )}`}
            className="btn btn-warning text-white"
          >
            Forward to Whatsapp
          </a>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <DownloadTableExcel
          filename="users table"
          sheet="users"
          currentTableRef={tableRef?.current}
        >
          <button className="btn btn-success btn-md text-white">
            Export To Excel <RiFileExcel2Fill />
          </button>
        </DownloadTableExcel>
      </div>

      {role != "Teacher" && teacherForClassSubjectDiv && (
        <>
          <div className="flex items-center gap-4">
            {teacherForClassSubjectDiv && (
              <>
                <div className="form-control">
                  <label htmlFor="">Select Teacher</label>
                  <select
                    onChange={handleTeacherByClass}
                    className="select select-bordered border-gray-300"
                  >
                    <option value="" selected disabled>
                      Select Teacher
                    </option>
                    {teacherForClassSubjectDiv?.map((res) => (
                      <option value={res._id} key={res._id}>
                        {res?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="form-control">
              <label htmlFor="">Remark For Teacher</label>
              <textarea
                className=" textarea textarea-bordered"
                cols="30"
                placeholder="Remark"
                rows="1"
                onChange={(e) => setRemarkComment(e.target.value)}
                value={remarkComment}
              ></textarea>
            </div>

            <div className="form-control relative top-3 ">
              <button
                className="btn btn-outline "
                onClick={() => handleRemarkSend()}
              >
                Send Remark
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        {role == "Admin" && (
          <>
            {" "}
            <div role="tablist" className="tabs tabs-boxed flex-wrap flex ">
              <a
                onClick={() => setActiveClass("all")}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "all" ? " tab-active" : ""
                  }`}
              >
                All
              </a>
              <a
                onClick={() => setActiveClass("L.K.G")}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "L.K.G" ? " tab-active" : ""
                  }`}
              >
                L.K.G
              </a>
              <a
                onClick={() => setActiveClass("U.K.G")}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "U.K.G" ? " tab-active" : ""
                  }`}
              >
                U.K.G
              </a>
              <a
                onClick={() => setActiveClass("Nursery")}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "Nursery" ? " tab-active" : ""
                  }`}
              >
                Nursery
              </a>
              <a
                onClick={() => setActiveClass(1)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "1" ? " tab-active" : ""
                  }`}
              >
                Class 1
              </a>
              <a
                onClick={() => setActiveClass(2)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "2" ? " tab-active" : ""
                  }`}
              >
                Class 2
              </a>
              <a
                onClick={() => setActiveClass(3)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "3" ? " tab-active" : ""
                  }`}
              >
                Class 3
              </a>
              <a
                onClick={() => setActiveClass(4)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "4" ? " tab-active" : ""
                  }`}
              >
                Class 4
              </a>
              <a
                onClick={() => setActiveClass(5)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "5" ? " tab-active" : ""
                  }`}
              >
                Class 5
              </a>
              <a
                onClick={() => setActiveClass(6)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "6" ? " tab-active" : ""
                  }`}
              >
                Class 6
              </a>
              <a
                onClick={() => setActiveClass(7)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "7" ? " tab-active" : ""
                  }`}
              >
                Class 7
              </a>
              <a
                onClick={() => setActiveClass(8)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "8" ? " tab-active" : ""
                  }`}
              >
                Class 8
              </a>
              <a
                onClick={() => setActiveClass(9)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "9" ? " tab-active" : ""
                  }`}
              >
                Class 9
              </a>
              <a
                onClick={() => setActiveClass(10)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "10" ? " tab-active" : ""
                  }`}
              >
                Class 10
              </a>
              <a
                onClick={() => setActiveClass(11)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "11" ? " tab-active" : ""
                  }`}
              >
                Class 11
              </a>
              <a
                onClick={() => setActiveClass(12)}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass == "12" ? " tab-active" : ""
                  }`}
              >
                Class 12
              </a>
            </div>
            <div role="tablist" className="tabs tabs-boxed">
              <a
                onClick={() => setActiveDivision("all")}
                role="tab"
                className={`tab min-w-[7rem] ${activeDivision == "all" ? " tab-active" : ""
                  }`}
              >
                All
              </a>
              <a
                onClick={() => setActiveDivision("A")}
                role="tab"
                className={`tab min-w-[7rem] ${activeDivision == "A" ? " tab-active" : ""
                  }`}
              >
                A
              </a>
              <a
                onClick={() => setActiveDivision("B")}
                role="tab"
                className={`tab min-w-[7rem] ${activeDivision == "B" ? " tab-active" : ""
                  }`}
              >
                B
              </a>
              {/* <a
              onClick={() => setActiveDivision("C")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeDivision == "C" ? " tab-active" : ""
              }`}
            >
              C
            </a>
            <a
              onClick={() => setActiveDivision("D")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeDivision == "D" ? " tab-active" : ""
              }`}
            >
              D
            </a> */}
            </div>
          </>
        )}
        {role === "Teacher" && (
          <>
            <div role="tablist" className="tabs tabs-boxed flex-wrap flex">
              <a
                onClick={() => {
                  setActiveClass("all");
                  setClassOfTeacher("all");
                  setActiveDivision("all");
                  setDivisionOfTeacher("all");
                }}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass === "all" ? "tab-active" : ""}`}
              >
                All
              </a>
              {assignedClasses?.map((cls) => (
                <a
                  key={cls._id}
                  onClick={() => {
                    setClassOfTeacher(cls.value);
                    setActiveClass(cls.value);
                  }}
                  role="tab"
                  className={`tab min-w-[7rem] ${activeClass === cls.value ? "tab-active" : ""
                    }`}
                >
                  {cls.label}
                </a>
              ))}
            </div>

            <div role="tablist" className="tabs tabs-boxed">
              {assignedClasses
                ?.find((cls) => cls.value === activeClass) // find selected class
                ?.sections
                ?.map((section) => (
                  <a
                    key={section._id}
                    onClick={() => {
                      setDivisionOfTeacher(section.value);
                      setActiveDivision(section.value);
                    }}
                    role="tab"
                    className={`tab min-w-[7rem] ${activeDivision === section.value ? "tab-active" : ""}`}
                  >
                    {section.label}
                  </a>
                ))}
            </div>
          </>
        )}

        {(role === "Senior Coordinator" || role === "Junior Coordinator") && (
          <>
            {/* Top-Level Filter Tabs */}
            <div role="tablist" className="tabs tabs-boxed flex-wrap flex">
              {/* Separate "All Students" Tab */}
              <a
                onClick={() => {
                  setClassOfTeacher("all");
                  setActiveClass("all");
                  setDivisionOfTeacher("all");
                  setActiveDivision("all");
                }}
                role="tab"
                className={`tab min-w-[7rem] ${activeClass === "all" ? "tab-active" : ""}`}
              >
                All Students
              </a>

              {/* Class Tabs */}
              {assignedClasses?.map((cls) =>
                cls.value.split(",").map((classValue, index) => (
                  <a
                    key={`${cls._id}-${index}`}
                    onClick={() => {
                      setClassOfTeacher(classValue);
                      setActiveClass(classValue);
                      setActiveDivision("all"); // reset division when class changes
                    }}
                    role="tab"
                    className={`tab min-w-[7rem] ${activeClass === classValue ? "tab-active" : ""
                      }`}
                  >
                    {classValue}
                  </a>
                ))
              )}
            </div>

            {/* Section Tabs — only if not showing "All Students" */}
            {activeClass !== "all" && (
              <div role="tablist" className="tabs tabs-boxed">
                {/* "All Divisions" tab for selected class */}
                <a
                  onClick={() => {
                    setDivisionOfTeacher("all");
                    setActiveDivision("all");
                  }}
                  role="tab"
                  className={`tab min-w-[7rem] ${activeDivision === "all" ? "tab-active" : ""}`}
                >
                  All Divisions
                </a>

                {/* Dynamic Section Tabs */}
                {assignedClasses
                  ?.find((cls) => cls.value.split(",").includes(activeClass))
                  ?.sections?.map((section) => (
                    <a
                      key={section._id}
                      onClick={() => {
                        setDivisionOfTeacher(section.value);
                        setActiveDivision(section.value);
                      }}
                      role="tab"
                      className={`tab min-w-[7rem] ${activeDivision === section.value ? "tab-active" : ""
                        }`}
                    >
                      {section.label}
                    </a>
                  ))}
              </div>
            )}
          </>
        )}


        {!loading ? (
          <>
            {userData ? (
              <>
                <table
                  ref={tableRef}
                  className="w-full table-auto text-sm text-left"
                >
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Father's Name</th>
                      <th className="py-3 px-6">Roll Number</th>
                      <th className="py-3 px-6">Class-Section</th>
                      <th className="py-3 px-6">Subject</th>
                      <th className="py-3 px-6">Type</th>
                      <th className="py-3 px-6">Checked By</th>
                      <th className="py-3 px-6">Rechecked By</th>
                    {role !== "Admin" && <th className="py-3 px-6">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {userData?.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img src={item?.studentAvatar?.secure_url} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{item?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.fathersName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.studentClass}-{item?.studentSection}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subject || "Select a Subject"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {typeOf || "Select a Type"}
                        </td>
                        {/* Copy Check Status */}
                       <td className="px-6 py-4 whitespace-nowrap">
  {item?.copyRes[0]?.checkedByTeacher ? (
    <span className="badge badge-success badge-md text-white">
      {item.copyRes[0].checkedByTeacher}
      <br />

    </span>
  ) : (
    <span className="badge badge-error text-white">
      Not-Checked
    </span>
  )}
</td>

<td className="px-6 py-4 whitespace-nowrap">
  {item?.copyRes[0]?.checkedByCoordinator ? (
    <span className="badge badge-success badge-md text-white">
      {item.copyRes[0].checkedByCoordinator}
      <br />
  
    </span>
  ) : (
    <span className="badge badge-error text-white">
      Not-ReChecked
    </span>
  )}
</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                       {role !== "Admin" && (
    <button
      onClick={() => handleCopySubmit(item)}
      className="btn btn-outline btn-xs"
    >
      {!item.isCopyChecked ? "Check" : "Un-Check"}
    </button>
  )}

                          {/* <button
                        onClick={() =>
                          updateStatus(item._id, item.isActive)
                        }
                        className="btn btn-outline btn-xs ml-2"
                        disabled={btnDisable}
                      >
                        {item.isActive !== true ? "Active" : "In-Active"}
                      </button> */}

                          {/* {role == "Super_Admin" && (
                        <button
                          onClick={() => handleDeleteModal(item)}
                          className="btn btn-error  btn-xs text-white ml-2"
                        >
                          Delete
                        </button>
                      )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex justify-center py-4 font-semibold">
                No Student Data !
              </div>
            )}
          </>
        ) : (
          <>
            {" "}
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
      </div>
      {renderPagination()}
    </>
  );
};

export default ManageCopies;
