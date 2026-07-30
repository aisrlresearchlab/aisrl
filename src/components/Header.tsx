"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { name: "Professor", path: "/" },
    { name: "Members", path: "/members" },
    { name: "Publications", path: "/publications" },
    { name: "News", path: "/news" },
  ];

  return (
    <header className="w-full border-b border-keel py-6 px-6 md:px-12 flex justify-between items-center bg-background transition-colors duration-300">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-serif font-semibold text-lg tracking-wide uppercase hover:text-accent transition-colors">
          AISRL
        </Link>
        <span className="h-4 w-px bg-keel hidden sm:inline" />
        <nav className="hidden sm:flex items-center gap-6 text-sm tracking-widest uppercase font-light text-muted">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`transition-colors hover:text-foreground ${
                  isActive ? "text-accent font-medium" : "text-muted"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2.5 rounded border border-keel hover:bg-stone-100 dark:hover:bg-stone-500 transition-colors cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        )}
      </button>
    </header>
  );
}
