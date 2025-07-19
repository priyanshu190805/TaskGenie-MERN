import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./components/Navbar";
import TextToImage from "./pages/TextToImage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AppDataContext } from "./context/AppContext";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";
import Aichat from "./pages/Aichat";
import CodeReveiwer from "./pages/CodeReveiwer";
import BgRemover from "./pages/BgRemover";

const App = () => {
  const { loginPanel } = useContext(AppDataContext);
  return (
    <div className="relative from-teal-50 to-orange-50">
      <ToastContainer position="bottom-right" />
      <Navbar />
      <ScrollToTop />
      {loginPanel && (
        <div>
          <Login />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/texttoimage" element={<TextToImage />} />
        <Route path="/bgremover" element={<BgRemover />} />
        <Route path="/codereviewer" element={<CodeReveiwer />} />
        <Route path="/aichat" element={<Aichat />} />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
