import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export const AppDataContext = createContext();

const AppContext = ({ children }) => {
  const tokenExists = localStorage.getItem("token");
  const [user, setUser] = useState(tokenExists ? "checking" : null);
  const [loginPanel, setLoginPanel] = useState(false);
  const [fullname, setFullname] = useState("");
  const [credits, setCredits] = useState("");
  const navigate = useNavigate();
  const [resultImage, setResultImage] = useState();

  const getCredits = async () => {
    try {
      const response = await axiosInstance.get("/users/credits");

      if (response.status === 200) {
        const { credits, fullname, user } = response.data;
        setCredits(credits);
        setFullname(fullname);
        setUser(user);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast.error("Failed to fetch credits");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const generateImage = async (prompt) => {
    try {
      const response = await axiosInstance.post("/tools/generate-image", {
        prompt,
      });

      if (response.status === 200) {
        await getCredits();
        return response.data.resultImage;
      } else {
        toast.error(response.data?.message || "Failed to generate image");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You have no credits left. Please buy more.");
        navigate("/buy");
      } else {
        toast.error("Internal server error");
      }
    }
  };

  const removeBg = async (image) => {
    try {
      const formData = new FormData();
      image && formData.append("image", image);
      const response = await axiosInstance.post("/tools/remove-bg", formData);

      if (response.status === 200) {
        await getCredits();
        setResultImage(response.data.resultImage);
      } else {
        toast.error(response.data?.message || "Failed to generate image");
      }
    } catch (error) {
      if (error.response.status === 403) {
        toast.error("You have no credits left. Please buy more.");
        navigate("/buy");
      } else {
        toast.error("Internal server error");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (tokenExists) {
      getCredits();
    }
  }, []);

  const value = {
    user,
    setUser,
    loginPanel,
    setLoginPanel,
    credits,
    setCredits,
    getCredits,
    fullname,
    setFullname,
    generateImage,
    removeBg,
    resultImage,
    setResultImage,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export default AppContext;
