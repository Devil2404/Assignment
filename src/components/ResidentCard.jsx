import React, { useEffect, useRef, useState } from 'react';
import '../styles/ResidentCard.css';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const ResidentCard = ({ name, role, image, linkedin, twitter }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`resident-card fade-in ${isVisible ? 'visible' : ''}`}
    >
      <img src={image} alt={`${name}`} className="profile-img" />
      <h3 className="resident-name">{name}</h3>
      <p className="resident-role">{role}</p>
      <div className="social-icons">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
        {twitter && (
          <a href={twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        )}
      </div>
    </div>
  );
};

export default ResidentCard;
