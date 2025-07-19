import React, { useContext } from "react";
import { AppDataContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const BuyCredit = () => {
  const { user, getCredits, token, loginPanel } = useContext(AppDataContext);

  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const verifyResponse = await axiosInstance.post(
            "/users/verify-razor",
            {
              razorpay_order_id: response.razorpay_order_id,
            }
          );

          if (verifyResponse.status === 200) {
            getCredits();
            navigate("/");
            toast.success("Credit added");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorPay = async (planName) => {
    try {
      if (!user) {
        loginPanel(true);
      }

      const response = await axiosInstance.post(
        "/users/pay-razor",
        { planName },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        initPay(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className=" py-28 h-screen px-4 flex flex-col items-center">
      <button className="mb-4 px-5 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:shadow-sm transition">
        OUR PLANS
      </button>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12 text-center">
        Choose the plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <img
              src="https://img.icons8.com/ios-filled/50/1E40AF/image.png"
              alt="icon"
              className="w-6 h-6"
            />
          </div>
          <h3 className="text-xl font-semibold mb-1">Basic</h3>
          <p className="text-gray-500 mb-6">Best for personal use.</p>
          <p className="text-3xl font-bold mb-1 text-gray-800">
            $10{" "}
            <span className="text-[16px] font-medium text-gray-500 ">
              / 100 credits
            </span>
          </p>
          <button
            onClick={() => paymentRazorPay("Basic")}
            className="mt-8 bg-black text-white px-8 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Purchase
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <img
              src="https://img.icons8.com/ios-filled/50/1E40AF/image.png"
              alt="icon"
              className="w-6 h-6"
            />
          </div>
          <h3 className="text-xl font-semibold mb-1">Advanced</h3>
          <p className="text-gray-500 mb-6">Best for business use.</p>
          <p className="text-3xl font-bold mb-1 text-gray-800">
            $50{" "}
            <span className="text-[16px] font-medium text-gray-500 ">
              / 500 credits
            </span>
          </p>

          <button
            onClick={() => paymentRazorPay("Advanced")}
            className="mt-8 bg-black text-white px-8 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Purchase
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <img
              src="https://img.icons8.com/ios-filled/50/1E40AF/image.png"
              alt="icon"
              className="w-6 h-6"
            />
          </div>
          <h3 className="text-xl font-semibold mb-1">Business</h3>
          <p className="text-gray-500 mb-6">Best for enterprise use.</p>
          <p className="text-3xl font-bold mb-1 text-gray-800">
            $250{" "}
            <span className="text-[16px] font-medium text-gray-500 ">
              / 5000 credits
            </span>
          </p>
          <button
            onClick={() => paymentRazorPay("Business")}
            className="mt-8 bg-black text-white px-8 py-2 rounded-full hover:bg-gray-900 transition"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyCredit;
