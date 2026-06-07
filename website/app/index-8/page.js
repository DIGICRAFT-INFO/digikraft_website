"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../../public/assets/css/circular.module.css";
import API from "@/utils/api"; // <-- Update this path

export default function CircularTimeline() {
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [yearContent, setYearContent] = useState({});
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 700,
    height: 370,
  });

  // 1. Fetch API Data using Axios
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        // Replaced native fetch with the configured Axios instance
        const response = await API.get("/about");
        const data = response.data; // Axios automatically parses the JSON

        // Sort data chronologically 
        const sortedData = data.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        const fetchedYears = [];
        const fetchedContent = {};

        sortedData.forEach((item) => {
          fetchedYears.push(item.year);
          fetchedContent[item.year] = {
            title: item.heading,
            description: item.description,
          };
        });

        setYears(fetchedYears);
        setYearContent(fetchedContent);
        
        // Initialize the selected year based on fetched data
        if (fetchedYears.length > 0) {
          setSelectedYear(fetchedYears[0]);
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchTimelineData();
  }, []);

  // 2. Handle Screen Resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const radius = Math.min(width / 2.5, 320);
      const height = radius + 70;
      setDimensions({
        width,
        height,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 3. Auto move every 10 seconds (dynamically driven by fetched years)
  useEffect(() => {
    if (years.length === 0) return; // Prevent interval if data isn't loaded yet

    const interval = setInterval(() => {
      setSelectedYear((prevYear) => {
        const currentIndex = years.indexOf(prevYear);
        const nextIndex = (currentIndex + 1) % years.length;
        return years[nextIndex];
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [years]);

  // 4. Mathematical Positions
  const radius = Math.min(dimensions.width / 2.5, 320);
  const centerY = dimensions.height - 30;

  const getYearPosition = (index, total) => {
    // Failsafe: avoid division by zero if there's only 1 year of data
    const angle = total > 1 ? 180 + (index / (total - 1)) * 180 : 270;
    const radians = (angle * Math.PI) / 180;
    const centerX = dimensions.width / 2;
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    return { x, y, angle };
  };

  const selectedIndex = years.indexOf(selectedYear);
  const { angle: selectedAngle } = years.length > 0 
    ? getYearPosition(selectedIndex >= 0 ? selectedIndex : 0, years.length)
    : { angle: 270 }; // Default pointing straight up until data loads

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      <div
        className={styles.halfCircularTimeline}
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {/* Center Point */}
        <div
          className={styles.centerPoint}
          style={{
            left: `${dimensions.width / 2}px`,
            top: `${centerY}px`,
          }}
        ></div>

        {/* Connection Line */}
        <div
          className={styles.connectionLine}
          style={{
            left: `${dimensions.width / 2}px`,
            top: `${centerY - radius}px`,
            height: `${radius}px`,
            transform: `rotate(${selectedAngle - 270}deg)`,
            transformOrigin: "bottom center",
            opacity: years.length > 0 ? 1 : 0, // Hide line until data loads
          }}
        ></div>

        {/* Year Markers */}
        {years.map((year, index) => {
          const { x, y } = getYearPosition(index, years.length);
          const isActive = selectedYear === year;
          return (
            <div
              key={year}
              className={`${styles.yearMarker} ${
                isActive ? styles.active : ""
              }`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                position: "absolute",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}
              onClick={() => setSelectedYear(year)}
            >
              <div className={styles.markerDot}></div>
              <div className={styles.markerLabel}>{year}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.yearDisplay}>{selectedYear || "..."}</div>
        <h3 className={styles.contentTitle}>
          {yearContent[selectedYear]?.title || "Loading timeline..."}
        </h3>
        <div className={styles.contentText}>
          {yearContent[selectedYear]?.description || ""}
        </div>
      </div>
    </div>
  );
}