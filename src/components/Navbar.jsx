import React from 'react'
import "../styles/navbar.css"
import Logo from "../assets/apartment.png"
import {
  useResidentController,
  setPopupOpen,
} from "../context/ResidentContext";

function Navbar() {
  const [state, dispatch] = useResidentController();
  return (
    <div className='main-navbar'>
      <div className="main-logo">
        <img src={Logo} alt="" />
        <span className='manrope-bold'>
          The Residents Book
        </span>
      </div>
      <div className="residents-btn">
        <button className='manrope-regular' onClick={() => setPopupOpen(dispatch, true)}>Add Resident</button>
      </div>
    </div>
  )
}

export default Navbar