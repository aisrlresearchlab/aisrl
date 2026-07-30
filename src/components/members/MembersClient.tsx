"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { gsap } from "gsap";
import { Member } from "@/lib/data";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MembersClientProps {
  initialMembers: Member[];
}

export default function MembersClient({ initialMembers }: MembersClientProps) {
  // Sync state in real-time with Firestore collection
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Set up real-time listener for Firestore collection
  useEffect(() => {
    const colRef = collection(db, "members");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: Member[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Member);
        });
        setMembers(list);
      },
      (err) => {
        console.error("Firestore snapshot error, falling back to local dataset:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter Logic
  const filteredMembers = members.filter((member) => {
    const matchesCategory =
      selectedCategory === "all" || member.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = member.name.toLowerCase().includes(query);
    const matchesCourse = member.course.toLowerCase().includes(query);
    const matchesEmail = member.email.toLowerCase().includes(query);

    return matchesCategory && (matchesName || matchesCourse || matchesEmail);
  });

  // Paginated List
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // GSAP: Entry Animations on Mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial positions
      gsap.set(".entry-fade", { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: -20 });
      gsap.set(controlsRef.current, { opacity: 0, y: 15 });
      gsap.set(".member-card", { opacity: 0, y: 20 });

      // Run Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".entry-fade", { opacity: 1, duration: 0.6, stagger: 0.1 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(controlsRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".member-card", { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP: Filter / Search Animations & Page Switch Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = listRef.current?.querySelectorAll(".member-card");
      if (cards && cards.length > 0) {
        gsap.killTweensOf(cards);
        
        // Stagger fade-in animation for filtered/paginated list
        gsap.fromTo(
          cards,
          { opacity: 0, y: 12, scale: 0.98 },
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
  }, [selectedCategory, searchQuery, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  // Helper: Render Profile Picture or Elegant Typography Monogram
  const renderAvatar = (member: Member) => {
    const imageFailed = failedImages[member.id];
    if (member.image && !imageFailed) {
      return (
        <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded border border-keel bg-stone-50 dark:bg-stone-900 group-hover:border-accent transition-colors duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            onError={() => {
              setFailedImages((prev) => ({ ...prev, [member.id]: true }));
            }}
          />
        </div>
      );
    }

    return (
      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded border border-keel bg-stone-100 dark:bg-stone-800 font-serif text-2xl font-light text-muted group-hover:border-accent transition-colors duration-300">
        {member.name.charAt(0)}
      </div>
    );
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
            Members Search
          </h1>
          <p className="entry-fade text-muted font-serif text-lg italic max-w-xl">
            Directory of researchers, integrated PhD candidates, MS students, undergraduate assistants, and distinguished alumni.
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
              placeholder="Search by name, entry year, email or role..."
              value={inputValue}
              onChange={handleSearchChange}
              className="w-full pl-8 pb-4 bg-transparent outline-none border-none text-xl md:text-2xl font-light placeholder:text-stone-300 dark:placeholder:text-stone-700"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm tracking-wider uppercase font-light">
            <span className="text-muted mr-3">Filter:</span>
            {[
              { label: "All", value: "all" },
              { label: "Professor", value: "professor" },
              { label: "PhD Candidates", value: "phd" },
              { label: "MS Candidates", value: "ms" },
              { label: "Bachelor Degree", value: "bachelor" },
              { label: "Alumni", value: "alumni" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
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
              {isPending ? "Filtering..." : `Showing ${filteredMembers.length} Members`}
            </span>
            <span className="hidden sm:inline">Applied Intelligent Systems Research Lab (AISRL)</span>
          </div>
        </div>

        {/* Member Grid List */}
        <div
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
        >
          {paginatedMembers.length > 0 ? (
            paginatedMembers.map((member) => {
              const isProfessor = member.category === "professor";
              
              return (
                <div
                  key={member.id}
                  className={`member-card group flex gap-6 p-6 border border-keel hover:border-accent rounded transition-all duration-300 bg-stone-50/10 dark:bg-stone-900/5 ${
                    isProfessor
                      ? "col-span-1 md:col-span-2 bg-stone-50/50 dark:bg-stone-900/20"
                      : ""
                  }`}
                >
                  {/* Portrait Avatar */}
                  <div className="flex-shrink-0">
                    {renderAvatar(member)}
                  </div>

                  {/* Member Details */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <h2 className="font-serif text-2xl font-medium tracking-tight">
                          {member.name}
                        </h2>
                      </div>
                      
                      <p className="text-sm font-light text-muted mt-1 leading-relaxed">
                        {member.course}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4 text-xs font-mono text-muted tracking-tight">
                      {/* Email Section */}
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><rect width="20" height="16" rx="2" y="4" x="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <a
                          href={`mailto:${member.email}@${member.emailDomain}`}
                          className="hover:text-accent transition-colors"
                        >
                          {member.email}@{member.emailDomain}
                        </a>
                      </div>

                      {/* Homepage Section */}
                      {member.homepage && (
                        <div className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          <a
                            href={member.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition-colors truncate max-w-[200px] sm:max-w-xs"
                          >
                            {member.homepage.replace(/(^\w+:|^)\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-keel rounded">
              <p className="font-serif text-xl italic text-muted">
                No members found matching &ldquo;{searchQuery}&rdquo;.
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

        {/* Elegant Pagination Control Bar */}
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
