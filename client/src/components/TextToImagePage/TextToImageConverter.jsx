import React, { forwardRef, useContext, useState } from "react";
import { AppDataContext } from "../../context/AppContext";

const TextToImageConverter = forwardRef((props, ref) => {
  const [image, setImage] = useState(
    "https://xinva.ai/wp-content/uploads/2023/12/106.jpg"
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppDataContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const resultImage = await generateImage(input);
      if (resultImage) {
        setIsImageLoaded(true);
        setImage(resultImage);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div
        ref={ref}
        className="py-28 px-20 w-full h-screen flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-[40px] font-semibold">Create AI Images</h1>
          <p className="text-gray-500">Your Vision, Rendered by AI</p>
        </div>

        <div>
          <div className="relative items-center rounded mt-6">
            <img src={image} className="w-96 h-96 rounded-lg" />
            <span
              className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
                loading ? "w-full transition-all duration-[10s]" : ""
              }`}
            />
          </div>

          <div className="h-6">
            {loading && <p className="text-black">Loading.....</p>}
          </div>
        </div>

        {isImageLoaded ? (
          <div className="flex gap-3 flex-wrap justify-center text-white text-sm p-1 mt-6 rounded-full">
            <p
              onClick={() => setIsImageLoaded(false)}
              className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:scale-105 duration-300"
            >
              Generate Another
            </p>
            <a
              href={image}
              download
              className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:scale-105 duration-300"
            >
              Download
            </a>
          </div>
        ) : (
          <div className="flex w-full max-w-xl bg-neutral-500 text-white p-1 mt-6 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Describe what you want to generate"
              className="flex-1 bg-transparent outline-none ml-8 w-20 placeholder"
            />
            <button
              disabled={!input.trim()}
              type="submit"
              className={`${
                !input.trim()
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-black"
              } px-10 rounded-full p-2`}
            >
              Generate
            </button>
          </div>
        )}
      </div>
    </form>
  );
});

export default TextToImageConverter;
