"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { gsap } from "gsap";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  type: "Notice" | "Press Release" | "Lab News";
  content: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "news-1",
    title: "John Doe receives Best Presentation Award at BK Workshop",
    date: "2026-06-25",
    type: "Notice",
    content: "Our PhD candidate, John Doe, has been awarded the Best Presentation Award for his research on edge middleware optimization for distributed computing. The research evaluates novel communication frameworks for federated systems.",
  },
  {
    id: "news-2",
    title: "Lab's solar grid fault detection project featured in Renewable Energy Spotlight",
    date: "2026-05-15",
    type: "Press Release",
    content: "Our recent paper on machine-learning-based solar panel fault classification was selected as a featured article in Renewable Energy Spotlight reviews.",
  },
  {
    id: "news-3",
    title: "We welcome new undergraduate researchers Olivia Vance and Ethan Hunt",
    date: "2025-09-01",
    type: "Lab News",
    content: "Olivia Vance and Ethan Hunt have joined the lab as undergraduate researchers starting Fall 2025. Olivia and Ethan will be working on IoT sensing and data analytics applications.",
  },
  {
    id: "news-4",
    title: "Edge Patient Health Tracker code repository released on GitHub",
    date: "2025-12-20",
    type: "Notice",
    content: "The official PyTorch implementation and dataset for our IoT patient monitoring systems have been open-sourced on GitHub. The framework uses edge networks to diagnose sensor anomalies.",
  }
];

export default function NewsPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredNews = NEWS_DATA.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesTitle = item.title.toLowerCase().includes(query);
    const matchesContent = item.content.toLowerCase().includes(query);

    return matchesType && (matchesTitle || matchesContent);
  });

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

  // GSAP: Filter animations
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
  }, [selectedType, searchQuery]);

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
              {isPending ? "Filtering..." : `Showing ${filteredNews.length} of ${NEWS_DATA.length} Items`}
            </span>
            <span className="hidden sm:inline">Applied Intelligent Systems Research Lab (AISRL)</span>
          </div>
        </div>

        {/* News list */}
        <div ref={listRef} className="flex flex-col gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
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
      </main>
    </div>
  );
}
