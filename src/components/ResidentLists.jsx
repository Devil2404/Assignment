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
  const [searchQuery, setSearchQuery] = useState("");
  const didFetch = useRef(false);

  const handleFetch = async () => {
    if (didFetch.current) return;
    didFetch.current = true;

    try {
      setLoading(true);
      const response = await fetch("https://o3upfgtghb.execute-api.eu-north-1.amazonaws.com/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "get-all" }),
      });


      const result = await response.json();
      const res = JSON.parse(result.body);

      if (res?.data) {
        setResidents(dispatch, res.data);
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <>
            {state.residents.map((resident) => {
              const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
              const isMatch = fullName.includes(searchQuery.toLowerCase());
              return (
                <div key={resident.id} className={isMatch ? "" : "hide"}>
                  <ResidentCard
                    name={`${resident.first_name} ${resident.last_name}`}
                    role={resident.role}
                    image={resident.profile_url}
                    linkedin={resident.linkedin_url}
                    twitter={resident.twitter_url}
                  />
                </div>
              );
            })}

            {/* Show no-results message only if no cards match */}
            {state.residents.filter((resident) => {
              const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
              return fullName.includes(searchQuery.toLowerCase());
            }).length === 0 && (
                <p className="no-results">No matching residents found.</p>
              )}
          </>
        )}
      </div>
      
    </div>
  );
}

export default ResidentLists;
