import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiFillCloseCircle, AiOutlineMenu } from "react-icons/ai";
import Home from "./pages/Home";
import Login from "./pages/Login";
import annyang from "annyang";
import logo from "./assets/dusk.jpg";
import ManageAdmins from "./pages/Admins/ManageAdmins";
import ManageStudents from "./pages/Students/ManageStudents";
import ManageCopies from "./pages/Manage-Copies/ManageCopies";
import ManageExamCopies from "./pages/Manage-exam-copies/ManageExamCopies";
import AssignClasses from "./pages/Teachers/AssignClasses";
import ListFee from "./pages/Fee-Management/ListFee";
import TakeFee from "./pages/Fee-Management/TakeFee";
import ViewFees from "./pages/Fee-Management/ViewFees";
import FeeStructure from "./pages/Fee-Management/FeeStructure";
import TCertificate from "./pages/Certificates/TCertificate";
import ManageTeacher from "./pages/Admins/ManageTeacher";
import ManageCoordinator from "./pages/Admins/ManageCoordinator";
import ManageAdmin from "./pages/Admins/ManageAdmin";
import TeacherAttendance from "./pages/Teachers/TeacherAttendance";
import AttendanceList from "./pages/Teachers/AttendenceList";
import StudentList from "./pages/Students/StudentList";
import StudentAttendance from "./pages/Students/StudentAttendece";
import Homework from "./pages/Homework/Homework";
import AddHomework from "./pages/Homework/AddHomework";
import StuAttendenceView from "./pages/Admins/ManageStuAtten";
const App = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("dashboard");
  const [recognizedSpeech, setRecognizedSpeech] = useState("");
  const currentUser = localStorage.getItem("currentUser");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const moduleAssigned = JSON.parse(localStorage.getItem("module"));
  const [ml, setML] = useState(false);
  console.log(name);
  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);
  useEffect(() => {
    if (location.pathname == "") {
      setActiveLink("dashboard");
    }
  }, [location.pathname]);

  const setMl = () => {
    if (window.innerWidth < 1023) {
      if (ml == false) {
        setML(true);
      } else {
        setML(false);
      }
    }
  };

  // VOICE COMMAND

  useEffect(() => {
    if (!annyang) return;

    const commands = {
      home: () => navigate("/"),
      "user panel": () => navigate("/manage-admins"),
      "student panel": () => navigate("/manage-students"),
      "copy panel": () => navigate("/manage-copies"),
      hello: () => alert("Hello, welcome back!"),
      "stop listening": () => {
        annyang.abort();
        setIsListening(false);
      },
      "clear speech": () => setRecognizedSpeech("Listening..."),
    };

    annyang.addCommands(commands);

const onResult = (phrases) => {
  const phrase = phrases[0] || "";
  console.log("Recognized (raw):", phrase);

  // Display only the first two words
  const cleanedPhrase = phrase.trim().replace(/\s+/g, " ");
  const firstTwoWords = cleanedPhrase.split(" ").slice(0, 2).join(" ");
  setRecognizedSpeech(firstTwoWords || "Listening...");

  // Process the FULL phrase (not just the first two words)
  if (phrase.includes("clear")) {
    setRecognizedSpeech("Listening...");
  } else if (phrase.includes("stop")) {
    annyang.abort();
    setIsListening(false);
  }
};



    annyang.addCallback("result", onResult);
    annyang.addCallback("start", () => setIsListening(true));
    annyang.addCallback("end", () => setIsListening(false));

    return () => {
      annyang.removeCommands();
      annyang.abort();
    };
  }, [navigate]);

  const toggleListening = () => {
    setRecognizedSpeech("Say something 😃!...");

    if (isListening) {
      annyang.abort();
      setIsListening(false);
      setRecognizedSpeech("");
    } else {
      annyang.start({
        autoRestart: true,
        continuous: true,
        interimResults: false, // Set this to `true` if you want real-time feedback
      });
    }
  };
  // useEffect(() => {
  //   if (isListening) {
  //     const timeoutId = setTimeout(() => {
  //       setIsListening(false);
  //       setRecognizedSpeech(""); // Clear recognized speech after 2 seconds
  //     }, 2000);

  //     return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or state change
  //   }
  // }, [isListening]);
  return (
    <>
      <button
        className={`voice-button ${isListening ? "pulsate" : ""}`}
        onClick={toggleListening}
      >
        <span className="icon" role="img" aria-label="Voice Recognition">
          🎙️
        </span>
        {isListening ? recognizedSpeech || "Listening..." : ""}
      </button>
      {currentUser ? (
        <section className="bg-gray-100 dark:bg-gray-900">
          <aside
            className={
              ml
                ? "fixed top-0 z-10 ml-[0] flex h-screen w-full flex-col justify-between border-r bg-white px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[30%] xl:w-[23%] 2xl:w-[20%] dark:bg-gray-800 dark:border-gray-700"
                : "fixed top-0 z-10 ml-[-100%] flex h-screen w-full flex-col justify-between border-r bg-white px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[30%] xl:w-[23%] 2xl:w-[20%] dark:bg-gray-800 dark:border-gray-700"
            }
          >
            <div className=" overflow-y-auto z-60 h-[90vh] overflow-x-hidden">
              <div className="-mx-6 z-60 px-6 py-4">
                {window.innerWidth < 1023 && (
                  <div className="flex items-center justify-between">
                    <h5
                      onClick={() => setMl()}
                      className="z-60 flex justify-end text-2xl font-medium text-gray-600 lg:block dark:text-white"
                    >
                      <AiFillCloseCircle />
                    </h5>
                    <button
                      onClick={handleLogout}
                      className="group flex items-center space-x-4 rounded-md px-4 py-5    text-black  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                        Logout
                      </span>
                    </button>
                  </div>
                )}
                <h2 className="font-semibold text-xl mt-3">
                  D2C Portal <span>©</span>
                </h2>
              </div>

              <div className="mt-8 text-center">
                <img
                  src={logo}
                  alt="admin"
                  className="m-auto h-10 w-10 rounded-md object-cover lg:h-28 lg:w-28"
                />
                <h5 className="mt-4 hidden text-xl font-semibold text-gray-600 lg:block dark:text-gray-300">
                  {name}
                </h5>
                <span className="hidden text-gray-400 lg:block">{role}</span>
              </div>

              <ul className="mt-8 space-y-2 tracking-wide">
                {role == "Admin" ? (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Dashboard</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("admin");
                        navigate("/manage-admin");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="admin"
                        className={
                          activeLink == "admin"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Users</span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("fees");
                        navigate("/manage-fees");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="fees"
                        className={
                          activeLink == "fees"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Fees</span>
                      </a>
                    </li> */}
                    <li
                      onClick={() => {
                        setActiveLink("assign classes");
                        navigate("/assign-classes");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="assign classes"
                        className={
                          activeLink == "assign classes"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Assign Classes
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("student");
                        navigate("/manage-students");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="student"
                        className={
                          activeLink == "student"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Students
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("copies");
                        navigate("/manage-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="copies"
                        className={
                          activeLink == "copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Copies</span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("exam copies");
                        navigate("/manage-exam-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="exam copies"
                        className={
                          activeLink == "exam copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Exam Copies
                        </span>
                      </a>
                    </li> */}
                    {/* <li
                      onClick={() => {
                        setActiveLink("tc certificate");
                        navigate("/tc-certificate");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="tc certificate"
                        className={
                          activeLink == "tc certificate"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          T.C Certificate
                        </span>
                      </a>
                    </li> */}
                  </>
                ) : role == "Teacher" ? (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Dashboard</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("copies");
                        navigate("/manage-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="copies"
                        className={
                          activeLink == "copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Copies</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("student attendence");
                        navigate("/display-attendence-stu");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="student attendence"
                        className={
                          activeLink == "student attendence"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Student Attendence
                        </span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("exam copies");
                        navigate("/manage-exam-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="exam copies"
                        className={
                          activeLink == "exam copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Exam Copies
                        </span>
                      </a>
                    </li> */}

                    <li
                      onClick={() => {
                        setActiveLink("homework");
                        navigate("/homework");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="homework"
                        className={
                          activeLink == "homework"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Homework</span>
                      </a>
                    </li>
                  </>
                ) : role == "Senior Coordinator" ? (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Dashboard</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("copies");
                        navigate("/manage-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="copies"
                        className={
                          activeLink == "copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Copies</span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("exam copies");
                        navigate("/manage-exam-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="exam copies"
                        className={
                          activeLink == "exam copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Exam Copies
                        </span>
                      </a>
                    </li> */}
                  </>
                ) : role == "Junior Coordinator" ? (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Dashboard</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("copies");
                        navigate("/manage-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="copies"
                        className={
                          activeLink == "copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Manage Copies</span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("exam copies");
                        navigate("/manage-exam-copies");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="exam copies"
                        className={
                          activeLink == "exam copies"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Manage Exam Copies
                        </span>
                      </a>
                    </li> */}
                  </>
                ) : (
                  ""
                )}
              </ul>
            </div>
            <ul className="mt-8 p-0 m-0 tracking-wide">
              <a
                href="https://shineinfosolutions.in/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold pb-2 text-sm w-full"
              >
                Developed By Shine Infosolutions
              </a>
            </ul>
            <div className="-mx-6 md:flex hidden items-center justify-between border-t px-6 pt-4 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600 dark:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                  Logout
                </span>
              </button>
            </div>
          </aside>
          <div className="ml-auto mb-6 lg:w-[70%] xl:w-[75%] 2xl:w-[80%]">
            <div
              className={
                window.innerWidth < 768
                  ? " sticky md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
                  : "sticky  md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
              }
            >
              <div className="flex items-center justify-between space-x-4 px-4 2xl:container h-full">
                <h5
                  hidden
                  className="text-2xl font-medium text-gray-600 lg:block dark:text-white"
                >
                  {activeLink.toLocaleUpperCase()}
                </h5>
                <h5
                  onClick={() => setMl()}
                  className="text-2xl lg:hidden font-medium text-gray-600  dark:text-white"
                >
                  <AiOutlineMenu />
                </h5>
                <div className="flex space-x-4"></div>
              </div>
            </div>

            <div className="px-6 pt-6 bg-white">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage-admins" element={<ManageAdmins />} />
                <Route path="/manage-teacher" element={<ManageTeacher />} />
                <Route
                  path="/manage-coordinator"
                  element={<ManageCoordinator />}
                />
                <Route path="/manage-admin" element={<ManageAdmin />} />
                <Route path="/manage-fees" element={<ListFee />} />
                <Route path="/fee-structure" element={<FeeStructure />} />
                <Route path="/take-fees/:id" element={<TakeFee />} />
                <Route path="/view-fees/:id" element={<ViewFees />} />
                <Route path="/manage-students" element={<ManageStudents />} />
                <Route path="/manage-copies" element={<ManageCopies />} />
                <Route path="/tc-certificate" element={<TCertificate />} />
                <Route
                  path="/manage-attendence-student"
                  element={<StudentAttendance />}
                />
                <Route
                  path="/display-attendence-stu"
                  element={<StudentList />}
                />
                <Route
                  path="/manage-attendence-teacher"
                  element={<TeacherAttendance />}
                />
                <Route
                  path="/display-attendence"
                  element={<AttendanceList />}
                />{" "}
                <Route
                  path="/manage-exam-copies"
                  element={<ManageExamCopies />}
                />
                <Route path="/assign-classes" element={<AssignClasses />} />
                <Route path="/homework" element={<Homework />} />
                <Route path="/add-homework" element={<AddHomework />} />
                <Route path="/stu-attendence-view" element={<StuAttendenceView />} />
              </Routes>
            </div>
          </div>
        </section>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
