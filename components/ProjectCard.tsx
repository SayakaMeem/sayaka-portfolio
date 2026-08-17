"use client";

import { motion } from "motion/react";

type ProjectCardProps = {
  title: string;
  description: string;
  technologies: string[];
  href: string;
};

export default function ProjectCard({
  title,
  description,
  technologies,
  href,
}: ProjectCardProps) {
  return (
    <motion.article
      className="project-card"
      whileHover={{
        y: -8,
        scale: 1.015,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 24,
      }}
    >
      <div className="project-card-top">
        <span className="project-dot" />
        <span className="project-label">Selected work</span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="tech-stack">
        {technologies.slice(0, 4).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <a
        className="project-link"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        View project <span aria-hidden="true">↗</span>
      </a>
    </motion.article>
  );
}