
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { format, parseISO } from 'date-fns';
// import { useNavigate } from 'react-router-dom';
// const AttendanceByDate = () => {
//     const navigate = useNavigate();
//   // Set default date to today
//   const today = format(new Date(), 'yyyy-MM-dd');
//   const [date, setDate] = useState(today);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAttendance = async (selectedDate) => {
//     if (!selectedDate) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await axios.get('https://d2-c-b.vercel.app/api/teacher-attendance/check/dates', {
//         params: { date: selectedDate }
//       });
//       setAttendanceData(response.data.data);
//       console.log('Attendance Data:', response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch attendance data');
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance(date);
//   }, [date]);

//   const handleDateChange = (e) => {
//     setDate(e.target.value);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Records</h2>
      
//     <div className="flex items-center justify-between mb-6">
//   <div className="flex items-center">
//     <label htmlFor="date" className="mr-3 text-gray-700 font-medium">Select Date:</label>
//     <input
//       type="date"
//       id="date"
//       value={date}
//       onChange={handleDateChange}
//       className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>
  
//   <button
//     onClick={()=>navigate("/manage-attendence-teacher")}
//     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//   >
//     Take Attendance
//   </button>
// </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           <span className="ml-3 text-gray-600">Loading attendance data...</span>
//         </div>
//       ) : attendanceData.length > 0 ? (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">
//             Attendance for {format(parseISO(date), 'MMMM d, yyyy')}
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {attendanceData.map((record) => (
//                   <tr key={record._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {record.teacher?.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {record.teacher?.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         record.status === 'Present' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {record.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {format(parseISO(record.date), 'hh:mm a')}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="py-8 text-center text-gray-500">
//           No attendance records found for this date.
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceByDate;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Optional: if you're using react-router

const AttendanceList = () => {
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

      const res = await axios.get('https://d2-c-b.vercel.app/api/teacher-attendance/pg', {
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
          <h2 className="text-2xl font-bold">Teacher Attendance Records</h2>
          <button
            onClick={() => navigate('/manage-attendence-teacher')}
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

export default AttendanceList;
