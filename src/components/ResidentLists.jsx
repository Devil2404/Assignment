import { useEffect, useRef, useState } from "react";
import "../styles/residentlists.css";
import Search from "../assets/search.png";
import ResidentCard from "./ResidentCard";
import {
  useResidentController,
  setResidents,
  setPopupOpen,
} from "../context/ResidentContext";

function ResidentLists() {
  const [state, dispatch] = useResidentController();
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false);

  const handleFetch = async () => {
    if (didFetch.current) return;
    didFetch.current = true;

    try {
      setLoading(true);
      const response = await fetch("https://pteimirxlxgd6lciwpaiowngb40auxgm.lambda-url.eu-north-1.on.aws/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "get-all" }),
      });

      const result = await response.json();
      if (result?.data) {
        setResidents(dispatch, result.data);
      }
    } catch (err) {
      console.error("Failed to fetch residents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="main-residentlists-container">
      <div className="title">
        <span className="manrope-bold">Our Residents</span>
        <hr />
      </div>

      <div className="residents-filter-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search residents..."
            className="search-input"
          />
          <button className="search-btn">
            <img src={Search} alt="" />
          </button>
        </div>
        <div className="residents-btn residents-mobile-btn">
          <button className="manrope-regular" onClick={() => setPopupOpen(dispatch, true)}>Add Resident</button>
        </div>
      </div>

      <div className="residents-card-container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          state.residents.map((resident) => (
            <ResidentCard
              key={resident.id}
              name={`${resident.first_name} ${resident.last_name}`}
              role={resident.role}
              image={resident.profile_url}
              linkedin={resident.linkedin_url}
              twitter={resident.twitter_url}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ResidentLists;
