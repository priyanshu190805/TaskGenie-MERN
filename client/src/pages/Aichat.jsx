import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

gsap.registerPlugin(ScrollToPlugin);

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const sendButtonRef = useRef(null);

  useEffect(() => {
    if (sendButtonRef.current) {
      gsap.to(sendButtonRef.current, {
        scale: 1.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) {
      return;
    }

    const newMessages = [
      ...messages,
      {
        role: "user",
        text: userInput,
      },
    ];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await axiosInstance.post(
        "/tools/generate-response",
        { prompt: userInput },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: response.data,
          },
        ]);
      }
    } catch (error) {
      toast.error("No valid response available");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-10 md:px-16 lg:px-28">
      <motion.div
        className="w-full max-w-6xl flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden border"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-blue-500 text-white px-6 py-4 text-xl font-semibold">
          🤖 Chat with TaskGenie
        </div>
        <div className="flex-1 max-h-[50vh] overflow-y-auto px-4 sm:px-6 py-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow text-sm max-w-[75%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-3 px-4 sm:px-6 py-3 bg-white">
          <textarea
            rows={3}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full min-h-[3rem] resize-none px-4 py-3 rounded-2xl text-md focus:outline-none border-2"
          />
          <button
            onClick={handleSend}
            ref={sendButtonRef}
            disabled={!userInput.trim()}
            className={`w-full sm:w-auto px-5 py-2 ${
              !userInput.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } rounded-full transition duration-300`}
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AiChat;
