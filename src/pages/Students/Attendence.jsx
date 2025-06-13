import React, { useState } from 'react';

const Attendance = () => {
  const students = [
    { id: 447, studentId: '447', name: 'Summash Nguyen' },
    { id: 46, studentId: '177', name: 'Brooklyn Burmesei' },
    { id: 363, studentId: '185', name: 'Durrell Steward' },
    { id: 606, studentId: '816', name: 'Marvin McKinsey' },
    { id: 443, studentId: '429', name: 'Cameron Williamson' },
    { id: 60365, studentId: '154', name: 'Cody Fisher' },

  ];

  // Track attendance per student
  const [attendanceStatus, setAttendanceStatus] = useState({});
  // Track notes per student
  const [notes, setNotes] = useState({});

  // Update attendance status for student
  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Update note for student
  const handleNoteChange = (studentId, value) => {
    setNotes((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">B6</h1>
      </header>

      {/* Top Navigation */}
      <div className="py-4 border-y border-gray-200 my-4 flex flex-wrap justify-around gap-4">
        {['Trading', 'Progress', 'Section', 'Sun Mon Tue Wed Thu Fri Sat'].map((item, index) => (
          <span key={index} className="font-semibold text-gray-700">
            {item}
          </span>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="my-6 overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 items-center bg-gray-50 p-3 rounded-t-lg">
          <span className="font-semibold text-gray-700"></span>
          <span className="font-semibold text-gray-700">Student ID</span>
          <span className="font-semibold text-gray-700">Name</span>
          <span className="font-semibold text-gray-700">Present</span>
          <span className="font-semibold text-gray-700">Absent</span>
          <span className="font-semibold text-gray-700">Leave</span>
          <span className="font-semibold text-gray-700">Note</span>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-gray-200">
          {students.map((student) => {
            const selectedStatus = attendanceStatus[student.studentId] || '';
            const note = notes[student.studentId] || '';

            return (
              <div
                key={student.id}
                className="grid grid-cols-7 gap-4 items-center p-3 hover:bg-gray-50"
              >
                <span className="text-gray-600">{student.id}</span>
                <span className="text-gray-600">{student.studentId}</span>
                <span className="text-gray-800">{student.name}</span>

                {/* Present Radio */}
                <label className="flex justify-center cursor-pointer">
                  <input
                    type="radio"
                    name={`attendance-${student.studentId}`}
                    value="present"
                    checked={selectedStatus === 'present'}
                    onChange={() => handleStatusChange(student.studentId, 'present')}
                 
                  />
                  <span
                    className={`text-xl ${
                      selectedStatus === 'present' ? 'text-green-600 font-bold' : 'text-gray-400'
                    }`}
                  >
                    ✅
                  </span>
                </label>

                {/* Absent Radio */}
                <label className="flex justify-center cursor-pointer">
                  <input
                    type="radio"
                    name={`attendance-${student.studentId}`}
                    value="absent"
                    checked={selectedStatus === 'absent'}
                    onChange={() => handleStatusChange(student.studentId, 'absent')}
                    
                  />
                  <span
                    className={`text-xl ${
                      selectedStatus === 'absent' ? 'text-red-600 font-bold' : 'text-gray-400'
                    }`}
                  >
                    ❌
                  </span>
                </label>

                {/* Leave Radio */}
                <label className="flex justify-center cursor-pointer">
                  <input
                    type="radio"
                    name={`attendance-${student.studentId}`}
                    value="leave"
                    checked={selectedStatus === 'leave'}
                    onChange={() => handleStatusChange(student.studentId, 'leave')}
           
                  />
                  <span
                    className={`text-xl ${
                      selectedStatus === 'leave' ? 'text-yellow-600 font-bold' : 'text-gray-400'
                    }`}
                  >
                    🕒
                  </span>
                </label>

                {/* Note Input */}
                <input
                  type="text"
                  placeholder="Add note"
                  value={note}
                  onChange={(e) => handleNoteChange(student.studentId, e.target.value)}
                  className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
