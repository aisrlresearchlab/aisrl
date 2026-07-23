"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  // GSAP: Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".fade-item", { opacity: 0, y: 15 });
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });
      
      tl.to(".fade-item", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-background text-foreground flex flex-col font-sans selection:bg-accent selection:text-background"
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
          <span className="fade-item text-xs font-mono tracking-widest uppercase text-accent">
            Welcome to the Applied Intelligent Systems Research Lab (AISRL)
          </span>
          <h1 className="fade-item font-serif text-5xl md:text-7xl font-extralight tracking-tight leading-tight">
            Applied Intelligent Systems
          </h1>
          <p className="fade-item text-muted font-serif text-lg italic max-w-2xl">
            Designing data engineering pipelines, intelligent software architectures, and automated system optimizations.
          </p>
        </div>

        <hr className="fade-item border-t border-keel" />

        {/* Lab Overview Block */}
        <div className="fade-item grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-4">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h2 className="font-serif text-3xl font-light">Research Vision</h2>
            <p className="font-light leading-relaxed text-muted text-sm md:text-base">
              Our research group explores the intersection of data-driven systems, software engineering, and intelligent computing to solve real-world problems. We focus on building tools and frameworks that process, manage, and analyze large-scale datasets.
            </p>
            <p className="font-light leading-relaxed text-muted text-sm md:text-base">
              By leveraging advanced machine learning models, cloud/edge databases, and modern software design patterns, we develop robust, scalable applications. Our current projects cover solar grid data analytics, mobile digital health software, and agile data warehousing for smart enterprise decisions.
            </p>
          </div>
          <div className="flex flex-col justify-center p-6 border border-keel rounded bg-stone-50/50 dark:bg-stone-900/10">
            <span className="font-serif text-5xl font-extralight text-accent mb-2">12+</span>
            <span className="text-xs tracking-widest uppercase font-light text-muted">Active Researchers</span>
            <span className="font-serif text-5xl font-extralight text-accent mt-6 mb-2">40+</span>
            <span className="text-xs tracking-widest uppercase font-light text-muted">Publications & Patents</span>
          </div>
        </div>
      </section>

      {/* Professor Biography Section */}
      <section
        ref={bioRef}
        className="w-full border-t border-keel bg-stone-50/30 dark:bg-stone-900/5 py-12 md:py-24"
      >
        <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Portrait Column */}
          <div className="fade-item col-span-1 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded border border-keel bg-stone-100 dark:bg-stone-850 aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lecturer_profile.png"
                alt="Prof. Reynaldo Joshua Salaki"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".prof-fallback");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div className="prof-fallback hidden w-full h-full flex items-center justify-center font-serif text-4xl font-light text-muted bg-stone-200 dark:bg-stone-800">
                RJS
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium tracking-tight">Reynaldo Joshua Salaki</h3>
              <p className="text-xs tracking-widest uppercase font-light text-muted">Lecturer / Researcher</p>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 text-xs font-mono text-muted border-t border-keel pt-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><rect width="20" height="16" rx="2" y="4" x="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:reynaldo.salaki@unsrat.ac.id" className="hover:text-accent transition-colors">reynaldo.salaki@unsrat.ac.id</a>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Dept. of Informatics, Universitas Sam Ratulangi</span>
              </div>
            </div>
          </div>

          {/* Bio details Column */}
          <div className="fade-item col-span-1 md:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-4xl font-light">Biography</h2>
              <hr className="border-t border-keel w-16" />
            </div>

            <div className="flex flex-col gap-6 font-light leading-relaxed text-muted text-sm md:text-base">
              <p>
                Reynaldo Joshua Salaki is an Indonesian academic, IT expert, and researcher born in Manado. He serves as a lecturer in the Informatics Engineering program at Universitas Sam Ratulangi and is a civil servant (ASN) within the Indonesian Ministry of Education, Culture, Research, and Technology.
              </p>
              <p>
                His academic pursuits led him to Kangwon National University, South Korea, where he is conducting doctoral research in Electronics, Information, and Communication Engineering. He is also a prominent author, having published texts on data warehousing frameworks for business intelligence, and frequently presents research on Indonesian renewable energy roadmaps.
              </p>
            </div>

            {/* Academic history */}
            <div className="flex flex-col gap-4 mt-4">
              <h4 className="font-serif text-xl font-medium tracking-tight">Academic History</h4>
              <ul className="flex flex-col gap-3 text-xs md:text-sm font-light text-muted list-none pl-0">
                <li className="flex gap-4 border-l border-keel pl-4">
                  <span className="font-mono text-accent font-medium">2022-2025</span>
                  <span>Ph.D. in Electronics, Information, and Communication Engineering (Outstanding Academic Award Recipient), Kangwon National University</span>
                </li>
                <li className="flex gap-2 border-l border-keel pl-4">
                  <span className="font-mono text-accent font-medium">2017-2018</span>
                  <span>M.S. in Information Technology Management (with Distinction), Staffordshire University</span>
                </li>
                <li className="flex gap-4 border-l border-keel pl-4">
                  <span className="font-mono text-accent font-medium">2012-2016</span>
                  <span>B.S. in Information and Communication Technology Education (Cum Laude), Universitas Negeri Manado</span>
                </li>
              </ul>
            </div>

            {/* Research interests */}
            <div className="flex flex-col gap-4 mt-4">
              <h4 className="font-serif text-xl font-medium tracking-tight">Research Interests</h4>
              <div className="flex flex-wrap gap-2 text-xs font-light">
                {[
                  "Applied Intelligent Systems & Software Engineering",
                  "Data-driven Architectures & Cloud Computing",
                  "Data Warehousing & Agile Business Intelligence",
                  "Digital Health Software (Patient Monitoring Apps)",
                  "Intelligent Decision Support Systems",
                ].map((interest) => (
                  <span
                    key={interest}
                    className="px-3.5 py-1.5 rounded border border-keel bg-background text-muted"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
