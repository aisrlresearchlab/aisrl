import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-keel mt-auto py-12 px-6 md:px-12 text-xs tracking-wider text-muted font-light flex flex-col sm:flex-row justify-between items-center gap-4 bg-background transition-colors duration-300">
      <div>
        © {new Date().getFullYear()} AISRL. All Rights Reserved.
      </div>
      <div className="flex gap-6">
        <a href="mailto:reynaldo.salaki@unsrat.ac.id" className="hover:text-foreground transition-colors">Prof. Reynaldo Joshua Salaki</a>
        <a href="https://www.unsrat.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">UNSRAT</a>
      </div>
    </footer>
  );
}
