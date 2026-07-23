"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { gsap } from "gsap";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  date: string;
  link: string;
  category: "Intl. Journals" | "Intl. Conferences" | "Patents";
}

const PUBLICATIONS_DATA: Publication[] = [
  {
    id: "pub-1",
    title: "Adaptive Edge Middleware for Distributed Machine Learning Protocols",
    authors: "John Doe, Reynaldo Joshua Salaki",
    venue: "Journal of Network Computing, vol. 20, no. 4, pp. 240-255, 2026.",
    date: "2026-06",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-2",
    title: "Real-Time Sensor Drift Calibration using Recurrent Neural Networks in Smart Spaces",
    authors: "Emily Watson, Michael Chang, Reynaldo Joshua Salaki",
    venue: "IEEE Transactions on Instrumentation and Measurement, vol. 35, no. 2, pp. 1100-1115, 2026.",
    date: "2026-05",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-3",
    title: "A Deep Learning Framework for Anomaly Detection in Solar Smart Grids",
    authors: "Michael Chang, Lucas Martinez, Reynaldo Joshua Salaki",
    venue: "IEEE Access, vol. 14, pp. 1200-1215, Apr. 2026.",
    date: "2026-04",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-4",
    title: "Distributed Optimization for Federated Learning over Heterogeneous IoT Networks",
    authors: "Sarah Jenkins, David Miller, Reynaldo Joshua Salaki",
    venue: "Proceedings of IEEE INFOCOM 2025, pp. 880-889.",
    date: "2025-05",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-5",
    title: "Mobile Patient Health Tracker using IoT Edge Processing",
    authors: "Sophia Li, Reynaldo Joshua Salaki",
    venue: "Proceedings of ACM MobiCom 2025, pp. 312-321.",
    date: "2025-10",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-6",
    title: "System and method for machine-learning-based solar panel fault classification",
    authors: "Reynaldo Joshua Salaki, Michael Chang",
    venue: "International Patent Registration, No. WO-2025-012345, 2025.",
    date: "2025-09",
    link: "",
    category: "Patents",
  }
];

export default function PublicationsPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredPubs = PUBLICATIONS_DATA.filter((pub) => {
    const matchesCategory =
      selectedCategory === "all" || pub.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesTitle = pub.title.toLowerCase().includes(query);
    const matchesAuthors = pub.authors.toLowerCase().includes(query);
    const matchesVenue = pub.venue.toLowerCase().includes(query);

    return matchesCategory && (matchesTitle || matchesAuthors || matchesVenue);
  });

  // GSAP: Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".entry-fade", { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: -20 });
      gsap.set(controlsRef.current, { opacity: 0, y: 15 });
      gsap.set(".pub-card", { opacity: 0, y: 20 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".entry-fade", { opacity: 1, duration: 0.6 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".pub-card", { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP: Filter animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = listRef.current?.querySelectorAll(".pub-card");
      if (cards && cards.length > 0) {
        gsap.killTweensOf(cards);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 12, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCategory, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  // Helper to bold lab authors
  const formatAuthors = (authorsStr: string) => {
    const members = ["John Doe", "Emily Watson", "Michael Chang", "Reynaldo Joshua Salaki", "Sarah Jenkins", "Sophia Li", "David Miller", "Lucas Martinez"];
    const parts = authorsStr.split(/,\s*/);
    
    return parts.map((author, index) => {
      const isMember = members.some(m => author.includes(m));
      return (
        <span key={index}>
          {isMember ? <strong className="font-medium text-foreground">{author}</strong> : author}
          {index < parts.length - 1 ? ", " : ""}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-background text-foreground flex flex-col font-sans selection:bg-accent selection:text-background"
    >
      <main className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
        {/* Editorial Heading */}
        <div className="flex flex-col gap-4">
          <h1
            ref={titleRef}
            className="font-serif text-5xl md:text-7xl font-extralight tracking-tight"
          >
            Publications
          </h1>
          <p className="entry-fade text-muted font-serif text-lg italic max-w-xl">
            A chronological bibliography of international journals, conference proceedings, and patents registered by lab members.
          </p>
        </div>

        {/* Keel Dividing Line */}
        <hr className="border-t border-keel entry-fade" />

        {/* Interactive Controls Panel */}
        <div ref={controlsRef} className="flex flex-col gap-8">
          
          {/* Minimal Search Input Box */}
          <div className="relative border-b border-keel focus-within:border-accent transition-colors duration-300">
            <span className="absolute left-0 bottom-4 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search papers by title, authors, or venues..."
              value={inputValue}
              onChange={handleSearchChange}
              className="w-full pl-8 pb-4 bg-transparent outline-none border-none text-xl md:text-2xl font-light placeholder:text-stone-300 dark:placeholder:text-stone-700"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm tracking-wider uppercase font-light">
            <span className="text-muted mr-3">Filter:</span>
            {[
              { label: "All Works", value: "all" },
              { label: "Journals", value: "Intl. Journals" },
              { label: "Conferences", value: "Intl. Conferences" },
              { label: "Patents", value: "Patents" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-keel hover:border-muted text-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-between items-center text-xs tracking-widest uppercase text-muted font-light border-b border-keel pb-2">
            <span>
              {isPending ? "Filtering..." : `Showing ${filteredPubs.length} of ${PUBLICATIONS_DATA.length} Papers`}
            </span>
            <span className="hidden sm:inline">Applied Intelligent Systems Research Lab (AISRL)</span>
          </div>
        </div>

        {/* Publications List */}
        <div ref={listRef} className="flex flex-col gap-6">
          {filteredPubs.length > 0 ? (
            filteredPubs.map((pub) => (
              <div
                key={pub.id}
                className="pub-card group flex flex-col sm:flex-row justify-between gap-4 p-6 border border-keel hover:border-accent rounded transition-all duration-300 bg-stone-50/10 dark:bg-stone-900/5"
              >
                {/* Meta details */}
                <div className="flex-shrink-0 flex sm:flex-col gap-2 sm:gap-1 text-xs font-mono text-muted tracking-widest uppercase">
                  <span>{pub.date}</span>
                  <span className="hidden sm:inline font-sans font-light select-none">|</span>
                  <span className="px-2 py-0.5 rounded border border-keel bg-background text-[10px]">
                    {pub.category.split(" ")[1] || pub.category}
                  </span>
                </div>

                {/* Main Cite */}
                <div className="flex-grow flex flex-col gap-2">
                  <h3 className="font-serif text-xl font-light text-foreground leading-snug group-hover:text-accent transition-colors duration-200">
                    &ldquo;{pub.title}&rdquo;
                  </h3>
                  <p className="text-xs font-light text-muted leading-relaxed">
                    {formatAuthors(pub.authors)}
                  </p>
                  <p className="text-xs italic text-muted mt-1">
                    {pub.venue}
                  </p>
                </div>

                {/* Link */}
                {pub.link && (
                  <div className="flex-shrink-0 flex items-center">
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-keel hover:border-accent text-xs font-mono text-muted hover:text-foreground hover:bg-stone-50 dark:hover:bg-stone-900 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      DOI / Link
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-keel rounded">
              <p className="font-serif text-xl italic text-muted">
                No publications found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-xs font-mono uppercase tracking-widest text-accent hover:underline cursor-pointer"
              >
                Clear Search & Filter
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
