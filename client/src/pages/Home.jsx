import React, { useContext, useRef, useLayoutEffect } from "react";
import Tools from "../components/Tools";
import Start from "../components/Start";
import { AppDataContext } from "../context/AppContext";

const Home = () => {
  const toolsRef = useRef();
  const { user, setLoginPanel } = useContext(AppDataContext);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Start scrollToTools={scrollToTools} />
      <Tools ref={toolsRef} user={user} setLoginPanel={setLoginPanel} />
    </div>
  );
};

export default Home;
