// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [existingAttendance, setExistingAttendance] = useState([]);
//   const [showExistingModal, setShowExistingModal] = useState(false);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get('https://d2-c-b.vercel.app/api/student/all');
//         setStudents(response.data.data);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     const checkExistingAttendance = async () => {
//       try {
//         const dateStr = selectedDate.toISOString().split('T')[0];
//         const response = await axios.get(`https://d2-c-b.vercel.app/api/attendance/check?date=${dateStr}`);
//         setExistingAttendance(response.data);
//       } catch (error) {
//         console.error('Error checking existing attendance:', error);
//       }
//     };

//     checkExistingAttendance();
//   }, [selectedDate]);

//   const handleStatusChange = (studentId, status) => {
//     setAttendanceStatus(prev => ({
//       ...prev,
//       [studentId]: status
//     }));
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const handleSubmit = async () => {
//     // Check if any attendance exists for the selected date
//     if (existingAttendance.length > 0) {
//       setShowExistingModal(true);
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitMessage('');

//     try {
//       const submissionPromises = students.map(student => {
//         const status = attendanceStatus[student._id] || 'absent';

//         const attendanceRecord = {
//           student: student._id,
//           rollNumber: student.rollNumber,
//           name: student.name,
//           studentClass: student.studentClass,
//           studentSection: student.studentSection,
//           present: status === 'present',
//           absent: status === 'absent',
//           date: selectedDate,
//         };

//         return axios.post('https://d2-c-b.vercel.app/api/attendance/create', attendanceRecord, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
//       });

//       await Promise.all(submissionPromises);

//       setSubmitMessage('Attendance submitted successfully!');
//       setAttendanceStatus({});
//     } catch (error) {
//       console.error('Error submitting attendance:', error);
//       if (error.response && error.response.data && error.response.data.message.includes("already exists")) {
//         setShowExistingModal(true);
//       } else {
//         setSubmitMessage('Failed to submit attendance. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleConfirmSubmit = async () => {
//     setShowExistingModal(false);
//     setIsSubmitting(true);
//     setSubmitMessage('');

//     try {
//       const submissionPromises = students.map(student => {
//         const status = attendanceStatus[student._id] || 'absent';

//         const attendanceRecord = {
//           student: student._id,
//           rollNumber: student.rollNumber,
//           name: student.name,
//           studentClass: student.studentClass,
//           studentSection: student.studentSection,
//           present: status === 'present',
//           absent: status === 'absent',
//           date: selectedDate,
//         };

//         // For existing records, we should use update instead of create
//         return axios.put(`https://d2-c-b.vercel.app/api/attendance/update`, attendanceRecord, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
//       });

//       await Promise.all(submissionPromises);

//       setSubmitMessage('Attendance updated successfully!');
//       setAttendanceStatus({});
//     } catch (error) {
//       console.error('Error updating attendance:', error);
//       setSubmitMessage('Failed to update attendance. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     let timer;
//     if (submitMessage.includes('success')) {
//       timer = setTimeout(() => {
//         setSubmitMessage('');
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [submitMessage]);

//   if (isLoading) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-600">Loading students data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       {/* Existing Attendance Modal */}
//       {showExistingModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Already Exists</h3>
//             <p className="text-gray-600 mb-4">
//               Attendance records already exist for {formatDate(selectedDate)}. Do you want to update them?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowExistingModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Update Attendance
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <header className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
//       </header>

//       <div className="py-4 border-y border-gray-200 my-4 flex flex-wrap justify-around gap-4 items-center">
//         <span className="font-semibold text-gray-700">Class: Nursery</span>
//         <span className="font-semibold text-gray-700">Section: A</span>

//         <div className="relative">
//           <input
//             type="date"
//             value={selectedDate.toISOString().split('T')[0]}
//             onChange={(e) => setSelectedDate(new Date(e.target.value))}
//             className="appearance-none border border-gray-300 rounded-md py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <span className="ml-2 font-semibold text-gray-700">
//             {formatDate(selectedDate)}
//           </span>
//         </div>
//       </div>

//       {existingAttendance.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
//           <p>Note: Attendance records already exist for this date. Submitting will update existing records.</p>
//         </div>
//       )}

//       <div className="my-6 overflow-x-auto">
//         <div className="grid grid-cols-6 gap-4 items-center bg-gray-50 p-3 rounded-t-lg">
//           <span className="font-semibold text-gray-700">Roll Number</span>
//           <span className="font-semibold text-gray-700">Student Name</span>
//           <span className="font-semibold text-gray-700">Class</span>
//           <span className="font-semibold text-gray-700 text-center">Present</span>
//           <span className="font-semibold text-gray-700 text-center">Absent</span>
//         </div>

//         <div className="divide-y divide-gray-200">
//           {students.map((student) => {
//             const selectedStatus = attendanceStatus[student._id] || '';
//             const existingRecord = existingAttendance.find(a => a.student === student._id);
            
//             return (
//               <div
//                 key={student._id}
//                 className="grid grid-cols-6 gap-4 items-center p-3 hover:bg-gray-50"
//               >
//                 <span className="text-gray-600">{student.rollNumber}</span>
//                 <span className="text-gray-600">{student.name}</span>
//                 <span className="text-gray-800">{student.studentClass}</span>

//                 <label className="flex items-center justify-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`attendance-${student._id}`}
//                     value="present"
//                     checked={selectedStatus === 'present' || (existingRecord && existingRecord.present && !selectedStatus)}
//                     onChange={() => handleStatusChange(student._id, 'present')}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className={`text-xl ${(selectedStatus === 'present' || (existingRecord && existingRecord.present && !selectedStatus)) ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
//                     P
//                   </span>
//                 </label>

//                 <label className="flex items-center justify-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`attendance-${student._id}`}
//                     value="absent"
//                     checked={selectedStatus === 'absent' || (existingRecord && existingRecord.absent && !selectedStatus)}
//                     onChange={() => handleStatusChange(student._id, 'absent')}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className={`text-xl ${(selectedStatus === 'absent' || (existingRecord && existingRecord.absent && !selectedStatus)) ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
//                     A
//                   </span>
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="mt-6 flex justify-between items-center">
//         <div>
//           {submitMessage && (
//             <p className={`text-sm ${submitMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
//               {submitMessage}
//             </p>
//           )}
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Attendance;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Optional: if you're using react-router

const StudentList = () => {
  const [attendances, setAttendances] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Optional, for navigation

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const params = {
        page,
      };
      if (dateFilter) {
        params.date = dateFilter;
      }

      const res = await axios.get('https://d2-c-b.vercel.app/api/student-attendance/pg', {
        params,
      });

      setAttendances(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, dateFilter]);

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1); // Reset to page 1 on new filter
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white shadow p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Student Attendance Records</h2>
          <button
            onClick={() => navigate('/manage-attendence-student')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Attendance Page
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Search by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            className="border border-gray-300 p-2 rounded w-full max-w-xs"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading attendance...</p>
        ) : attendances.length === 0 ? (
          <p className="text-center text-gray-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left border">#</th>
                  <th className="p-2 text-left border">Name</th>
                  <th className="p-2 text-left border">Email</th>
                  <th className="p-2 text-left border">Status</th>
                  <th className="p-2 text-left border">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((record, index) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{(page - 1) * 10 + index + 1}</td>
                    <td className="p-2 border">{record.name}</td>
                    <td className="p-2 border">{record.email}</td>
                    <td className={`p-2 border ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.status}
                    </td>
                    <td className="p-2 border">{new Date(record.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={page === 1}
              >
                Prev
              </button>

              <span className="text-gray-700">Page {page} of {totalPages}</span>

              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
