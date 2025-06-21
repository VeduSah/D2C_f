// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeacherAttendance = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [attendanceStatus, setAttendanceStatus] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [existingAttendance, setExistingAttendance] = useState([]);
//   const [showExistingModal, setShowExistingModal] = useState(false);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const response = await axios.get('https://d2-c-b.vercel.app/api/user/all'); // Update with your teacher API endpoint
//        const filteredTeachers = response.data.data.filter(teacher => teacher.role === 'Teacher');
//         setTeachers(filteredTeachers);
//       } catch (error) {
//         console.error('Error fetching teachers:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTeachers();
//   }, []);

//   useEffect(() => {
//     const checkExistingAttendance = async () => {
//       try {
//         const dateStr = selectedDate.toISOString().split('T')[0];
//         const response = await axios.get(`https://d2-c-b.vercel.app/api/teacher-attendance/check/date?date=${dateStr}`);
//         setExistingAttendance(response.data);
//       } catch (error) {
//         console.error('Error checking existing attendance:', error);
//       }
//     };

//     checkExistingAttendance();
//   }, [selectedDate]);

//   const handleStatusChange = (teacherId, status) => {
//     setAttendanceStatus(prev => ({
//       ...prev,
//       [teacherId]: status
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
//     if (existingAttendance.length > 0) {
//       setShowExistingModal(true);
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitMessage('');

//     try {
//       const submissionPromises = teachers.map(teacher => {
//         const status = attendanceStatus[teacher._id] || 'Absent';

//         const attendanceRecord = {
//           teacher: teacher._id,
//           name: teacher.name,
//           email: teacher.email,
//           status: status,
//           date: selectedDate,
//         };

//         return axios.post('https://d2-c-b.vercel.app/api/teacher-attendance', attendanceRecord, {
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
//       if (error.response?.data?.message?.includes("already exists")) {
//         setShowExistingModal(true);
//       } else {
//         setSubmitMessage('Failed to submit attendance. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

// const handleConfirmSubmit = async () => {
//   setShowExistingModal(false);
//   setIsSubmitting(true);
//   setSubmitMessage('');

//   try {
//     const submissionPromises = teachers.map(teacher => {
//       const status = attendanceStatus[teacher._id] || 'Absent';

//       const attendanceRecord = {
//         teacher: teacher._id,
//         status,
//         date: selectedDate,
//       };

//       return axios.put('https://d2-c-b.vercel.app/api/teacher-attendance/update', attendanceRecord, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//     });

//     await Promise.all(submissionPromises);
//     setSubmitMessage('Attendance updated successfully!');
//     setAttendanceStatus({});
//   } catch (error) {
//     console.error('Error updating attendance:', error);
//     setSubmitMessage('Failed to update attendance. Please try again.');
//   } finally {
//     setIsSubmitting(false);
//   }
// };

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
//           <p className="text-gray-600">Loading teachers data...</p>
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
//         <h1 className="text-3xl font-bold text-gray-800">Teacher Attendance</h1>
//       </header>

//       <div className="py-4 border-y border-gray-200 my-4 flex flex-wrap justify-around gap-4 items-center">
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
//         <div className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-3 rounded-t-lg">
//           <span className="font-semibold text-gray-700">Teacher Name</span>
//           <span className="font-semibold text-gray-700">Email</span>
//           <span className="font-semibold text-gray-700 text-center">Present</span>
//           <span className="font-semibold text-gray-700 text-center">Absent</span>
//         </div>

//         <div className="divide-y divide-gray-200">
//           {teachers.map((teacher) => {
//             const selectedStatus = attendanceStatus[teacher._id] || '';
//             const existingRecord = existingAttendance.find(a => a.teacher === teacher._id);
            
//             return (
//               <div
//                 key={teacher._id}
//                 className="grid grid-cols-5 gap-4 items-center p-3 hover:bg-gray-50"
//               >
//                 <span className="text-gray-600">{teacher.name}</span>
//                 <span className="text-gray-600">{teacher.email}</span>

//                 <label className="flex items-center justify-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`attendance-${teacher._id}`}
//                     value="Present"
//                     checked={selectedStatus === 'Present' || (existingRecord && existingRecord.status === 'Present' && !selectedStatus)}
//                     onChange={() => handleStatusChange(teacher._id, 'Present')}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className={`text-xl ${(selectedStatus === 'Present' || (existingRecord && existingRecord.status === 'Present' && !selectedStatus)) ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
//                     P
//                   </span>
//                 </label>

//                 <label className="flex items-center justify-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`attendance-${teacher._id}`}
//                     value="Absent"
//                     checked={selectedStatus === 'Absent' || (existingRecord && existingRecord.status === 'Absent' && !selectedStatus)}
//                     onChange={() => handleStatusChange(teacher._id, 'Absent')}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className={`text-xl ${(selectedStatus === 'Absent' || (existingRecord && existingRecord.status === 'Absent' && !selectedStatus)) ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
//                     A
//                   </span>
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       </div>
// <div className="mt-4 text-sm text-gray-600">
//   <p><strong>Note:</strong> If neither <span className="text-green-600 font-semibold">P</span> nor <span className="text-red-600 font-semibold">A</span> is selected, the teacher will be treated as <span className="text-red-600 font-semibold">Absent</span> by default.</p>
// </div>

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

// export default TeacherAttendance;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const TeacherAttendance = () => {
const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get('https://d2-c-b.vercel.app/api/user/all');
        // Filter teachers if needed, assuming the API returns all users
        const filteredTeachers = res.data.data.filter(teacher => teacher.role === 'Teacher');
        setTeachers(filteredTeachers);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        toast.error('Error fetching teachers. Please try again later.');
      }
    };

    fetchTeachers();
  }, []);

  const handleStatusChange = (teacherId, status) => {
    setAttendanceStatus(prev => ({ ...prev, [teacherId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Please select a date before submitting.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    let updateCount = 0;
    let createCount = 0;
    let errorCount = 0;

    const submissionPromises = teachers.map(async (teacher) => {
      const status = attendanceStatus[teacher._id] || 'Absent';

      try {
        // Try updating
        await axios.put('https://d2-c-b.vercel.app/api/teacher-attendance/update', {
          teacher: teacher._id,
          date: selectedDate,
          status
        });
        updateCount++;
        return `${teacher.name} updated`;
      } catch (error) {
        if (error.response?.status === 404) {
          // Create if not found
          await axios.post('https://d2-c-b.vercel.app/api/teacher-attendance', {
            teacher: teacher._id,
            name: teacher.name,
            email: teacher.email,
            status,
            date: selectedDate
          });
          createCount++;
          return `${teacher.name} created`;
        } else {
          errorCount++;
          return `${teacher.name} failed`;
        }
      }
    });

    try {
      const results = await Promise.all(submissionPromises);
      // setMessage(`Attendance processed: ${results.join(', ')}`);
      
      // Show summary toasts
      if (updateCount > 0) {
        toast.success(`${updateCount} attendance records updated successfully!`);
      }
      if (createCount > 0) {
        toast.success(`${createCount} attendance records created successfully!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} records failed to process`);
      }

    } catch (err) {
      console.error(err);
      toast.error('Error submitting attendance. Please try again.');
      setMessage('Error submitting attendance. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
          },
        }}
      />
      
      <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-lg">
       <div className="flex justify-end mb-4"> <button
            onClick={() => navigate('/display-attendence')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
         Back
          </button></div>
        <h2 className="text-2xl font-bold mb-4 text-center">Teacher Attendance</h2>

        <label className="block text-gray-700 mb-2">Select Date:</label>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded w-full mb-4"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {teachers.length === 0 ? (
          <p className="text-gray-500">Loading teachers...</p>
        ) : (
          teachers.map((teacher,index) => (
            <div key={teacher._id} className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="text-gray-800 w-1/2">
           
           <span className="font-medium text-gray-600 mr-2">{index + 1}.</span> {teacher.name}

              </div>
              <div className="flex gap-4 w-1/2 justify-end">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`attendance-${teacher._id}`}
                    value="Present"
                    checked={attendanceStatus[teacher._id] === 'Present'}
                    onChange={() => handleStatusChange(teacher._id, 'Present')}
                    className="accent-green-500"
                  />
                  <span className="text-sm">P</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`attendance-${teacher._id}`}
                    value="Absent"
                    checked={attendanceStatus[teacher._id] === 'Absent' || !attendanceStatus[teacher._id]}
                    onChange={() => handleStatusChange(teacher._id, 'Absent')}
                    className="accent-red-500"
                  />
                  <span className="text-sm">A</span>
                </label>
              </div>
            </div>
          ))
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isSubmitting || !selectedDate}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
        </button>

        {message && (
          <div className="mt-4 p-2 text-center text-sm font-medium text-green-600 bg-green-100 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;