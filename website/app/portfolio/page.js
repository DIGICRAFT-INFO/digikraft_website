// "use client";

// import { useState, useEffect } from "react";
// import "../../public/assets/css/portfolio.css";
// import { projects } from "@/public/project";

// const categories = [
//   "All",
//   "Web Development",
//   "Application Development",
//   "Branding",
//   "Logo",
//   "Social Media Post",
//   "Video Animation",
// ];

// export default function Portfolio() {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const filteredProjects = projects.filter(
//     (project) =>
//       selectedCategory === "All" || project.category === selectedCategory
//   );

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="portfolio-wrapper">
//       <div className="portfolio-container">
//         {/* Hero Section */}
//         <div className="hero-section">
//           <h2 className="hero-title">Project Showcase</h2>
//           <p className="hero-description">
//             Explore our journey through code, creativity, and client success.
//           </p>
//         </div>

//         {/* Filter Buttons */}
//         <div className="filter-buttons">
//           {categories.map((category) => (
//             <button
//               key={category}
//               className={`filter-btn ${
//                 selectedCategory === category ? "active" : ""
//               }`}
//               onClick={() => handleCategoryChange(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Projects Grid */}
//         <div className="projects-grid">
//           {filteredProjects.map((project) => (
//             <div key={project.id} className="project-card">
//               {/* Project Image or Video */}
//               <div className="project-image-wrapper">
//                 {project.video && project.category === "Video Animation" ? (
//                   <iframe
//                     src={`${project.video}?autoplay=0`}
//                     title={project.title}
//                     className="project-video"
//                     frameBorder="0"
//                     allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     loading="lazy"
//                     width="100%"
//                     height="100%"
//                     style={{ borderRadius: "10px", objectFit: "cover" }}
//                     // stop autoplay
//                   />
//                 ) : (
//                   <img
//                     src={project.image || "/placeholder.svg"}
//                     alt={project.title}
//                     className="project-image"
//                   />
//                 )}

//                 {/* Category Badge */}
//                 <div className="category-badge">{project.category}</div>

//                 {/* Status Badge */}
//                 <div className="status-badge">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
//                   </svg>
//                   {project.progress}
//                 </div>
//               </div>

//               {/* Card Content */}
//               <div className="project-content">
//                 <h3 className="project-title">{project.title}</h3>

//                 <p className="project-description">{project.description}</p>

//                 {/* Tags */}
//                 <div className="project-tags">
//                   {project.tags?.slice(0, 3).map((tag, tagIndex) => (
//                     <span key={tagIndex} className="project-tag">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="project-actions">
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() =>
//                       (window.location.href = `/feature/${project.id}`)
//                     }
//                   >
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
//                     </svg>
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredProjects.length === 0 && (
//           <div className="empty-state">
//             <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//             <h3>No projects found</h3>
//             <p>Try selecting a different category to see more projects.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import "../../public/assets/css/portfolio.css";

const categories = [
  "All",
  "Web Development",
  "Application Development",
  "Branding",
  "Logo",
  "Social Media Post",
  "Video Animation",
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from your Node/Express API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://aqua-pigeon-679923.hostingersite.com/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      selectedCategory === "All" || project.category === selectedCategory
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="portfolio-wrapper min-vh-100 d-flex align-items-center justify-content-center">
        <h3 className="text-muted">Loading Projects...</h3>
      </div>
    );
  }

  return (
    <div className="portfolio-wrapper">
      <div className="portfolio-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h2 className="hero-title">Project Showcase</h2>
          <p className="hero-description">
            Explore our journey through code, creativity, and client success.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            // Helper logic database format ke liye
            const tagsArray = project.tags ? project.tags.split(",").map(t => t.trim()) : [];
            const videoUrl = project.content && project.content.length > 0 ? project.content[0].src : null;
            
            return (
              <div key={project._id} className="project-card">
                {/* Project Image or Video */}
                <div className="project-image-wrapper">
                  {videoUrl && (project.type === "video" || project.projectType?.toLowerCase().includes("video")) ? (
                    <iframe
                      src={`${videoUrl}?autoplay=0`}
                      title={project.title}
                      className="project-video"
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      width="100%"
                      height="100%"
                      style={{ borderRadius: "10px", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      className="project-image"
                    />
                  )}

                  {/* Category Badge */}
                  <div className="category-badge">{project.category || "Uncategorized"}</div>

                  {/* Status Badge */}
                  <div className="status-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Completed
                  </div>
                </div>

                {/* Card Content */}
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>

                  <p className="project-description">
                    {project.description?.substring(0, 100)}...
                  </p>

                  {/* Tags */}
                  <div className="project-tags">
                    {tagsArray.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="project-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => (window.location.href = `/feature/${project._id}`)} // Fixed ID reference
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h3>No projects found</h3>
            <p>Try selecting a different category to see more projects.</p>
          </div>
        )}
      </div>
    </div>
  );
}