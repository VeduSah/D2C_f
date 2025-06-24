// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Toaster, toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const StudentList = () => {
//   const formatDateForInput = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   const [attendances, setAttendances] = useState([]);
//   const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date()));
//   const [selectedClass, setSelectedClass] = useState("");
//   const [assignedClasses, setAssignedClasses] = useState([]);
//   const [selectedSection, setSelectedSection] = useState("");
//   const [availableSections, setAvailableSections] = useState([]);
//   const [monthFilter, setMonthFilter] = useState(() => {
//     const currentMonth = new Date().getMonth() + 1; // 0-based, so add 1
//     return currentMonth.toString(); // Make sure it's a string if used in select inputs
//   });
//   const [yearFilter, setYearFilter] = useState(
//     new Date().getFullYear().toString()
//   );
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [viewMode, setViewMode] = useState("daily"); // 'daily' or 'monthly'
//   const [classFilter, setClassFilter] = useState("");
//   const [availableClasses, setAvailableClasses] = useState([]);
//   const navigate = useNavigate();

//   // Load assigned classes when component mounts
//   useEffect(() => {
//     const teacherClasses =
//       JSON.parse(localStorage.getItem("assignedClasses")) || [];
//     setAssignedClasses(teacherClasses);

//     // Set default selected class if available
//     if (teacherClasses.length > 0) {
//       setSelectedClass(teacherClasses[0].value);

//       // Set available sections for the selected class
//       const sections = teacherClasses[0].sections || [];
//       setAvailableSections(sections);
//       if (sections.length > 0) {
//         setSelectedSection(sections[0].value);
//       }
//     }
//   }, []);

//   const fetchAttendance = async () => {
//     if (!selectedClass) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const params = { page };

//       // if (selectedSection) {
//       //   params.section = selectedSection;
//       // }

//       if (viewMode === "daily" && dateFilter) {
//         params.date = dateFilter;
//       } else if (viewMode === "monthly" && monthFilter && yearFilter) {
//         params.month = monthFilter;
//         params.year = yearFilter;
//       }

//       const endpoint =
//         viewMode === "daily"
//           ? "https://d2-c-b.vercel.app/api/student-attendance/pg"
//           : "https://d2-c-b.vercel.app/api/student-attendance/summary";

//       const res = await axios.get(endpoint, { params });

//       // Client-side filtering based on class and section
//       let filteredData = res.data.data || [];

//       if (selectedClass) {
//         filteredData = filteredData.filter(
//           (student) =>
//             student.studentClass === selectedClass ||
//             student.class === selectedClass
//         );
//       }

//       if (selectedSection) {
//         filteredData = filteredData.filter(
//           (student) =>
//             student.studentSection === selectedSection ||
//             student.section === selectedSection
//         );
//       }

//       setAttendances(filteredData);
//       setTotalPages(Math.ceil(filteredData.length / 15) || 1); // Assuming 15 items per page
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//       setError("No records found");
//       toast.error("Failed to load attendance records");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const shareOnWhatsApp = () => {
//     if (viewMode !== "monthly") {
//       toast.error("Sharing is only available in monthly view");
//       return;
//     }

//     if (attendances.length === 0) {
//       toast.error("No data available to share");
//       return;
//     }

//     try {
//       // Create title based on filters
//       let title = "Student Attendance Report";
//       if (selectedClass) {
//         title += ` for Class ${selectedClass}`;
//         if (selectedSection) {
//           title += `-${selectedSection}`;
//         }
//       }

//       const monthName = new Date(0, monthFilter - 1).toLocaleString("default", {
//         month: "long",
//       });
//       title += ` for ${monthName} ${yearFilter}`;

//       // Format the current attendances data for WhatsApp with better UI
//       const rows = attendances.map((record) => {
//         const name = record.name || record.student?.name || "";
//         const rollNumber =
//           record.rollNumber || record.student?.rollNumber || "";
//         const present = record.presentCount || 0;
//         const absent = record.absentCount || 0;
//         const total = present + absent;

//         return {
//           name,
//           rollNumber,
//           present,
//           absent,
//           total,
//         };
//       });

//       // Convert to CSV-like format
//       const lines = ["Name,Roll Number,Present,Absent,Total Days"];

//       rows.forEach((row) => {
//         lines.push(
//           `${row.name},${row.rollNumber},${row.present},${row.absent},${row.total}`
//         );
//       });

//       // Calculate column widths for better formatting
//       const csvLines = lines.map((line) => line.split(","));
//       const colWidths = [];

//       // Find the maximum width for each column
//       csvLines[0].forEach((_, colIndex) => {
//         colWidths.push(
//           Math.max(
//             ...csvLines.map((row) => (row[colIndex] || "").toString().length)
//           )
//         );
//       });

//       // Format rows with padding
//       const formatRow = (row) =>
//         row
//           .map((cell, i) => (cell || "").toString().padEnd(colWidths[i]))
//           .join("  ");

//       const formattedTable = csvLines.map(formatRow).join("\n");

//       const message =
//         `${title}\n\n` +
//         "```" + // WhatsApp code block
//         `\n${formattedTable}\n` +
//         "```";

//       const encodedMessage = encodeURIComponent(message);
//       window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
//     } catch (error) {
//       console.error("Error sharing data:", error);
//       toast.error("Failed to share data");
//     }
//   };

//   const exportToCSV = () => {
//     if (viewMode !== "monthly") {
//       toast.error("Export is only available in monthly view");
//       return;
//     }

//     if (attendances.length === 0) {
//       toast.error("No data available to export");
//       return;
//     }

//     try {
//       // Convert current filtered data to CSV format
//       const headers = [
//         "Name",
//         "Roll Number",
//         "Class",
//         "Section",
//         "Present",
//         "Absent",
//         "Total Days",
//       ];
//       const csvRows = [headers];

//       attendances.forEach((record) => {
//         const name = record.name || record.student?.name || "";
//         const rollNumber =
//           record.rollNumber || record.student?.rollNumber || "";
//         const className =
//           record.studentClass || record.class || selectedClass || "";
//         const section =
//           record.studentSection || record.section || selectedSection || "";
//         const present = record.presentCount || 0;
//         const absent = record.absentCount || 0;
//         const total = present + absent;

//         csvRows.push([
//           name,
//           rollNumber,
//           className,
//           section,
//           present,
//           absent,
//           total,
//         ]);
//       });

//       // Convert rows to CSV string
//       const csvContent = csvRows
//         .map((row) =>
//           row
//             .map((cell) =>
//               typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell
//             )
//             .join(",")
//         )
//         .join("\n");

//       // Create blob and download
//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

//       // Create descriptive filename
//       let filename = "student_attendance";
//       if (selectedClass) {
//         filename += `_class${selectedClass}`;
//         if (selectedSection) {
//           filename += `_section${selectedSection}`;
//         }
//       }

//       const monthName = new Date(0, monthFilter - 1).toLocaleString("default", {
//         month: "short",
//       });
//       filename += `_${monthName}${yearFilter}`;

//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${filename}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error exporting data:", error);
//       toast.error("Failed to export data");
//     }
//   };

//   useEffect(() => {
//     if (selectedClass) {
//       fetchAttendance();
//     }
//   }, [
//     page,
//     dateFilter,
//     monthFilter,
//     yearFilter,
//     viewMode,
//     selectedClass,
//     selectedSection,
//   ]);

// const generateWeeklyReport = async (studentId) => {
//   try {
//     const today = new Date();

//     // Generate list of past 7 calendar days including today
//     const pastWeekDates = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);
//       pastWeekDates.push(date);
//     }

//     // Reverse to make it oldest → newest
//     pastWeekDates.reverse();

//     // Filter out Sundays
//     const validDates = pastWeekDates.filter(date => date.getDay() !== 0);

//     // Start date is the first valid date (earliest day, not Sunday)
//     const formattedStartDate = validDates[0].toISOString().split("T")[0];

//     toast.loading("Generating report...");

//     const response = await axios.get(
//       `https://d2-c-b.vercel.app/api/student-attendance/student/weekly-report`,
//       {
//         params: {
//           studentId,
//           startDate: formattedStartDate,
//         },
//         responseType: "json",
//       }
//     );

//     toast.dismiss();

//     if (response.data && response.data.success) {
//       const { student, reportPeriod, dailyReport, summary } = response.data.data;

//       let message = `*Weekly Attendance Report*\n\n`;
//       message += `*Student:* ${student.name} (${student.rollNumber})\n`;
//       message += `*Class:* ${student.class}-${student.section}\n`;
//       message += `*Period:* ${reportPeriod.from} to ${reportPeriod.to}\n\n`;

//       message += `*Daily Attendance:*\n`;

//       // Exclude Sundays from report display
//       const filteredReport = dailyReport.filter(day => {
//         const dayDate = new Date(day.date);
//         return dayDate.getDay() !== 0;
//       });

//       filteredReport.forEach(day => {
//         message += `${day.day} (${day.date}): ${day.status}\n`;
//       });

//       // Count Present/Absent only for non-Sunday days
//       const presentCount = filteredReport.filter(d => d.status === "Present").length;
//       const absentCount = filteredReport.filter(d => d.status === "Absent").length;

//       message += `\n*Summary:*\n`;
//       message += `Present: ${presentCount} days\n`;
//       message += `Absent: ${absentCount} days\n`;

//       const encodedMessage = encodeURIComponent(message);
//       window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");

//       toast.success("Report shared to WhatsApp");
//     } else {
//       toast.error("Failed to generate report");
//     }
//   } catch (error) {
//     toast.dismiss();
//     console.error("Error generating weekly report:", error);
//     toast.error("Failed to generate weekly report");
//   }
// };



//   const handleClassChange = (e) => {
//     const newClass = e.target.value;
//     setSelectedClass(newClass);

//     // Update available sections for the selected class
//     const selectedClassObj = assignedClasses.find(
//       (cls) => cls.value === newClass
//     );
//     const sections = selectedClassObj?.sections || [];
//     setAvailableSections(sections);

//     // Reset or set default section
//     setSelectedSection(sections.length > 0 ? sections[0].value : "");
//     setPage(1);
//   };

//   const handleSectionChange = (e) => {
//     setSelectedSection(e.target.value);
//     setPage(1);
//   };

//   const handleDateChange = (e) => {
//     setDateFilter(e.target.value);
//     setPage(1);
//   };

//   const handleMonthChange = (e) => {
//     setMonthFilter(e.target.value);
//     setPage(1);
//   };

//   const handleYearChange = (e) => {
//     setYearFilter(e.target.value);
//     setPage(1);
//   };

//   const toggleViewMode = () => {
//     setViewMode(viewMode === "daily" ? "monthly" : "daily");
//     setPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <Toaster position="top-right" />
//       <div className="max-w-6xl mx-auto bg-white shadow p-6 rounded-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Student Attendance Records</h2>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 // Store current selections in localStorage
//                 localStorage.setItem("selectedAttendanceClass", selectedClass);
//                 localStorage.setItem(
//                   "selectedAttendanceSection",
//                   selectedSection
//                 );

//                 navigate("/manage-attendence-student");
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Take Attendance
//             </button>
//             {viewMode === "monthly" && (
//               <div className="flex gap-2">
//                 <button
//                   onClick={exportToCSV}
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                   Export CSV
//                 </button>
//                 <button
//                   onClick={shareOnWhatsApp}
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="16"
//                     height="16"
//                     fill="currentColor"
//                     viewBox="0 0 16 16"
//                   >
//                     <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
//                   </svg>
//                   Share on WhatsApp
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex flex-wrap items-center gap-4">
//             {/* Class Selection Dropdown */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Class
//               </label>
//               <select
//                 value={selectedClass}
//                 onChange={handleClassChange}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select Class</option>
//                 {assignedClasses.map((cls) => (
//                   <option key={cls._id || cls.value} value={cls.value}>
//                     {cls.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Section Selection Dropdown */}
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Section
//               </label>
//               <select
//                 value={selectedSection}
//                 onChange={handleSectionChange}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 disabled={!selectedClass || availableSections.length === 0}
//               >
//                 <option value="">All Sections</option>
//                 {availableSections.map((section) => (
//                   <option
//                     key={section._id || section.value}
//                     value={section.value}
//                   >
//                     {section.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date/Month Filters */}
//             <div className="flex-1 flex flex-wrap gap-4">
//               {viewMode === "daily" ? (
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Date
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       value={dateFilter}
//                       onChange={handleDateChange}
//                       className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex-1 min-w-[150px]">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Month
//                     </label>
//                     <select
//                       value={monthFilter}
//                       onChange={handleMonthChange}
//                       className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select Month</option>
//                       {Array.from({ length: 12 }, (_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {new Date(0, i).toLocaleString("default", {
//                             month: "long",
//                           })}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex-1 min-w-[120px]">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Year
//                     </label>
//                     <select
//                       value={yearFilter}
//                       onChange={handleYearChange}
//                       className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       {Array.from({ length: 10 }, (_, i) => {
//                         const year = new Date().getFullYear() - 5 + i;
//                         return (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         );
//                       })}
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//           {/* Toggle Button */}
//           <div>
//             <label className="block text-sm font-medium mt-4 text-gray-700 mb-1">
//               View
//             </label>
//             <button
//               onClick={toggleViewMode}
//               className={`px-4 py-2 rounded-md transition-colors duration-200 ${
//                 viewMode === "daily"
//                   ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                   : "bg-purple-100 text-purple-700 hover:bg-purple-200"
//               } font-medium flex items-center gap-2`}
//             >
//               {viewMode === "daily" ? (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Monthly View
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//                   </svg>
//                   Daily View
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading attendance...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : attendances.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No attendance records available
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse mt-4">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="p-2 text-left border">#</th>
//                   <th className="p-2 text-left border">Name</th>
//                   <th className="p-2 text-left border">Roll Number</th>
//                   {viewMode === "daily" ? (
//                     <>
//                       <th className="p-2 text-left border">Status</th>
//                       <th className="p-2 text-left border">Date</th>
//                     </>
//                   ) : (
//                     <>
//                       <th className="p-2 text-left border">Present</th>
//                       <th className="p-2 text-left border">Absent</th>
//                       <th className="p-2 text-left border">Total Days</th>
//                     </>
//                   )}
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Report
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendances.map((record, index) => (
//                   <tr key={record._id || index} className="hover:bg-gray-50">
//                     <td className="p-2 border">
//                       {(page - 1) * 10 + index + 1}
//                     </td>
//                     <td className="p-2 border">
//                       {record.name || record.student?.name}
//                     </td>
//                     <td className="p-2 border">
//                       {record.rollNumber || record.student?.rollNumber}
//                     </td>

//                     {viewMode === "daily" ? (
//                       <>
//                         <td
//                           className={`p-2 border ${
//                             record.status === "Present"
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {record.status}
//                         </td>
//                         <td className="p-2 border">
//                           {record.date
//                             ? new Date(record.date).toLocaleDateString()
//                             : "-"}
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td className="p-2 border text-green-600">
//                           {record.presentCount || 0}
//                         </td>
//                         <td className="p-2 border text-red-600">
//                           {record.absentCount || 0}
//                         </td>
//                         <td className="p-2 border font-medium">
//                           {(record.presentCount || 0) +
//                             (record.absentCount || 0)}
//                         </td>
//                       </>
//                     )}
//                     <td className="p-2 border">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           // Use the student field from the record
//                           const studentId = record.student;
//                           generateWeeklyReport(studentId);
//                         }}
//                         className="text-blue-600 hover:text-blue-900 text-sm font-medium"
//                       >
//                         Weekly Report
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-6 flex justify-between items-center">
//               <button
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//                 disabled={page === 1}
//               >
//                 Prev
//               </button>

//               <span className="text-gray-700">
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 onClick={() =>
//                   setPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//                 disabled={page === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [attendances, setAttendances] = useState([]);
  const [dateFilter, setDateFilter] = useState(formatDateForInput(new Date()));
  const [selectedClass, setSelectedClass] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [availableSections, setAvailableSections] = useState([]);
  const [monthFilter, setMonthFilter] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString();
  });
  const [yearFilter, setYearFilter] = useState(
    new Date().getFullYear().toString()
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const navigate = useNavigate();

  useEffect(() => {
    const teacherClasses =
      JSON.parse(localStorage.getItem("assignedClasses")) || [];
    setAssignedClasses(teacherClasses);

    if (teacherClasses.length > 0) {
      setSelectedClass(teacherClasses[0].value);
      const sections = teacherClasses[0].sections || [];
      setAvailableSections(sections);
      if (sections.length > 0) {
        setSelectedSection(sections[0].value);
      }
    }
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      setError(null);

      const params = { page };

      if (viewMode === "daily" && dateFilter) {
        params.date = dateFilter;
      } else if (viewMode === "monthly" && monthFilter && yearFilter) {
        params.month = monthFilter;
        params.year = yearFilter;
      }

      const endpoint =
        viewMode === "daily"
          ? "https://d2-c-b.vercel.app/api/student-attendance/pg"
          : "https://d2-c-b.vercel.app/api/student-attendance/summary";

      const res = await axios.get(endpoint, { params });

      let filteredData = res.data.data || [];

      if (selectedClass) {
        filteredData = filteredData.filter(
          (student) =>
            student.studentClass === selectedClass ||
            student.class === selectedClass
        );
      }

      if (selectedSection) {
        filteredData = filteredData.filter(
          (student) =>
            student.studentSection === selectedSection ||
            student.section === selectedSection
        );
      }

      setAttendances(filteredData);
      setTotalPages(Math.ceil(filteredData.length / 15) || 1);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("No records found");
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (viewMode !== "monthly") {
      toast.error("Sharing is only available in monthly view");
      return;
    }

    if (attendances.length === 0) {
      toast.error("No data available to share");
      return;
    }

    try {
      let title = "Student Attendance Report";
      if (selectedClass) {
        title += ` for Class ${selectedClass}`;
        if (selectedSection) {
          title += `-${selectedSection}`;
        }
      }

      const monthName = new Date(0, monthFilter - 1).toLocaleString("default", {
        month: "long",
      });
      title += ` for ${monthName} ${yearFilter}`;

      const rows = attendances.map((record) => {
        const name = record.name || record.student?.name || "";
        const rollNumber =
          record.rollNumber || record.student?.rollNumber || "";
        const present = record.presentCount || 0;
        const absent = record.absentCount || 0;
        const total = present + absent;

        return {
          name,
          rollNumber,
          present,
          absent,
          total,
        };
      });

      const lines = ["Name,Roll Number,Present,Absent,Total Days"];

      rows.forEach((row) => {
        lines.push(
          `${row.name},${row.rollNumber},${row.present},${row.absent},${row.total}`
        );
      });

      const csvLines = lines.map((line) => line.split(","));
      const colWidths = [];

      csvLines[0].forEach((_, colIndex) => {
        colWidths.push(
          Math.max(
            ...csvLines.map((row) => (row[colIndex] || "").toString().length)
          )
        );
      });

      const formatRow = (row) =>
        row
          .map((cell, i) => (cell || "").toString().padEnd(colWidths[i]))
          .join("  ");

      const formattedTable = csvLines.map(formatRow).join("\n");

      const message =
        `${title}\n\n` +
        "```" +
        `\n${formattedTable}\n` +
        "```";

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } catch (error) {
      console.error("Error sharing data:", error);
      toast.error("Failed to share data");
    }
  };

  const exportToCSV = () => {
    if (viewMode !== "monthly") {
      toast.error("Export is only available in monthly view");
      return;
    }

    if (attendances.length === 0) {
      toast.error("No data available to export");
      return;
    }

    try {
      const headers = [
        "Name",
        "Roll Number",
        "Class",
        "Section",
        "Present",
        "Absent",
        "Total Days",
      ];
      const csvRows = [headers];

      attendances.forEach((record) => {
        const name = record.name || record.student?.name || "";
        const rollNumber =
          record.rollNumber || record.student?.rollNumber || "";
        const className =
          record.studentClass || record.class || selectedClass || "";
        const section =
          record.studentSection || record.section || selectedSection || "";
        const present = record.presentCount || 0;
        const absent = record.absentCount || 0;
        const total = present + absent;

        csvRows.push([
          name,
          rollNumber,
          className,
          section,
          present,
          absent,
          total,
        ]);
      });

      const csvContent = csvRows
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell
            )
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      let filename = "student_attendance";
      if (selectedClass) {
        filename += `_class${selectedClass}`;
        if (selectedSection) {
          filename += `_section${selectedSection}`;
        }
      }

      const monthName = new Date(0, monthFilter - 1).toLocaleString("default", {
        month: "short",
      });
      filename += `_${monthName}${yearFilter}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };


  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [
    page,
    dateFilter,
    monthFilter,
    yearFilter,
    viewMode,
    selectedClass,
    selectedSection,
  ]);

  const generateWeeklyReport = async (studentId) => {
    try {
      const today = new Date();

      // Generate list of past 7 calendar days including today
      const pastWeekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        pastWeekDates.push(date);
      }


      // Reverse to make it oldest → newest
      pastWeekDates.reverse();

      // Filter out Sundays
      const validDates = pastWeekDates.filter((date) => date.getDay() !== 0);

      // Start date is the first valid date (earliest day, not Sunday)

      const formattedStartDate = validDates[0].toISOString().split("T")[0];

      toast.loading("Generating report...");

      const response = await axios.get(
        `https://d2-c-b.vercel.app/api/student-attendance/student/weekly-report`,
        {
          params: {
            studentId,
            startDate: formattedStartDate,
          },
          responseType: "json",
        }
      );

      toast.dismiss();

      if (response.data && response.data.success) {

        const { student, reportPeriod, dailyReport, summary } =
          response.data.data;


        let message = `*Weekly Attendance Report*\n\n`;
        message += `*Student:* ${student.name} (${student.rollNumber})\n`;
        message += `*Class:* ${student.class}-${student.section}\n`;
        message += `*Period:* ${reportPeriod.from} to ${reportPeriod.to}\n\n`;

        message += `*Daily Attendance:*\n`;


        // Exclude Sundays from report display
        const filteredReport = dailyReport.filter((day) => {

          const dayDate = new Date(day.date);
          return dayDate.getDay() !== 0;
        });


        filteredReport.forEach((day) => {
          message += `${day.day} (${day.date}): ${day.status}\n`;
        });

        // Count Present/Absent only for non-Sunday days
        const presentCount = filteredReport.filter(
          (d) => d.status === "Present"
        ).length;
        const absentCount = filteredReport.filter(
          (d) => d.status === "Absent"
        ).length;


        message += `\n*Summary:*\n`;
        message += `Present: ${presentCount} days\n`;
        message += `Absent: ${absentCount} days\n`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");

        toast.success("Report shared to WhatsApp");
      } else {
        toast.error("Failed to generate report");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error generating weekly report:", error);
      toast.error("Failed to generate weekly report");
    }
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    const selectedClassObj = assignedClasses.find(
      (cls) => cls.value === newClass
    );
    const sections = selectedClassObj?.sections || [];
    setAvailableSections(sections);
    setSelectedSection(sections.length > 0 ? sections[0].value : "");
    setPage(1);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1);
  };

  const handleMonthChange = (e) => {
    setMonthFilter(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setYearFilter(e.target.value);
    setPage(1);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "daily" ? "monthly" : "daily");
    setPage(1);
  };

  const shareDailyAttendanceReport = () => {
    if (attendances.length === 0) {
      toast.error("No attendance data to share");
      return;
    }

    if (viewMode !== "daily") {
      toast.error("Daily report sharing is only available in daily view");
      return;
    }

    const presentStudents = attendances.filter(
      (record) => record.status === "Present"
    );
    const absentStudents = attendances.filter(
      (record) => record.status === "Absent"
    );

    let message = `*Daily Attendance Report*\n`;
    message += `*Class:* ${selectedClass}${
      selectedSection ? `-${selectedSection}` : ""
    }\n`;
    message += `*Date:* ${new Date(dateFilter).toLocaleDateString()}\n\n`;
    message += `*Total Students:* ${attendances.length}\n`;
    message += `*Present:* ${presentStudents.length}\n`;
    message += `*Absent:* ${absentStudents.length}\n\n`;

    if (presentStudents.length > 0) {
      message += `*Present Students:*\n`;
      presentStudents.forEach((student, index) => {
        message += `${index + 1}. ${
          student.name || student.student?.name
        } (Roll: ${student.rollNumber || student.student?.rollNumber})\n`;
      });
      message += `\n`;
    }

    if (absentStudents.length > 0) {
      message += `*Absent Students:*\n`;
      absentStudents.forEach((student, index) => {
        message += `${index + 1}. ${
          student.name || student.student?.name
        } (Roll: ${student.rollNumber || student.student?.rollNumber})\n`;
      });
    } else {
      message += `*All students are present today!*\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Student Attendance Records
            </h2>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  localStorage.setItem("selectedAttendanceClass", selectedClass);
                  localStorage.setItem(
                    "selectedAttendanceSection",
                    selectedSection
                  );
                  navigate("/manage-attendence-student");
                }}
                className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-700 whitespace-nowrap text-sm sm:text-base"
              >
                Take Attendance
              </button>
              
              {viewMode === "monthly" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-green-700 whitespace-nowrap text-sm sm:text-base"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-green-700 flex items-center gap-1 whitespace-nowrap text-sm sm:text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="flex-shrink-0"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                    <span className="hidden xs:inline">Share</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Class</option>
                  {assignedClasses.map((cls) => (
                    <option key={cls._id || cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={handleSectionChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  disabled={!selectedClass || availableSections.length === 0}
                >
                  <option value="">All Sections</option>
                  {availableSections.map((section) => (
                    <option
                      key={section._id || section.value}
                      value={section.value}
                    >
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date/Month Filters */}
              {viewMode === "daily" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      value={monthFilter}
                      onChange={handleMonthChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "short",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={yearFilter}
                      onChange={handleYearChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="mt-4">
              <button
                onClick={toggleViewMode}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                  viewMode === "daily"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                } font-medium flex items-center gap-1`}
              >
                {viewMode === "daily" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Monthly View
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Daily View
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading attendance...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500">{error}</p>
            </div>
          ) : attendances.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No attendance records available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
               
<thead className="bg-gray-50">
  <tr>
    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      #
    </th>
    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Name
    </th>
    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Roll No
    </th>
    {viewMode === "daily" ? (
      <>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Date
        </th>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Report
        </th>
      </>
    ) : (
      <>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Present
        </th>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Absent
        </th>
        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Total
        </th>
      </>
    )}
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
  {attendances.map((record, index) => (
    <tr key={record._id || index} className="hover:bg-gray-50">
      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
        {(page - 1) * 10 + index + 1}
      </td>
      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {record.name || record.student?.name}
      </td>
      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
        {record.rollNumber || record.student?.rollNumber}
      </td>

      {viewMode === "daily" ? (
        <>
          <td
            className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm ${
              record.status === "Present"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {record.status}
          </td>
          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
            {record.date
              ? new Date(record.date).toLocaleDateString()
              : "-"}
          </td>
          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const studentId = record.student;
                generateWeeklyReport(studentId);
              }}
              className="font-medium"
            >
              Weekly
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-green-600">
            {record.presentCount || 0}
          </td>
          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-red-600">
            {record.absentCount || 0}
          </td>
          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium">
            {(record.presentCount || 0) +
              (record.absentCount || 0)}
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>

                </table>
              </div>


        {viewMode === "daily" && (
          <button
            onClick={shareDailyAttendanceReport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
            Share Daily Report
          </button>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading attendance...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : attendances.length === 0 ? (
          <p className="text-center text-gray-500">
            No attendance records available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left border">#</th>
                  <th className="p-2 text-left border">Name</th>
                  <th className="p-2 text-left border">Roll Number</th>
                  {viewMode === "daily" ? (
                    <>
                      <th className="p-2 text-left border">Status</th>
                      <th className="p-2 text-left border">Date</th>
                    </>
                  ) : (
                    <>
                      <th className="p-2 text-left border">Present</th>
                      <th className="p-2 text-left border">Absent</th>
                      <th className="p-2 text-left border">Total Days</th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((record, index) => (
                  <tr key={record._id || index} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="p-2 border">
                      {record.name || record.student?.name}
                    </td>
                    <td className="p-2 border">
                      {record.rollNumber || record.student?.rollNumber}
                    </td>

                    {viewMode === "daily" ? (
                      <>
                        <td
                          className={`p-2 border ${
                            record.status === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {record.status}
                        </td>
                        <td className="p-2 border">
                          {record.date
                            ? new Date(record.date).toLocaleDateString()
                            : "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-2 border text-green-600">
                          {record.presentCount || 0}
                        </td>
                        <td className="p-2 border text-red-600">
                          {record.absentCount || 0}
                        </td>
                        <td className="p-2 border font-medium">
                          {(record.presentCount || 0) +
                            (record.absentCount || 0)}
                        </td>
                      </>
                    )}
                    <td className="p-2 border">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Use the student field from the record
                          const studentId = record.student;
                          generateWeeklyReport(studentId);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Weekly Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={page === 1}
              >
                Prev
              </button>


                <span className="text-sm sm:text-base text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                    page === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;