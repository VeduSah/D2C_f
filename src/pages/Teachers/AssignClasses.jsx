// import { useEffect, useState } from "react";
// import { MultiSelect } from "react-multi-select-component";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { ColorRing } from "react-loader-spinner";
// const optionsClasses = [
//   { label: "Class Nursery", value: "Nursery" },
//   { label: "Class L.K.G", value: "L.K.G" },
//   { label: "Class U.K.G", value: "U.K.G" },
//   { label: "Class 1", value: "1" },
//   { label: "Class 2", value: "2" },
//   { label: "Class 3", value: "3" },
//   { label: "Class 4", value: "4" },
//   { label: "Class 5", value: "5" },
//   { label: "Class 6", value: "6" },
//   { label: "Class 7", value: "7" },
//   { label: "Class 8", value: "8" },
//   { label: "Class 9", value: "9" },
//   { label: "Class 10", value: "10" },
// ];

// const optionsSection = [
//   { label: "Section A", value: "A" },
//   { label: "Section B", value: "B" },
// ];


// const optionsSubjects = [
//   { label: "Hindi", value: "Hindi" },
//   { label: "English", value: "English" },
//   { label: "General", value: "General" },
//   { label: "Hindi-1", value: "Hindi-1" },
//   { label: "Hindi-2", value: "Hindi-2" },
//   { label: "English-1", value: "English-1" },
//   { label: "English-2", value: "English-2" },
//   { label: "Maths", value: "Maths" },
//   { label: "G.K", value: "G.K" },
//   { label: "Science", value: "Science" },
//   { label: "E.V.S", value: "E.V.S" },
//   { label: "Physics", value: "Physics" },
//   { label: "Chemistry", value: "Chemistry" },
//   { label: "Biology", value: "Biology" },
//   { label: "Geography", value: "Geography" },
//   { label: "History", value: "History" },
//   { label: "Sanskrit", value: "Sanskrit" },
//   { label: "Art", value: "Art" },
//   { label: "Computer", value: "Computer" },
// ];

// const optionsWing = [
//   { label: "Pre-Primary", value: "Nursery,U.K.G,L.K.G" },
//   { label: "Primary", value: "1,2,3,4,5" },
//   { label: "Junior", value: "6,7,8" },
//   { label: "Secondary", value: "9,10" },
//   { label: "Senior Secondary", value: "11,12" },
// ];
// const AssignClasses = () => {
//   const [selectedClasses, setSelectedClasses] = useState([]);
// const [selectedSectionsByClass, setSelectedSectionsByClass] = useState({});
// const [openSections, setOpenSections] = useState({});


//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedWing, setSelectedWing] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [btnDisable, setBtnDisable] = useState(false);
//   const [teachers, setTeachers] = useState(null);
//   const [selectedTeacherId, setSelectedTeacherId] = useState(null);
//   const [roleForRemark, setRoleForRemark] = useState("");


//   // LIST

//   const fetchAllUser = () => {
//     setLoading(true);
//     try {
//       axios
//         .get(`http://localhost:8000/api/user/teacher`)
//         .then((res) => {
//           console.log(res);
//           if (res.data.success) {
//             setLoading(false);
//             setTeachers(res.data.data);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           toast.error(error.response.data.message);
//           setLoading(false);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };
// const [filteredUsers, setFilteredUsers] = useState([]);

// useEffect(() => {
//   if (roleForRemark) {
//     axios
//       .get(`http://localhost:8000/api/user/list-role?role=${roleForRemark}`)
//       .then((res) => {
//         if (res.data.success) {
//           setFilteredUsers(res.data.data);
//           console.log(res.data.data.data)
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to fetch users for selected role.");
//       });
//   }
// }, [roleForRemark]);
// const handleSectionChange = (classValue, selected) => {
//   setSelectedSectionsByClass((prev) => ({
//     ...prev,
//     [classValue]: selected,
//   }));
// };

// const toggleSectionUI = (classValue) => {
//   setOpenSections((prev) => ({
//     ...prev,
//     [classValue]: !prev[classValue],
//   }));
// };

//   useEffect(() => {
//     fetchAllUser();
//   }, []);
//   console.log(selectedWing);
//   const assignClassAndDivision = () => {
//     if (!selectedTeacherId) {
//       toast.error("Please Select Teacher !");
//       return;
//     }
//     if (selectedClasses.length == 0 || selectedSection.length == 0) {
//       toast.error("Please Select Class And Division !");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("assignedClasses", JSON.stringify(selectedClasses));
// const allSelectedSections = Object.entries(selectedSectionsByClass).flatMap(([cls, secs]) =>
//   secs.map((s) => ({ class: cls, section: s.value }))
// );
// formData.append("assignedSections", JSON.stringify(allSelectedSections));

//     formData.append("assignedWings", JSON.stringify(selectedWing));

//     let data = {
//       assignedClasses: selectedClasses,
//       assignedSections: allSelectedSections,

//       assignedWings: selectedWing,
//       assignedSubjects: selectedSubjects,
//     };
//     try {
//       axios
//         .put(
//           `http://localhost:8000/api/user/teacher/${selectedTeacherId}`,
//           data
//         )
//         .then((res) => {
//           console.log(res);
//           if (res.data.success) {
//             setBtnDisable(false);
//             toast.success("Teacher Updated Successfully !");

//             fetchAllUser();
//             setSelectedClasses([]);
//             setSelectedSection([]);
//             setSelectedWing([]);
//             setSelectedSubjects([]);
//             setSelectedTeacherId(null);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           toast.error(error.response.data.message);
//           setBtnDisable(false);
//         })
//         .finally(() => {
//           setBtnDisable(false);
//         });
//     } catch (error) {
//       console.log(error);
//       setBtnDisable(false);
//     }
//   };
//   const setUpdateUserData = (data) => {
//     setSelectedClasses(data.assignedClasses);
//     setSelectedSection(data.assignedSections);
//     setSelectedWing(data.assignedWings);
//     setSelectedTeacherId(data._id);
//     setSelectedSubjects(data.assignedSubjects);
//   };
//   return (
//     <>
//       <Toaster />
//       <div className="grid md:grid-cols-4 gap-4 ">
          
//             <div className="form-control">
//   <label className="label">
//     <span className="label-text">Select Role</span>
//   </label>
//   <select
//     value={roleForRemark}
//     onChange={(e) => setRoleForRemark(e.target.value)}
//     className="select select-bordered border-gray-300"
//   >
//     <option value="" disabled>Select Role</option>
//     <option value="Teacher">Teacher</option>
//     <option value="Senior Coordinator">Senior Coordinator</option>
//     <option value="Junior Coordinator">Junior Coordinator</option>
//   </select>
// </div>

//         {/* <div className="form-control">
//           <label className="label">
//             <span className="label-text">Select Teacher/Coordinator</span>
//           </label>
//           <select
//             value={selectedTeacherId}
//             onChange={(e) => setSelectedTeacherId(e.target.value)}
//             className=" select select-bordered border-gray-300"
//           >
//             <option value="" selected disabled>
//               Select Teacher
//             </option>
//             {teachers?.map((teacher) => (
//               <>
//                 <option value={teacher._id}>{teacher.name}</option>
//               </>
//             ))}
//           </select>
//         </div> */}
// {roleForRemark && (
//   <div className="form-control">
//     <label className="label">
//       <span className="label-text">
//         Select {
//           roleForRemark === "Teacher"
//             ? "Teacher"
//             : roleForRemark === "Senior Coordinator"
//             ? "Senior Coordinator"
//             : roleForRemark === "Junior Coordinator"
//             ? "Junior Coordinator"
//             : ""
//         }
//       </span>
//     </label>
// <select
//   value={selectedTeacherId || ""}
//   onChange={(e) => setSelectedTeacherId(e.target.value)}
//   className="select select-bordered border-gray-300"
// >
//   <option value="" disabled>
//     Select {roleForRemark}
//   </option>
//   {filteredUsers.map((user) => (
//     <option key={user._id} value={user._id}>
//       {user.name}
//     </option>
//   ))}
// </select>

//   </div>
// )}

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Select Classes To Assign</span>
//           </label>
//           <MultiSelect
//             className="rounded-md p-1"
//             options={optionsClasses}
//             value={selectedClasses}
//             onChange={setSelectedClasses}
//             labelledBy="Select Classes To Assign"
//           />
//         </div>

//        {selectedClasses.map((cls) => (
//   <div key={cls.value} className="form-control border p-2 rounded-md bg-gray-50 mt-2">
//     <div
//       onClick={() => toggleSectionUI(cls.value)}
//       className="cursor-pointer flex justify-between items-center"
//     >
//       <label className="label">
//         <span className="label-text font-medium">{cls.label} - Sections</span>
//       </label>
//       <span>{openSections[cls.value] ? "▲" : "▼"}</span>
//     </div>
//     {openSections[cls.value] && (
//       <MultiSelect
//         className="rounded-md p-1"
//         options={optionsSection}
//         value={selectedSectionsByClass[cls.value] || []}
//         onChange={(selected) => handleSectionChange(cls.value, selected)}
//         labelledBy={`Select sections for ${cls.label}`}
//       />
//     )}
//   </div>
// ))}

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Select Subjects To Assign</span>
//           </label>
//           <MultiSelect
//             className="rounded-md p-1"
//             options={optionsSubjects}
//             value={selectedSubjects}
//             onChange={setSelectedSubjects}
//             labelledBy="Select Subjects To Assign"
//           />
//         </div>
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Select Wing To Assign</span>
//           </label>
//           <MultiSelect
//             className="rounded-md p-1"
//             options={optionsWing}
//             value={selectedWing}
//             onChange={setSelectedWing}
//             labelledBy="Select Wings To Assign"
//           />
//         </div>
//       </div>
//       <div className="form-control mt-6 w-fit">
//         <button
//           onClick={assignClassAndDivision}
//           disabled={btnDisable}
//           className="btn btn-neutral "
//         >
//           Assign
//         </button>
//       </div>
//       <>
//         <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
//           {!loading ? (
//             <>
//               {teachers ? (
//                 <>
//                   {" "}
//                   <table className="w-full table-auto text-sm text-left">
//                     <thead className="bg-gray-50 text-gray-600 font-medium border-b">
//                       <tr>
//                         <th className="py-3 px-6">Name</th>
//                         <th className="py-3 px-6">Email</th>
//                         <th className="py-3 px-6">Role</th>
//                         {/* <th className="py-3 px-6">Number</th> */}
//                         <th className="py-3 px-6">Assigned Classes</th>
//                         <th className="py-3 px-6">Assigned Sections</th>
//                         <th className="py-3 px-6">Assigned Subjects</th>
//                         <th className="py-3 px-6">Assigned Wings</th>
//                         <th className="py-3 px-6">Status</th>
//                         <th className="py-3 px-6">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-600 divide-y">
//                       {teachers?.map((item, idx) => (
//                         <tr key={item._id}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-3">
//                               <div className="avatar">
//                                 <div className="mask mask-squircle w-12 h-12">
//                                   <img src={item?.avatar?.secure_url} />
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="font-bold">{item.name}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.email}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.role == "Admin" ? (
//                               <span className="badge badge-info badge-md text-white">
//                                 Admin
//                               </span>
//                             ) : item.role == "Teacher" ? (
//                               <span className="badge badge-secondary badge-md text-white">
//                                 Teacher
//                               </span>
//                             ) : item.role == "Senior Coordinator" ? (
//                               <span className="badge bg-red-900 badge-warning badge-md text-white">
//                                Senior Coordinator
//                               </span>
//                             ) : item.role == "Junior Coordinator" ? (
//                               <span className="badge bg-red-500 text-white badge-md">
//   Junior Coordinator
// </span>

//                             ): (
//                               ""
//                             )}
//                           </td>
//                           {/* <td className="px-6 py-4 whitespace-nowrap">
//                             {item.number}
//                           </td> */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item?.assignedClasses ? (
//                               <>
//                                 {item?.assignedClasses.map((res) => (
//                                   <>
//                                     <span className="badge badge-md badge-secondary ml-1">
//                                       {res.value}
//                                     </span>
//                                   </>
//                                 ))}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item?.assignedSections ? (
//                               <>
//                                 {item?.assignedSections.map((res) => (
//                                   <>
//                                     <span className="badge badge-md ml-1 badge-secondary">
//                                       {res.value}
//                                     </span>
//                                   </>
//                                 ))}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item?.assignedSubjects ? (
//                               <>
//                                 {item?.assignedSubjects.map((res) => (
//                                   <>
//                                     <span className="badge badge-md ml-1 badge-secondary">
//                                       {res.value}
//                                     </span>
//                                   </>
//                                 ))}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item?.assignedWings ? (
//                               <>
//                                 {item?.assignedWings.map((res) => (
//                                   <>
//                                     <span className="badge badge-md ml-1 badge-secondary">
//                                       {res.label}
//                                     </span>
//                                   </>
//                                 ))}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>

//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.isActive ? (
//                               <span className="badge badge-success badge-md text-white">
//                                 Active
//                               </span>
//                             ) : (
//                               <span className="badge badge-error text-white">
//                                 In-Active
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <button
//                               onClick={() => setUpdateUserData(item)}
//                               className="btn btn-outline btn-xs"
//                             >
//                               Update
//                             </button>

//                             {/* <button
//                               onClick={() =>
//                                 updateStatus(item._id, item.isActive)
//                               }
//                               className="btn btn-outline btn-xs ml-2"
//                               disabled={btnDisable}
//                             >
//                               {item.isActive !== true ? "Active" : "In-Active"}
//                             </button> */}

//                             {/* {role == "Super_Admin" && (
//                               <button
//                                 onClick={() => handleDeleteModal(item)}
//                                 className="btn btn-error  btn-xs text-white ml-2"
//                               >
//                                 Delete
//                               </button>
//                             )} */}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </>
//               ) : (
//                 <div className="flex justify-center py-4 font-semibold">
//                   No User Data !
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               {" "}
//               <div className="flex items-center justify-center m-auto mt-12">
//                 <ColorRing
//                   visible={true}
//                   height="80"
//                   width="80"
//                   ariaLabel="color-ring-loading"
//                   wrapperStyle={{}}
//                   wrapperClass="color-ring-wrapper"
//                   colors={[
//                     "#e15b64",
//                     "#f47e60",
//                     "#f8b26a",
//                     "#abbd81",
//                     "#849b87",
//                   ]}
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </>
//     </>
//   );
// };

// export default AssignClasses;
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const optionsClasses = [
  { label: "Class Nursery", value: "Nursery" },
  { label: "Class L.K.G", value: "L.K.G" },
  { label: "Class U.K.G", value: "U.K.G" },
  { label: "Class 1", value: "1" },
  { label: "Class 2", value: "2" },
  { label: "Class 3", value: "3" },
  { label: "Class 4", value: "4" },
  { label: "Class 5", value: "5" },
  { label: "Class 6", value: "6" },
  { label: "Class 7", value: "7" },
  { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },
];

const optionsSection = [
  { label: "Section A", value: "A" },
  { label: "Section B", value: "B" },
];

const optionsSubjects = [
  { label: "Hindi", value: "Hindi" },
  { label: "English", value: "English" },
  { label: "General", value: "General" },
  { label: "Hindi-1", value: "Hindi-1" },
  { label: "Hindi-2", value: "Hindi-2" },
  { label: "English-1", value: "English-1" },
  { label: "English-2", value: "English-2" },
  { label: "Maths", value: "Maths" },
  { label: "G.K", value: "G.K" },
  { label: "Science", value: "Science" },
  { label: "E.V.S", value: "E.V.S" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Biology", value: "Biology" },
  { label: "Geography", value: "Geography" },
  { label: "History", value: "History" },
  { label: "Sanskrit", value: "Sanskrit" },
  { label: "Art", value: "Art" },
  { label: "Computer", value: "Computer" },
];

const optionsWing = [
  { label: "Pre-Primary", value: "Nursery,U.K.G,L.K.G" },
  { label: "Primary", value: "1,2,3,4,5" },
  { label: "Junior", value: "6,7,8" },
  { label: "Secondary", value: "9,10" },
  { label: "Senior Secondary", value: "11,12" },
];

const AssignClasses = () => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSectionsByClass, setSelectedSectionsByClass] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedWing, setSelectedWing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [teachers, setTeachers] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [roleForRemark, setRoleForRemark] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Handle class selection change
  const handleClassChange = (selected) => {
    // Remove sections for classes that are no longer selected
    const newSectionsByClass = { ...selectedSectionsByClass };
    const currentClassValues = selected.map((c) => c.value);

    // Remove sections for deselected classes
    Object.keys(newSectionsByClass).forEach((classValue) => {
      if (!currentClassValues.includes(classValue)) {
        delete newSectionsByClass[classValue];
      }
    });

    setSelectedSectionsByClass(newSectionsByClass);
    setSelectedClasses(selected);
  };

  // Handle section selection change for a specific class
  const handleSectionChange = (classValue, selected) => {
    setSelectedSectionsByClass((prev) => ({
      ...prev,
      [classValue]: selected,
    }));
  };

  // Fetch all users
  const fetchAllUser = () => {
    setLoading(true);
    try {
      axios
        .get(`http://localhost:8000/api/user/teacher`)
        .then((res) => {
          if (res.data.success) {
            setTeachers(res.data.data);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter users by role
  useEffect(() => {
    if (roleForRemark) {
      axios
        .get(`http://localhost:8000/api/user/list-role?role=${roleForRemark}`)
        .then((res) => {
          if (res.data.success) {
            setFilteredUsers(res.data.data);
          }
        })
        .catch((err) => {
          toast.error("Failed to fetch users for selected role.");
        });
    }
  }, [roleForRemark]);

  useEffect(() => {
    fetchAllUser();
  }, []);

  const assignClassAndDivision = () => {
    if (!selectedTeacherId) {
      toast.error("Please Select Teacher !");
      return;
    }

    if (selectedClasses.length === 0) {
      toast.error("Please Select At Least One Class!");
      return;
    }

    // Check if all selected classes have at least one section
    const allClassesHaveSections = selectedClasses.every(
      (cls) =>
        selectedSectionsByClass[cls.value] &&
        selectedSectionsByClass[cls.value].length > 0
    );

    if (!allClassesHaveSections) {
      toast.error("Please Select At Least One Section For Each Class!");
      return;
    }

    // Prepare the data for submission
    const assignedClassesWithSections = selectedClasses.map((cls) => ({
      label: cls.label,
      value: cls.value,
      sections: selectedSectionsByClass[cls.value] || [],
    }));

    // Also maintain the flat list of sections for backward compatibility
    const assignedSections = selectedClasses.flatMap((cls) => {
      const sections = selectedSectionsByClass[cls.value] || [];
      return sections.map((sec) => ({
        label: sec.label,
        value: sec.value,
      }));
    });

    const data = {
      assignedClasses: assignedClassesWithSections, // Now includes sections nested within each class
      assignedSections: assignedSections, // Flat list of sections for backward compatibility
      assignedWings: selectedWing,
      assignedSubjects: selectedSubjects,
    };

    setBtnDisable(true);
    axios
      .put(`http://localhost:8000/api/user/teacher/${selectedTeacherId}`, data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Teacher Updated Successfully !");
          fetchAllUser();
          // Reset form
          setSelectedClasses([]);
          setSelectedSectionsByClass({});
          setSelectedWing([]);
          setSelectedSubjects([]);
          setSelectedTeacherId(null);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setBtnDisable(false);
      });
  };

const setUpdateUserData = (data) => {
  // Set the role first
  setRoleForRemark(data.role);
  
  // Set classes
  setSelectedClasses(data.assignedClasses);

  // Convert assignedSections array to the sectionsByClass format
  const sectionsByClass = {};
  
  // First try to get sections from the nested structure if available
  if (data.assignedClasses && data.assignedClasses[0]?.sections) {
    data.assignedClasses.forEach((cls) => {
      if (cls.sections && cls.sections.length > 0) {
        sectionsByClass[cls.value] = cls.sections;
      }
    });
  } 
  // Fallback to the flat assignedSections if no nested sections
  else if (data.assignedSections) {
    data.assignedSections.forEach((item) => {
      if (!sectionsByClass[item.class]) {
        sectionsByClass[item.class] = [];
      }
      sectionsByClass[item.class].push({
        label: `Section ${item.value || item.section}`,
        value: item.value || item.section,
      });
    });
  }

  setSelectedSectionsByClass(sectionsByClass);
  setSelectedWing(data.assignedWings);
  setSelectedTeacherId(data._id);
  setSelectedSubjects(data.assignedSubjects);
};
  return (
    <>
      <Toaster />
      <div className="grid md:grid-cols-4 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Role</span>
          </label>
          <select
            value={roleForRemark}
            onChange={(e) => setRoleForRemark(e.target.value)}
            className="select select-bordered border-gray-300"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Teacher">Teacher</option>
            <option value="Senior Coordinator">Senior Coordinator</option>
            <option value="Junior Coordinator">Junior Coordinator</option>
          </select>
        </div>

        {roleForRemark && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Select{" "}
                {roleForRemark === "Teacher"
                  ? "Teacher"
                  : roleForRemark === "Senior Coordinator"
                  ? "Senior Coordinator"
                  : "Junior Coordinator"}
              </span>
            </label>
            <select
              value={selectedTeacherId || ""}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="select select-bordered border-gray-300"
            >
              <option value="" disabled>
                Select {roleForRemark}
              </option>
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Classes To Assign</span>
          </label>
          <MultiSelect
            className="rounded-md p-1"
            options={optionsClasses}
            value={selectedClasses}
            onChange={handleClassChange}
            labelledBy="Select Classes To Assign"
          />
        </div>

        {/* Render section selectors for each selected class */}
        {selectedClasses.map((cls) => (
          <div
            key={cls.value}
            className="form-control rounded-10px p-[3px] rounded-md "
          >
            <label className="label">
              <span className="label-text font-medium">{cls.label} - Sections</span>
            </label>
            <MultiSelect
              className="rounded-md p-1"
              options={optionsSection}
              value={selectedSectionsByClass[cls.value] || []}
              onChange={(selected) => handleSectionChange(cls.value, selected)}
              labelledBy={`Select sections for ${cls.label}`}
              required
            />
          </div>
        ))}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Subjects To Assign</span>
          </label>
          <MultiSelect
            className="rounded-md p-1"
            options={optionsSubjects}
            value={selectedSubjects}
            onChange={setSelectedSubjects}
            labelledBy="Select Subjects To Assign"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Wing To Assign</span>
          </label>
          <MultiSelect
            className="rounded-md p-1"
            options={optionsWing}
            value={selectedWing}
            onChange={setSelectedWing}
            labelledBy="Select Wings To Assign"
          />
        </div>
      </div>

      <div className="form-control mt-6 w-fit">
        <button
          onClick={assignClassAndDivision}
          disabled={btnDisable}
          className="btn btn-neutral"
        >
          {btnDisable ? "Processing..." : "Assign"}
        </button>
      </div>

      {/* Teacher list table */}
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        {loading ? (
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
        ) : teachers ? (
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Assigned Classes</th>
                {/* <th className="py-3 px-6">Assigned Sections</th> */}
                <th className="py-3 px-6">Assigned Subjects</th>
                <th className="py-3 px-6">Assigned Wings</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {teachers.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item?.avatar?.secure_url} alt="avatar" />
                        </div>
                      </div>
                      <div className="font-bold">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.role === "Admin" ? (
                      <span className="badge badge-info badge-md text-white">
                        Admin
                      </span>
                    ) : item.role === "Teacher" ? (
                      <span className="badge badge-secondary badge-md text-white">
                        Teacher
                      </span>
                    ) : item.role === "Senior Coordinator" ? (
                      <span className="badge bg-red-900 badge-warning badge-md text-white">
                        Senior Coordinator
                      </span>
                    ) : item.role === "Junior Coordinator" ? (
                      <span className="badge bg-red-500 text-white badge-md">
                        Junior Coordinator
                      </span>
                    ) : null}
                  </td>
               <td className="px-6 py-4 whitespace-nowrap">
  {item?.assignedClasses?.length ? (
    item.assignedClasses.map((res) => (
      <div key={res.value}>
        {res.sections?.length > 0 ? (
          res.sections.map((sec) => (
            <span
              key={`${res.value}-${sec.value}`}
              className="badge badge-md badge-secondary ml-1 flex m-[5px]"
            >
              {res.value} - {sec.value}
            </span>
          ))
        ) : (
          <span className="badge badge-md badge-secondary ml-1">
            {res.value}
          </span>
        )}
      </div>
    ))
  ) : (
    "N/A"
  )}
</td>

                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {item?.assignedSections?.length ? (
                      item.assignedSections.map((res, index) => (
                        <span key={index} className="badge badge-md ml-1 badge-secondary">
                          {res.value}
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item?.assignedSubjects?.length ? (
                      item.assignedSubjects.map((res) => (
                        <span key={res.value} className="badge badge-md ml-1 badge-secondary">
                          {res.value}
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item?.assignedWings?.length ? (
                      item.assignedWings.map((res) => (
                        <span key={res.value} className="badge badge-md ml-1 badge-secondary">
                          {res.label}
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isActive ? (
                      <span className="badge badge-success badge-md text-white">
                        Active
                      </span>
                    ) : (
                      <span className="badge badge-error text-white">
                        In-Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setUpdateUserData(item)}
                      className="btn btn-outline btn-xs"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center py-4 font-semibold">
            No User Data !
          </div>
        )}
      </div>
    </>
  );
};

export default AssignClasses;