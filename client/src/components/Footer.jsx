import React from "react";
import Logo from "../assets/Logo.png";

const Footer = () => {
  return (
    <div className="absolute bottom-0 flex items-center justify-between pb-4 px-20 bg-white w-full">
      <div className="flex items-center gap-2">
        <img src={Logo} className="w-[1.6vw] rounded-full" />
        <h1 className="text-lg font-bold">TaskGenie</h1>
        <p className="text-sm text-gray-500">
          | All right reserved. @TaskGenie
        </p>
      </div>
    </div>
  );
};

export default Footer;
