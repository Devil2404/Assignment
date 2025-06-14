import React, { useState, useRef } from "react";
import "../styles/AddResidentModal.css";
import {
  useResidentController,
  setResidents,
  setPopupOpen,
} from "../context/ResidentContext";

const AddResidentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    profileUrl: "",
    profileFile: null,
    linkedin: "",
    twitter: "",
  });
  const [state, dispatch] = useResidentController();

  const MAX_IMAGE_SIZE_KB = 300;
  const [useUpload, setUseUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
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


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileFile") {
      setFormData({ ...formData, profileFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const convertToBase64WithWarning = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("No file provided");
        return;
      }

      const fileSizeKB = file.size / 1024;

      if (fileSizeKB > MAX_IMAGE_SIZE_KB) {
        alert(`Image is too large (${Math.round(fileSizeKB)} KB). Max allowed is ${MAX_IMAGE_SIZE_KB} KB.`);
        reject("File too large");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        console.error("Base64 conversion failed:", error);
        reject("Failed to convert image");
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, title, profileUrl, profileFile } = formData;
    if (!firstName || !lastName || !title) {
      alert("Please fill all required fields");
      return;
    }

    let imageSource = "";
    if (useUpload && profileFile) {
      imageSource = await convertToBase64WithWarning(profileFile);
    } else if (!useUpload && profileUrl) {
      imageSource = profileUrl;
    } else {
      alert("Please provide a profile image (URL or upload)");
      return;
    }

    setLoading(true);
    try {
      const finalData = {
        id: `${Date.now()}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.title,
        profile_url: imageSource,
        linkedin_url: formData.linkedin || undefined,
        twitter_url: formData.twitter || undefined,
      };

      await storeIt(finalData);

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        title: "",
        profileUrl: "",
        profileFile: null,
        linkedin: "",
        twitter: "",
      });

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        handleFetch()
      }, 1500);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }

  };

  const storeIt = async (data) => {
    const response = await fetch("https://o3upfgtghb.execute-api.eu-north-1.amazonaws.com/dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: "store-it",
        item: data,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.statusCode !== 201) {
      throw new Error(result.message || "Failed to store resident");
    }

    return result;
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content zoom-in">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Add Yourself to The Residents Book</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name *"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            name="title"
            placeholder="Title / Role *"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Radio Buttons */}
          <div className="input-toggle">
            <label>
              <input
                type="radio"
                name="inputType"
                checked={!useUpload}
                onChange={() => setUseUpload(false)}
              />
              Use Image URL
            </label>
            <label className="give-space">
              <input
                type="radio"
                name="inputType"
                checked={useUpload}
                onChange={() => setUseUpload(true)}
              />
              Upload Image
            </label>
          </div>

          {useUpload ? (
            <input
              type="file"
              name="profileFile"
              accept="image/*"
              onChange={handleChange}
            />
          ) : (
            <input
              type="url"
              name="profileUrl"
              placeholder="Profile Photo URL"
              onChange={handleChange}
            />
          )}



          <input
            name="linkedin"
            placeholder="LinkedIn URL"
            value={formData.linkedin}
            onChange={handleChange}
          />
          <input
            name="twitter"
            placeholder="Twitter URL"
            value={formData.twitter}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Me"}
          </button>

          {error && <div className="error-toast">❌ {error}</div>}
          {submitted && <div className="success-toast">✅ You're in!</div>}
        </form>
      </div>
    </div>
  );
};

export default AddResidentModal;
