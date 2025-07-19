import React, { useState, useEffect } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/atom-one-dark.css";

import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";

const CodeReviewer = () => {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const reviewCode = async () => {
    setLoading(true);
    setReview("");
    try {
      const response = await axiosInstance.post("/tools/generate-review", {
        code,
      });
      setReview(response.data?.review || "No review generated.");
    } catch (err) {
      setReview("Error generating review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="h-[100dvh] px-3 sm:px-4 pt-24 pb-24 flex flex-col md:flex-row gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex-1 min-h-[50vh] md:min-h-0 bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-br-2xl shadow-lg z-10">
          FREE
        </div>

        <div className="p-3 sm:p-4 pt-5 overflow-auto h-[calc(100%-4rem)] code-editor-scrollbar">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={16}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              color: "#fff",
              minHeight: "100%",
            }}
          />
        </div>

        <button
          onClick={reviewCode}
          disabled={loading}
          className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow transition duration-300 text-sm sm:text-base ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>

      <div className="flex-1 min-h-[50vh] md:min-h-0 bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
          AI Code Review
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <svg
              className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mr-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              ></path>
            </svg>
            Generating review...
          </div>
        ) : (
          <div className="prose prose-sm sm:prose-base prose-slate max-w-none">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CodeReviewer;
