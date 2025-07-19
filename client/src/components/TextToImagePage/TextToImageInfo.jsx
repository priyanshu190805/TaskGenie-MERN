import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollToPlugin);

const TextToImageInfo = ({ scrollToConverter }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <motion.div
      className="py-20 sm:py-28 px-4 sm:px-10 md:px-20 w-full min-h-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Title + Subtitle */}
      <motion.div
        className="flex flex-col items-center text-center px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Visualize with AI
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Turn your imagination into visuals
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 px-2 sm:px-4 md:px-8 pt-10">
        {/* Image */}
        <div className="w-full md:w-[40%] h-[35vh] sm:h-[40vh]">
          <img
            src="https://xinva.ai/wp-content/uploads/2023/12/106.jpg"
            className="w-full h-full object-cover rounded-lg"
            alt="Generated Example"
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-[60%] flex flex-col">
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            Introducing The AI-Powered Text To Image Generator
          </motion.h1>

          <motion.p
            className="mt-4 mb-3 text-sm sm:text-base text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Easily bring your ideas to life with our free AI image generator.
            Whether you need stunning visuals or unique imagery, our tool
            transforms your text into eye-catching images with just a few
            clicks. Imagine it, describe it, and watch it come to life
            instantly.
          </motion.p>

          <motion.p
            className="text-sm sm:text-base text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          >
            Simply type in a text prompt and our cutting-edge AI will generate
            high-quality images in seconds. From product visuals to character
            designs and portraits, even concepts that don’t yet exist can be
            visualized effortlessly. Powered by advanced AI technology, the
            creative possibilities are limitless!
          </motion.p>

          <div className="flex justify-center md:justify-start mt-6">
            <button
              onClick={scrollToConverter}
              ref={buttonRef}
              className="px-6 py-3 bg-black text-white rounded-full hover:scale-105 duration-300 font-semibold text-sm sm:text-base"
            >
              Generate Images
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextToImageInfo;
