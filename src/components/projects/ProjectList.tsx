import React from "react";
import { projects } from "../../data/projects";
import ProjectCard from "./ProjectCard";

const ProjectList: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Projects</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
