import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Code Reviewer",
    description: "AI-powered code quality check",
    image:
      "https://www.tabnine.com/wp-content/uploads/2023/10/AI-Code-Review.png",
    label: "Free",
  },
  {
    title: "Text to Image",
    description: "Words into stunning images",
    image: "https://xinva.ai/wp-content/uploads/2023/12/106.jpg",
    label: "Paid",
  },
  {
    title: "BG Removal",
    description: "Erase backgrounds in seconds",
    image:
      "https://assets.website-files.com/619e8d2e8bd4838a9340a810/647cacb5754581b4b3558593_background-remover-hero-image-comp.webp",
    label: "Paid",
  },
];

const Tools = forwardRef((props, ref) => {
  const { user, setLoginPanel } = props;
  const navigate = useNavigate();

  const onClickHandler = (service) => {
    if (user && service.title === "Text to Image") {
      navigate("/texttoimage");
    } else if (user && service.title === "Code Reviewer") {
      navigate("/codereviewer");
    } else if (user && service.title === "Resume Builder") {
      navigate("/resumeBuilder");
    } else if (user && service.title === "BG Removal") {
      navigate("/bgremover");
    } else {
      setLoginPanel(true);
    }
  };

  return (
    <div
      ref={ref}
      className="min-h-screen pt-20 px-4 sm:px-6 md:px-10 lg:px-20"
    >
      <div className="flex items-center justify-center text-xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
        <h1>🚀 Explore AI Tools</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => onClickHandler(service)}
            className="relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 cursor-pointer group"
          >
            {service.label === "Free" && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-xs sm:text-sm font-bold px-4 py-1 sm:px-5 sm:py-2 rounded-br-2xl shadow-lg z-10">
                FREE
              </div>
            )}

            <div className="overflow-hidden rounded-xl mb-2">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h2 className="text-base sm:text-lg font-semibold mb-1 text-gray-800">
              {service.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Tools;
