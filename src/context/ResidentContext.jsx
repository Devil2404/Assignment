import React, { useReducer, useContext, useEffect, useMemo } from "react";

// Context
export const ResidentContext = React.createContext(null);
ResidentContext.displayName = "ResidentContext";

// Default State
const defaultResidentState = {
  isPopupOpen: false,
  residents: [],
};

// Reducer
function residentReducer(state, action) {
  switch (action.type) {
    case "SET_POPUP_OPEN":
      return { ...state, isPopupOpen: action.value };

    case "SET_RESIDENTS":
      return { ...state, residents: action.value };

    case "RESET_RESIDENT_STATE":
      return defaultResidentState;

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Provider
export function ResidentProvider({ children }) {
  const savedState = JSON.parse(localStorage.getItem("residentAppState"));
  const initialState = savedState || defaultResidentState;

  const [state, dispatch] = useReducer(residentReducer, initialState);

  useEffect(() => {
    localStorage.setItem("residentAppState", JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <ResidentContext.Provider value={value}>
      {children}
    </ResidentContext.Provider>
  );
}

ResidentProvider.displayName = "/src/context/ResidentContext.jsx";

// Hook
export function useResidentController() {
  const context = useContext(ResidentContext);
  if (!context) {
    throw new Error(
      "useResidentController must be used within a ResidentProvider."
    );
  }
  return context;
}

// Action Dispatchers
export const setPopupOpen = (dispatch, value) =>
  dispatch({ type: "SET_POPUP_OPEN", value });

export const setResidents = (dispatch, value) =>
  dispatch({ type: "SET_RESIDENTS", value });

export const resetResidentState = (dispatch) => {
  localStorage.removeItem("residentAppState");
  dispatch({ type: "RESET_RESIDENT_STATE" });
};
