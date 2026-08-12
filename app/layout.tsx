import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const productionUrl = "https://sayaka-portfolio.vercel.app";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || productionUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sayaka Alam — Software Developer & Data Analyst",
    template: "%s | Sayaka Alam"
  },
  description:
    "Portfolio of Sayaka Alam, combining software development with SQL-first data analysis, relational reasoning, visualization, and decision-oriented problem solving.",
  keywords: [
    "Sayaka Alam",
    "Software Developer",
    "Data Analyst",
    "SQL",
    "Data Analysis",
    "PL/SQL",
    "Next.js",
    "React",
    "FastAPI",
    "Laravel",
    "MySQL",
    "DuckDB",
    "Pandas"
  ],
  authors: [{ name: "Sayaka Alam" }],
  creator: "Sayaka Alam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Sayaka Alam — Software Developer & Data Analyst",
    description:
      "Software development and SQL-first data analysis portfolio: projects, database work, analytical reasoning, and full-stack systems.",
    siteName: "Sayaka Alam Portfolio",
    images: [
      {
        url: "/sayaka-alam.jpg",
        width: 900,
        height: 1200,
        alt: "Sayaka Alam"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayaka Alam — Software Developer & Data Analyst",
    description: "Software development and SQL-first data analysis portfolio.",
    images: ["/sayaka-alam.jpg"]
  },
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071217" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7f8" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
