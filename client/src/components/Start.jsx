import React, { useContext, useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { AppDataContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Choose Your Tool",
    description:
      "Select from a range of AI features — code review, OCR, image generation, and more.",
    icon: "ri-tools-line",
  },
  {
    title: "Input Your Data",
    description:
      "Provide code, images, text, or documents for the AI to process.",
    icon: "ri-input-method-line",
  },
  {
    title: "Get Instant Results",
    description:
      "Receive accurate, AI-powered results that you can download, copy, or share.",
    icon: "ri-flashlight-line",
  },
];

const Start = ({ scrollToTools }) => {
  const buttonRef = useRef(null);
  const { loginPanel } = useContext(AppDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  useLayoutEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.4,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  const handlerNavigate = () => {
    navigate("/aichat");
  };

  return (
    <motion.div
      className="relative min-h-screen pt-28 pb-10 overflow-x-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-4 sm:px-6 md:px-10 lg:px-28">
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-xs sm:text-sm bg-white px-3 py-1 rounded-full shadow inline-block mb-4"
          >
            🚀 All-in-one AI Toolkit
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
          >
            Unlock AI Power for <span className="text-blue-500">Anything</span>,
            Instantly.
          </motion.h1>

          <div className="flex items-center justify-center mt-6 sm:mt-8 mb-6 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              className="w-full flex items-center justify-center"
            >
              <button
                onClick={handlerNavigate}
                ref={buttonRef}
                className="w-4/5 sm:w-auto px-6 py-3 bg-blue-500 text-white text-sm sm:text-base rounded-full shadow hover:bg-blue-600 transition"
              >
                Chat with TaskGenie 💬
              </button>
            </motion.div>
          </div>

          <p className="text-sm sm:text-lg text-gray-600 max-w-xl mx-auto px-2">
            From code reviews to image generation and text recognition — explore
            the most versatile AI tools in one place.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5">
            How it works
          </h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow text-center"
              >
                <i
                  className={`${step.icon} text-3xl sm:text-4xl text-blue-500 mb-4`}
                ></i>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mt-6">
            <button
              onClick={scrollToTools}
              className="px-6 py-3 bg-black text-white rounded-full hover:scale-105 duration-300 shadow transition text-sm sm:text-base"
            >
              Try Now ⚡
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Start;
