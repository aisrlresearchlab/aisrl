"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { gsap } from "gsap";

interface Member {
  id: string;
  nameEn: string;
  nameKo: string;
  category: "professor" | "phd" | "ms" | "bachelor" | "alumni";
  course: string;
  email: string;
  emailDomain: string;
  homepage: string;
  image: string;
}

const MEMBERS_DATA: Member[] = [
  {
    id: "prof-salaki",
    nameEn: "Reynaldo Joshua Salaki",
    nameKo: "레이날도 살라키",
    category: "professor",
    course: "Lecturer & AISRL Director",
    email: "reynaldo.salaki",
    emailDomain: "unsrat.ac.id",
    homepage: "mailto:reynaldo.salaki@unsrat.ac.id",
    image: "/lecturer_profile.png",
  },
  {
    id: "phd-john-doe",
    nameEn: "John Doe",
    nameKo: "존 도",
    category: "phd",
    course: "PhD Candidate (Entry: '22) - Researching Data-Intensive Software Systems",
    email: "johndoe",
    emailDomain: "lab.edu",
    homepage: "https://linkedin.com/",
    image: "",
  },
  {
    id: "phd-emily",
    nameEn: "Emily Watson",
    nameKo: "에밀리 왓슨",
    category: "phd",
    course: "PhD Candidate (Entry: '23) - Researching Digital Health Systems",
    email: "emily.w",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "phd-michael",
    nameEn: "Michael Chang",
    nameKo: "마이클 창",
    category: "phd",
    course: "PhD Candidate (Entry: '24) - Researching Smart Grid Anomalies",
    email: "mchang",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "phd-sarah",
    nameEn: "Sarah Jenkins",
    nameKo: "사라 젠킨스",
    category: "phd",
    course: "PhD Candidate (Entry: '24) - Researching Activity Recognition",
    email: "sjenkins",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-david",
    nameEn: "David Miller",
    nameKo: "데이비드 밀러",
    category: "ms",
    course: "MS Candidate (Entry: '24) - Mobile Computing Systems",
    email: "dmiller",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-sophia",
    nameEn: "Sophia Li",
    nameKo: "소피아 리",
    category: "ms",
    course: "MS Candidate (Entry: '25) - Wireless Sensor Networks",
    email: "sli",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-lucas",
    nameEn: "Lucas Martinez",
    nameKo: "루카스 마르티네즈",
    category: "ms",
    course: "MS Candidate (Entry: '25) - Solar Grid Computing",
    email: "lmartinez",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "bach-ethan",
    nameEn: "Ethan Hunt",
    nameKo: "에단 헌트",
    category: "bachelor",
    course: "Bachelor Student (Undergraduate Researcher, Senior)",
    email: "ehunt",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "bach-olivia",
    nameEn: "Olivia Vance",
    nameKo: "올리비아 밴스",
    category: "bachelor",
    course: "Bachelor Student (Undergraduate Researcher, Junior)",
    email: "ovance",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-alexander",
    nameEn: "Alexander Clark",
    nameKo: "알렉산더 클라크",
    category: "alumni",
    course: "PhD Graduate ('23) - Now Machine Learning Engineer",
    email: "aclark",
    emailDomain: "techcorp.com",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-chloe",
    nameEn: "Chloe Taylor",
    nameKo: "클로이 테일러",
    category: "alumni",
    course: "MS Graduate ('24) - Now Software Engineer",
    email: "ctaylor",
    emailDomain: "softsolutions.com",
    homepage: "",
    image: "",
  }
];

export default function MembersPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter Logic with React useTransition for fluid typing performance
  const filteredMembers = MEMBERS_DATA.filter((member) => {
    const matchesCategory =
      selectedCategory === "all" || member.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName =
      member.nameEn.toLowerCase().includes(query) ||
      member.nameKo.includes(query);
    const matchesCourse = member.course.toLowerCase().includes(query);
    const matchesEmail = member.email.toLowerCase().includes(query);

    return matchesCategory && (matchesName || matchesCourse || matchesEmail);
  });

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

  // GSAP: Filter / Search Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = listRef.current?.querySelectorAll(".member-card");
      if (cards && cards.length > 0) {
        gsap.killTweensOf(cards);
        
        // Stagger fade-in animation for filtered list
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
  }, [selectedCategory, searchQuery]);

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
            alt={member.nameEn}
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
        {member.nameEn.charAt(0)}
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
              {isPending ? "Filtering..." : `Showing ${filteredMembers.length} of ${MEMBERS_DATA.length} Members`}
            </span>
            <span className="hidden sm:inline">Applied Intelligent Systems Research Lab (AISRL)</span>
          </div>
        </div>

        {/* Member Grid List */}
        <div
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
        >
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
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
                          {member.nameEn}
                        </h2>
                        <span className="text-muted text-sm font-light">
                          {member.nameKo}
                        </span>
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
      </main>
    </div>
  );
}
