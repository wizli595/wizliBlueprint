import React from "react";
import type { Project } from "../../data/projects";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 12,
      margin: 8,
      maxWidth: 420,
      background: "#fff8",
    }}>
      <h3 style={{ margin: "4px 0" }}>{project.title}</h3>
      <p style={{ margin: "4px 0", color: "#444" }}>{project.short}</p>
      <div style={{ fontSize: 12, color: "#222" }}>
        <strong>Tech:</strong> {project.tech.join(", ")}
      </div>
      {project.link ? (
        <div style={{ marginTop: 8 }}>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            View project
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectCard;
