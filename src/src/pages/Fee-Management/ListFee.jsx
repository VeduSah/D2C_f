import { useEffect, useRef, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ListFee = () => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState("all");
  const [activeDivision, setActiveDivision] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userData, setUserData] = useState([]);

  const fetchAllUser = () => {
    setLoading(true);
    if (activeClass == "All") {
      setActiveDivision("All");
    }
    try {
      axios
        .get(
          `https://d2-c-b.vercel.app/api/student/filter?studentClass=${activeClass}&studentSection=${activeDivision}&page=${currentPage}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setUserData(res.data.data);
            setTotalPages(res.data.count);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setUserData(null);
          setLoading(false);
          setTotalPages(1);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, [activeClass, activeDivision]);
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
              className={`px-4 py-2 cursor-pointer rounded-md  mx-1 ${
                isFirstPage ? "disabled" : ""
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
                className={`${
                  currentPage === number ? "bg-gray-400 text-white" : ""
                } px-4 py-2 mx-1 rounded-md`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 cursor-pointer mx-1 bg-black rounded-md text-white ${
                isLastPage ? "disabled" : ""
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
  return (
    <>
      <div className="mt-6">
        <div>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/fee-structure")}
          >
            Change Fee Structure
          </button>
        </div>
      </div>{" "}
      <>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <div role="tablist" className="tabs tabs-boxed flex-wrap flex">
            <a
              onClick={() => setActiveClass("all")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "all" ? " tab-active" : ""
              }`}
            >
              All
            </a>
            <a
              onClick={() => setActiveClass("L.K.G")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "L.K.G" ? " tab-active" : ""
              }`}
            >
              L.K.G
            </a>
            <a
              onClick={() => setActiveClass("U.K.G")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "U.K.G" ? " tab-active" : ""
              }`}
            >
              U.K.G
            </a>
            <a
              onClick={() => setActiveClass("Nursery")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "Nursery" ? " tab-active" : ""
              }`}
            >
              Nursery
            </a>
            <a
              onClick={() => setActiveClass(1)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "1" ? " tab-active" : ""
              }`}
            >
              Class 1
            </a>
            <a
              onClick={() => setActiveClass(2)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "2" ? " tab-active" : ""
              }`}
            >
              Class 2
            </a>
            <a
              onClick={() => setActiveClass(3)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "3" ? " tab-active" : ""
              }`}
            >
              Class 3
            </a>
            <a
              onClick={() => setActiveClass(4)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "4" ? " tab-active" : ""
              }`}
            >
              Class 4
            </a>
            <a
              onClick={() => setActiveClass(5)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "5" ? " tab-active" : ""
              }`}
            >
              Class 5
            </a>
            <a
              onClick={() => setActiveClass(6)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "6" ? " tab-active" : ""
              }`}
            >
              Class 6
            </a>
            <a
              onClick={() => setActiveClass(7)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "7" ? " tab-active" : ""
              }`}
            >
              Class 7
            </a>
            <a
              onClick={() => setActiveClass(8)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "8" ? " tab-active" : ""
              }`}
            >
              Class 8
            </a>
            <a
              onClick={() => setActiveClass(9)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "9" ? " tab-active" : ""
              }`}
            >
              Class 9
            </a>
            <a
              onClick={() => setActiveClass(10)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "10" ? " tab-active" : ""
              }`}
            >
              Class 10
            </a>
            <a
              onClick={() => setActiveClass(11)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "11" ? " tab-active" : ""
              }`}
            >
              Class 11
            </a>
            <a
              onClick={() => setActiveClass(12)}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeClass == "12" ? " tab-active" : ""
              }`}
            >
              Class 12
            </a>
          </div>

          <div role="tablist" className="tabs tabs-boxed">
            <a
              onClick={() => setActiveDivision("all")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeDivision == "all" ? " tab-active" : ""
              }`}
            >
              All
            </a>
            <a
              onClick={() => setActiveDivision("A")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeDivision == "A" ? " tab-active" : ""
              }`}
            >
              A
            </a>
            <a
              onClick={() => setActiveDivision("B")}
              role="tab"
              className={`tab min-w-[7rem] ${
                activeDivision == "B" ? " tab-active" : ""
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

          {!loading ? (
            <>
              {userData ? (
                <>
                  {" "}
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Roll Number</th>
                        <th className="py-3 px-6">Class-Section</th>

                        <th className="py-3 px-6">Contact</th>
                        <th className="py-3 px-6">Gender</th>
                        <th className="py-3 px-6">Registration No</th>

                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {userData?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img src={item.studentAvatar?.secure_url} />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.studentClass} - {item.studentSection}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.contactNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.gender}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.registrationNumber}
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
                              onClick={() => navigate(`/take-fees/${item._id}`)}
                              className="btn btn-outline btn-xs"
                            >
                              Take Fee
                            </button>
                            <button
                              onClick={() => navigate(`/view-fees/${item._id}`)}
                              className="btn btn-info ml-2 btn-xs text-white"
                            >
                              View Fee
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="flex justify-center py-4 font-semibold">
                  No User Data !
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
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            </>
          )}
        </div>
        {renderPagination()}
      </>
    </>
  );
};

export default ListFee;
