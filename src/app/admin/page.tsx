"use client";

import React, { useState, useEffect, useRef } from "react";
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

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  date: string;
  link: string;
  category: "Intl. Journals" | "Intl. Conferences" | "Patents";
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  type: "Notice" | "Press Release" | "Lab News";
  content: string;
}

// Initial Data
const INITIAL_MEMBERS: Member[] = [
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
    id: "bach-ethan",
    nameEn: "Ethan Hunt",
    nameKo: "에단 헌트",
    category: "bachelor",
    course: "Bachelor Student (Undergraduate Researcher, Senior)",
    email: "ehunt",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  }
];

const INITIAL_PUBLICATIONS: Publication[] = [
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
  }
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "John Doe receives Best Presentation Award at BK Workshop",
    date: "2026-06-25",
    type: "Notice",
    content: "Our PhD candidate, John Doe, has been awarded the Best Presentation Award for his research on edge middleware optimization for distributed computing.",
  },
  {
    id: "news-2",
    title: "We welcome new undergraduate researchers Olivia Vance and Ethan Hunt",
    date: "2025-09-01",
    type: "Lab News",
    content: "Olivia Vance and Ethan Hunt have joined the lab as undergraduate researchers starting Fall 2025.",
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"members" | "publications" | "news">("members");
  
  // Data States
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [publications, setPublications] = useState<Publication[]>(INITIAL_PUBLICATIONS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [memberForm, setMemberForm] = useState<Omit<Member, "id">>({
    nameEn: "",
    nameKo: "",
    category: "phd",
    course: "",
    email: "",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  });

  const [pubForm, setPubForm] = useState<Omit<Publication, "id">>({
    title: "",
    authors: "",
    venue: "",
    date: "",
    link: "",
    category: "Intl. Journals",
  });

  const [newsForm, setNewsForm] = useState<Omit<NewsItem, "id">>({
    title: "",
    date: "",
    type: "Notice",
    content: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // GSAP: Entry Animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cms-fade", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // GSAP: Transition on Tab Change
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentAreaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  // DELETE Handlers
  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleDeletePub = (id: string) => {
    setPublications(publications.filter((p) => p.id !== id));
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((n) => n.id !== id));
  };

  // EDIT Opening Handlers
  const startEditMember = (m: Member) => {
    setEditingId(m.id);
    setMemberForm({
      nameEn: m.nameEn,
      nameKo: m.nameKo,
      category: m.category,
      course: m.course,
      email: m.email,
      emailDomain: m.emailDomain,
      homepage: m.homepage,
      image: m.image,
    });
    setIsFormOpen(true);
  };

  const startEditPub = (p: Publication) => {
    setEditingId(p.id);
    setPubForm({
      title: p.title,
      authors: p.authors,
      venue: p.venue,
      date: p.date,
      link: p.link,
      category: p.category,
    });
    setIsFormOpen(true);
  };

  const startEditNews = (n: NewsItem) => {
    setEditingId(n.id);
    setNewsForm({
      title: n.title,
      date: n.date,
      type: n.type,
      content: n.content,
    });
    setIsFormOpen(true);
  };

  // CREATE / SAVE Handlers
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.nameEn || !memberForm.course) return;

    if (editingId) {
      setMembers(
        members.map((m) => (m.id === editingId ? { ...m, ...memberForm } : m))
      );
    } else {
      const newMember: Member = {
        id: `member-${Date.now()}`,
        ...memberForm,
      };
      setMembers([...members, newMember]);
    }
    closeForm();
  };

  const handleSavePub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title || !pubForm.authors) return;

    if (editingId) {
      setPublications(
        publications.map((p) => (p.id === editingId ? { ...p, ...pubForm } : p))
      );
    } else {
      const newPub: Publication = {
        id: `pub-${Date.now()}`,
        ...pubForm,
      };
      setPublications([...publications, newPub]);
    }
    closeForm();
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return;

    if (editingId) {
      setNews(
        news.map((n) => (n.id === editingId ? { ...n, ...newsForm } : n))
      );
    } else {
      const newNews: NewsItem = {
        id: `news-${Date.now()}`,
        ...newsForm,
      };
      setNews([...news, newNews]);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    // Reset Forms
    setMemberForm({
      nameEn: "",
      nameKo: "",
      category: "phd",
      course: "",
      email: "",
      emailDomain: "unsrat.ac.id",
      homepage: "",
      image: "",
    });
    setPubForm({
      title: "",
      authors: "",
      venue: "",
      date: "",
      link: "",
      category: "Intl. Journals",
    });
    setNewsForm({
      title: "",
      date: "",
      type: "Notice",
      content: "",
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-background text-foreground flex flex-col font-sans selection:bg-accent selection:text-background min-h-screen"
    >
      <main className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
        
        {/* Editorial Heading */}
        <div className="flex flex-col gap-4 cms-fade">
          <span className="text-xs font-mono tracking-widest uppercase text-accent">
            AISRL Administration Console
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-extralight tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted font-serif text-lg italic max-w-xl">
            A beautiful, lightweight dashboard to mock create, read, update, and delete members, papers, and notice board announcements.
          </p>
        </div>

        {/* Keel Dividing Line */}
        <hr className="border-t border-keel cms-fade" />

        {/* Tab Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 cms-fade">
          {/* Tabs */}
          <div className="flex border-b border-keel text-xs md:text-sm tracking-wider uppercase font-light">
            {(["members", "publications", "news"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  closeForm();
                }}
                className={`pb-3 px-4 border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "border-accent text-foreground font-medium"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-background hover:opacity-90 transition-opacity font-mono text-xs tracking-wider uppercase cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add {activeTab === "members" ? "Member" : activeTab === "publications" ? "Publication" : "Notice"}
          </button>
        </div>

        {/* Dynamic Edit / Add Form Drawer */}
        {isFormOpen && (
          <div className="border border-keel bg-stone-50/50 dark:bg-stone-900/10 p-6 rounded transition-all duration-300 cms-fade">
            <h2 className="font-serif text-2xl font-light mb-6 border-b border-keel pb-2">
              {editingId ? "Edit Item Details" : `Add New ${activeTab.toUpperCase()}`}
            </h2>

            {/* MEMBER FORM */}
            {activeTab === "members" && (
              <form onSubmit={handleSaveMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">English Name *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.nameEn}
                    onChange={(e) => setMemberForm({ ...memberForm, nameEn: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. Jane Watson"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Korean Name</label>
                  <input
                    type="text"
                    value={memberForm.nameKo}
                    onChange={(e) => setMemberForm({ ...memberForm, nameKo: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. 제인 왓슨"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Category *</label>
                  <select
                    value={memberForm.category}
                    onChange={(e) => setMemberForm({ ...memberForm, category: e.target.value as any })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                  >
                    <option value="professor">Professor</option>
                    <option value="phd">PhD Candidate</option>
                    <option value="ms">MS Candidate</option>
                    <option value="bachelor">Bachelor Degree</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Course / Description *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.course}
                    onChange={(e) => setMemberForm({ ...memberForm, course: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. MS Candidate (Entry: '25) - Data Systems"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Email Address *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      className="flex-1 p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                      placeholder="e.g. jwatson"
                    />
                    <span className="self-center text-muted font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={memberForm.emailDomain}
                      onChange={(e) => setMemberForm({ ...memberForm, emailDomain: e.target.value })}
                      className="w-1/3 p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                      placeholder="unsrat.ac.id"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Homepage Link</label>
                  <input
                    type="url"
                    value={memberForm.homepage}
                    onChange={(e) => setMemberForm({ ...memberForm, homepage: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="px-5 py-2 bg-accent text-background rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Save Changes</button>
                  <button type="button" onClick={closeForm} className="px-5 py-2 border border-keel text-muted rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Cancel</button>
                </div>
              </form>
            )}

            {/* PUBLICATION FORM */}
            {activeTab === "publications" && (
              <form onSubmit={handleSavePub} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Title *</label>
                  <input
                    type="text"
                    required
                    value={pubForm.title}
                    onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. Distributed Database Management Protocols in Cloud Architecture"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Authors *</label>
                  <input
                    type="text"
                    required
                    value={pubForm.authors}
                    onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. Emily Watson, Reynaldo Joshua Salaki"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Venue / Journal *</label>
                  <input
                    type="text"
                    required
                    value={pubForm.venue}
                    onChange={(e) => setPubForm({ ...pubForm, venue: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. Journal of Systems Software, vol. 12"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Category *</label>
                  <select
                    value={pubForm.category}
                    onChange={(e) => setPubForm({ ...pubForm, category: e.target.value as any })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                  >
                    <option value="Intl. Journals">International Journal</option>
                    <option value="Intl. Conferences">International Conference</option>
                    <option value="Patents">Patent</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Publication Date *</label>
                  <input
                    type="month"
                    required
                    value={pubForm.date}
                    onChange={(e) => setPubForm({ ...pubForm, date: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">DOI / Link</label>
                  <input
                    type="url"
                    value={pubForm.link}
                    onChange={(e) => setPubForm({ ...pubForm, link: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="https://doi.org/..."
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="px-5 py-2 bg-accent text-background rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Save Changes</button>
                  <button type="button" onClick={closeForm} className="px-5 py-2 border border-keel text-muted rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Cancel</button>
                </div>
              </form>
            )}

            {/* NEWS FORM */}
            {activeTab === "news" && (
              <form onSubmit={handleSaveNews} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Title *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                    placeholder="e.g. John Doe receives Research Presentation Award"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Category *</label>
                  <select
                    value={newsForm.type}
                    onChange={(e) => setNewsForm({ ...newsForm, type: e.target.value as any })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Lab News">Lab News</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Date *</label>
                  <input
                    type="date"
                    required
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-muted font-light">Content *</label>
                  <textarea
                    required
                    rows={4}
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    className="p-2.5 bg-background border border-keel rounded text-sm focus:border-accent outline-none font-sans leading-relaxed"
                    placeholder="Enter detailed notice description here..."
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" className="px-5 py-2 bg-accent text-background rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Save Changes</button>
                  <button type="button" onClick={closeForm} className="px-5 py-2 border border-keel text-muted rounded text-xs font-mono uppercase tracking-widest cursor-pointer">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Content Area / List Tables */}
        <div ref={contentAreaRef} className="cms-fade">
          
          {/* MEMBERS LIST */}
          {activeTab === "members" && (
            <div className="flex flex-col border border-keel rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                <span className="col-span-4">Member Name</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-4">Role Description</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              <div className="flex flex-col divide-y divide-keel">
                {members.map((m) => (
                  <div key={m.id} className="grid grid-cols-12 p-4 items-center text-sm font-light">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-keel flex items-center justify-center font-serif text-sm bg-stone-100 dark:bg-stone-850 select-none">
                        {m.nameEn.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-base">{m.nameEn}</span>
                        <span className="text-xs text-muted font-light">{m.nameKo}</span>
                      </div>
                    </div>
                    <span className="col-span-2 capitalize text-xs tracking-wider text-muted font-mono">{m.category}</span>
                    <span className="col-span-4 text-xs text-muted truncate max-w-xs">{m.course}</span>
                    <div className="col-span-2 flex justify-end gap-3 text-xs font-mono uppercase tracking-wider text-accent font-medium">
                      <button onClick={() => startEditMember(m)} className="hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteMember(m.id)} className="text-destructive hover:underline cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PUBLICATIONS LIST */}
          {activeTab === "publications" && (
            <div className="flex flex-col border border-keel rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                <span className="col-span-5">Publication Title</span>
                <span className="col-span-3">Authors</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              <div className="flex flex-col divide-y divide-keel">
                {publications.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 p-4 items-center text-sm font-light">
                    <div className="col-span-5 flex flex-col pr-4">
                      <span className="font-serif text-base leading-snug truncate max-w-md">&ldquo;{p.title}&rdquo;</span>
                      <span className="text-xs text-muted mt-0.5 italic">{p.venue}</span>
                    </div>
                    <span className="col-span-3 text-xs text-muted truncate pr-4">{p.authors}</span>
                    <span className="col-span-2 text-xs text-muted font-mono">{p.category}</span>
                    <div className="col-span-2 flex justify-end gap-3 text-xs font-mono uppercase tracking-wider text-accent font-medium">
                      <button onClick={() => startEditPub(p)} className="hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => handleDeletePub(p.id)} className="text-destructive hover:underline cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEWS LIST */}
          {activeTab === "news" && (
            <div className="flex flex-col border border-keel rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                <span className="col-span-3">Date</span>
                <span className="col-span-5">Notice Title</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              <div className="flex flex-col divide-y divide-keel">
                {news.map((n) => (
                  <div key={n.id} className="grid grid-cols-12 p-4 items-center text-sm font-light">
                    <span className="col-span-3 font-mono text-xs text-muted">{n.date}</span>
                    <span className="col-span-5 font-serif text-base truncate max-w-md pr-4">{n.title}</span>
                    <span className="col-span-2 text-xs text-muted font-mono">{n.type}</span>
                    <div className="col-span-2 flex justify-end gap-3 text-xs font-mono uppercase tracking-wider text-accent font-medium">
                      <button onClick={() => startEditNews(n)} className="hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteNews(n.id)} className="text-destructive hover:underline cursor-pointer">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
