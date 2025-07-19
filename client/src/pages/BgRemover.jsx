import React, { useContext, useState } from "react";
import imageWBG from "../assets/imageWBG.png";
import imageWOBG from "../assets/imageWOBG.png";
import { motion } from "framer-motion";
import { AppDataContext } from "../context/AppContext";
import { toast } from "react-toastify";

const BgRemover = () => {
  const { resultImage, setResultImage, removeBg } = useContext(AppDataContext);
  const [originalImage, setOriginalImage] = useState(imageWBG);
  const [loading, setLoading] = useState(false);

  async function handleImageChange(e) {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) {
      return null;
    }

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);

    setLoading(true);

    try {
      await removeBg(file);
    } catch (error) {
      toast.error("Cannot generate the image");
    }
    setLoading(false);
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-between"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <main className="flex flex-col items-center justify-center flex-grow text-center p-6">
        <motion.h1
          className="text-3xl font-bold text-blue-600 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          bg.removal
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Original</span>
            <div className="w-full max-w-md h-auto rounded shadow overflow-hidden">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>

            {resultImage ? (
              <button
                className="mt-6 px-10 p-2 rounded-full bg-transparent border border-zinc-900 text-black hover:scale-105 duration-300"
                onClick={() => {
                  setResultImage(null);
                  setOriginalImage(imageWBG);
                }}
              >
                Try Another Image
              </button>
            ) : (
              <label
                className={`mt-6 px-10 py-3 rounded-full ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-zinc-900 cursor-pointer hover:scale-105"
                } text-white duration-300`}
              >
                {loading ? "Processing..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">
              Background Removed
            </span>
            <div className="w-full max-w-md h-[72%] relative rounded shadow overflow-hidden flex items-center justify-center bg-layer mb-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <img
                  src={resultImage ? resultImage : imageWOBG}
                  alt="Background Removed"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {resultImage && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-10 p-2 rounded-full bg-zinc-900 text-white py-3 cursor-pointer hover:scale-105 duration-300">
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default BgRemover;
