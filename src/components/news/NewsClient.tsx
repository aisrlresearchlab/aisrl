"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { gsap } from "gsap";
import { NewsItem } from "@/lib/data";

interface NewsClientProps {
  initialNews: NewsItem[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  // Sync state with localStorage to match Admin updates
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync from localStorage on mount and register listeners for cross-tab updates
  useEffect(() => {
    const loadStoredData = () => {
      const stored = localStorage.getItem("aisrl_news");
      if (stored) {
        try {
          setNews(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored news:", e);
        }
      } else {
        localStorage.setItem("aisrl_news", JSON.stringify(initialNews));
      }
    };

    loadStoredData();

    // Listen to local storage changes (for multiple open tabs)
    window.addEventListener("storage", loadStoredData);
    return () => window.removeEventListener("storage", loadStoredData);
  }, [initialNews]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchQuery]);

  // Filter Logic
  const filteredNews = news.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesTitle = item.title.toLowerCase().includes(query);
    const matchesContent = item.content.toLowerCase().includes(query);

    return matchesType && (matchesTitle || matchesContent);
  });

  // Paginated List
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // GSAP: Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".entry-fade", { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: -20 });
      gsap.set(controlsRef.current, { opacity: 0, y: 15 });
      gsap.set(".news-card", { opacity: 0, y: 20 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".entry-fade", { opacity: 1, duration: 0.6 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".news-card", { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP: Filter and Page switch animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = listRef.current?.querySelectorAll(".news-card");
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
  }, [selectedType, searchQuery, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    startTransition(() => {
      setSearchQuery(val);
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
            News & Notices
          </h1>
          <p className="entry-fade text-muted font-serif text-lg italic max-w-xl">
            Recent updates, awards, research highlights, and official notices from our group.
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
              placeholder="Search news and announcements..."
              value={inputValue}
              onChange={handleSearchChange}
              className="w-full pl-8 pb-4 bg-transparent outline-none border-none text-xl md:text-2xl font-light placeholder:text-stone-300 dark:placeholder:text-stone-700"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm tracking-wider uppercase font-light">
            <span className="text-muted mr-3">Filter:</span>
            {[
              { label: "All News", value: "all" },
              { label: "Notice", value: "Notice" },
              { label: "Press Release", value: "Press Release" },
              { label: "Lab News", value: "Lab News" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedType(cat.value)}
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedType === cat.value
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
              {isPending ? "Filtering..." : `Showing ${filteredNews.length} Items`}
            </span>
            <span className="hidden sm:inline">Applied Intelligent Systems Research Lab (AISRL)</span>
          </div>
        </div>

        {/* News list */}
        <div ref={listRef} className="flex flex-col gap-8">
          {paginatedNews.length > 0 ? (
            paginatedNews.map((news) => (
              <div
                key={news.id}
                className="news-card group flex flex-col gap-3 p-6 border border-keel hover:border-accent rounded transition-all duration-300 bg-stone-50/10 dark:bg-stone-900/5"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-muted tracking-widest uppercase">
                  <span>{news.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-keel group-hover:bg-accent transition-colors duration-300" />
                  <span className="px-2 py-0.5 rounded border border-keel bg-background text-[10px]">
                    {news.type}
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-light text-foreground group-hover:text-accent transition-colors duration-200">
                  {news.title}
                </h3>
                
                <p className="text-sm font-light text-muted leading-relaxed mt-1">
                  {news.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-keel rounded">
              <p className="font-serif text-xl italic text-muted">
                No news items found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                  setSelectedType("all");
                }}
                className="mt-4 text-xs font-mono uppercase tracking-widest text-accent hover:underline cursor-pointer"
              >
                Clear Search & Filter
              </button>
            </div>
          )}
        </div>

        {/* Elegant Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 font-mono text-xs tracking-widest uppercase border-t border-keel pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-keel rounded hover:border-accent disabled:opacity-30 disabled:hover:border-keel transition-all duration-200 cursor-pointer"
            >
              Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded border transition-all duration-200 cursor-pointer ${
                  currentPage === page
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "border-keel text-muted hover:border-muted hover:text-foreground"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-keel rounded hover:border-accent disabled:opacity-30 disabled:hover:border-keel transition-all duration-200 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
