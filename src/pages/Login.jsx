import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please Input Valid Details !", { id: "Login" });
      return;
    }
    try {
      setBtnDisable(true);
      let data = {
        email: email,
        password: password,
      };
      axios
        .post(
          `https://d2-c-portal-backend-master.vercel.app/api/user/login`,
          data
        )
        .then((res) => {
          if (res.data.success) {
            if (!res.data.isActive) {
              toast.error("This user is currently In-Active", { id: "wede" });
              setBtnDisable(false);
              return;
            }
            console.log(res.data);
            // return;
            localStorage.setItem("User", JSON.stringify(res.data));
            localStorage.setItem("currentUser", res.data.success);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("class", res.data.class);
            localStorage.setItem("division", res.data.division);
            localStorage.setItem("id", res.data._id);
            localStorage.setItem("name", res.data.name);
            {
              res.data.assignedClasses
                ? localStorage.setItem(
                    "assignedClasses",
                    JSON.stringify(res.data.assignedClasses)
                  )
                : "";
            }
            {
              res.data.assignedSections
                ? localStorage.setItem(
                    "assignedSections",
                    JSON.stringify(res.data.assignedSections)
                  )
                : "";
            }
            {
              res.data.assignedWings
                ? localStorage.setItem(
                    "assignedWings",
                    JSON.stringify(res.data.assignedWings)
                  )
                : "";
            }
            {
              res.data.assignedSubjects
                ? localStorage.setItem(
                    "assignedSubjects",
                    JSON.stringify(res.data.assignedSubjects)
                  )
                : "";
            }
            localStorage.setItem("id", res.data._id);
            toast.success("Logged In Successfully !");

            setTimeout(() => {
              setCurrentUser(true);
              navigate("/", { replace: true });
            }, 200);
            setBtnDisable(false);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setBtnDisable(false);
        });
    } catch (error) {
      console.log(error);
      setBtnDisable(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    } else return;
  }, [currentUser]);
  return (
    <>
      <Toaster />
      <div
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
        className="hero min-h-screen bg-base-200"
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content  max-w-5xl  flex-col md:gap-16 lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl w-full font-bold text-white">
              D2C School Portal
            </h1>
            {/* <p className="py-6 text-white">Login Now</p> */}
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className="input input-bordered"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <button
                  className=" relative  right-[10px] top-[-30px] flex justify-end"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <>
                      <IoIosEye />
                    </>
                  ) : (
                    <>
                      <IoIosEyeOff />
                    </>
                  )}
                </button> */}
              </div>

              <div className="form-control mt-6">
                <button
                  disabled={btnDisable}
                  onClick={login}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
