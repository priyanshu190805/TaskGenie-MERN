import React, { useRef } from "react";
import TextToImageInfo from "../components/TextToImagePage/TextToImageInfo";
import TextToImageConverter from "../components/TextToImagePage/TextToImageConverter";

const TextToImage = () => {
  const textToImageRef = useRef();

  const scrollToConverter = () => {
    textToImageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <TextToImageInfo scrollToConverter={scrollToConverter} />
      <TextToImageConverter ref={textToImageRef} />
    </>
  );
};

export default TextToImage;
