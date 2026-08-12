import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sayaka Alam — Software Developer & Data Analyst",
    short_name: "Sayaka Alam",
    description: "Software development and SQL-first data analysis portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#071217",
    theme_color: "#0e8f83",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
  };
}
