import React, { useContext, useEffect, useState } from "react";
import { AppDataContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { loginPanel, setLoginPanel, user, setUser } =
    useContext(AppDataContext);
  const { fullname, setFullname, getCredits } = useContext(AppDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/login`,
          { email, password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          localStorage.setItem("token", response.data.accessToken);
          await getCredits();
          setLoginPanel(false);
        }

        setEmail("");
        setPassword("");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/register`,
          { fullname, email, password },
          { withCredentials: true }
        );

        if (response.status === 201) {
          localStorage.setItem("token", response.data.accessToken);
          await getCredits();
          setLoginPanel(false);
        }

        setFullname("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-start">
      <div className="relative z-10 top-32 bg-white backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 w-[90%] max-w-sm mx-auto">
        <i
          onClick={() => setLoginPanel(false)}
          className="ri-close-line flex justify-end text-gray-500 text-xl font-bold mb-2 cursor-pointer"
        ></i>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          {state}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {state === "Login"
            ? "Welcome back! Please sign in to continue"
            : "Please sign up to continue"}
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {state !== "Login" && (
            <input
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email id"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {state === "Login" && (
            <div className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r mt-5 from-blue-500 to-blue-600 text-white py-2 rounded-full hover:opacity-90 transition"
          >
            {state === "Login" ? "Login" : "Create Account"}
          </button>
        </form>

        {state === "Login" ? (
          <p className="text-center text-sm mt-4 text-gray-700">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-700 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
