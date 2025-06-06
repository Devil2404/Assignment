import React from "react";
import "../styles/residents.css";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ResidentLists from "../components/ResidentLists";
import Footer from "../components/Footer";
import {
  useResidentController,
  setResidents,
  setPopupOpen,
} from "../context/ResidentContext";
import AddResidentModal from "../components/AddResidentModal";

function Residents() {
  const [state, dispatch] = useResidentController();

  return (
    <div className="main-page">
      <Navbar />
      <Banner />
      <ResidentLists />
      <Footer />
      <AddResidentModal isOpen={state.isPopupOpen} onClose={() => setPopupOpen(dispatch, false)} />
    </div>
  );
}

export default Residents;
