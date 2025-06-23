import { useState, useEffect } from "react";
import axios from "axios";

const usePendingAssignments = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const teacherId = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "Teacher" && teacherId) {
      fetchPendingCount();
    }
  }, [teacherId, role]);

  const fetchPendingCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/coordinator-assignment/teacher?teacherId=${teacherId}`
      );
      if (response.data.success) {
        const pending = response.data.data.filter(
          (assignment) => !assignment.actualSubmissionDate
        ).length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error("Error fetching pending assignments:", error);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    // Set up interval to refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 10000);

    return () => clearInterval(interval);
  }, [teacherId, role]);

  return { pendingCount, refreshCount: fetchPendingCount };
};

export default usePendingAssignments;
