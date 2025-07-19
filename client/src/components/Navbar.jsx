import React, { useContext } from "react";
import Logo from "../assets/Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDataContext } from "../context/AppContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, setUser, loginPanel, setLoginPanel, credits } =
    useContext(AppDataContext);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="fixed flex items-center justify-between z-30 py-3 px-4 sm:px-6 md:px-10 lg:px-20 bg-white w-full">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <img
          src={Logo}
          className="w-[40px] sm:w-[32px] md:w-[3.8vw] rounded-full"
          alt="Logo"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">TaskGenie</h1>

        {!isHome && (
          <button
            onClick={() => navigate("/")}
            title="Go to Home"
            className="ml-2 sm:ml-4 flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-white hover:bg-black border border-gray-300 px-2 sm:px-3 py-1 rounded-full transition-all duration-300 ease-in-out text-sm"
          >
            <i className="ri-home-4-line text-base sm:text-lg" />
            <span className="hidden sm:inline font-medium">Home</span>
          </button>
        )}
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <button
              onClick={() => navigate("/buy")}
              className="flex gap-2 bg-blue-100 px-4 sm:px-6 py-2 rounded-full items-center hover:scale-105 duration-300 transition-all text-sm sm:text-base"
            >
              <i className="ri-star-fill text-blue-500 text-base sm:text-lg"></i>
              <p className="font-medium text-gray-600">
                Credit left: {credits}
              </p>
            </button>
            <p className="font-medium text-gray-600 text-sm sm:text-base">
              Hi, {user.fullname}
            </p>
            <div className="relative group">
              <i className="ri-user-3-fill p-[6px] sm:p-[7px] bg-black text-white rounded-full cursor-pointer"></i>
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 px-2 py-1 bg-white rounded-md border-2">
                  <li
                    onClick={logout}
                    className="py-1 px-2 cursor-pointer whitespace-nowrap"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-7 flex-wrap justify-end">
            <p
              onClick={() => navigate("/buy")}
              className="cursor-pointer font-medium text-sm sm:text-base"
            >
              Pricing
            </p>
            <button
              onClick={() => setLoginPanel(true)}
              className="bg-zinc-800 text-white px-6 sm:px-10 py-2 rounded-full hover:scale-110 duration-300 font-medium text-sm sm:text-base"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
