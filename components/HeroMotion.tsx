"use client";

import { motion } from "motion/react";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function HeroMotion() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="hero-copy"
    >
      <motion.span variants={item} className="hero-kicker">
        Software Engineer
      </motion.span>

      <motion.h1 variants={item}>
        I build useful software
        <br />
        with code + data.
      </motion.h1>

      <motion.p variants={item}>
        Python · React · FastAPI · SQL
      </motion.p>

      <motion.div variants={item} className="hero-actions">
        <a href="#projects" className="primary-button">
          View Work
        </a>

        <a href="/resume.pdf" className="secondary-button">
          Resume ↗
        </a>
      </motion.div>
    </motion.div>
  );
}