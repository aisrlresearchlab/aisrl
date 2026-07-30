"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Member, Publication, NewsItem } from "@/lib/data";

interface AdminClientProps {
  initialMembers: Member[];
  initialPublications: Publication[];
  initialNews: NewsItem[];
}

export default function AdminClient({
  initialMembers,
  initialPublications,
  initialNews,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"members" | "publications" | "news">("members");
  
  // Data States (synced with localStorage)
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [news, setNews] = useState<NewsItem[]>(initialNews);

  // Pagination states for each category (Limit to 10 items)
  const [membersPage, setMembersPage] = useState(1);
  const [pubsPage, setPubsPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const itemsPerPage = 10;

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

  // Sync from localStorage on mount and register storage listeners
  useEffect(() => {
    const loadStoredData = () => {
      // 1. Members
      const storedMembers = localStorage.getItem("aisrl_members");
      if (storedMembers) {
        try { setMembers(JSON.parse(storedMembers)); } catch(e) { console.error(e); }
      } else {
        localStorage.setItem("aisrl_members", JSON.stringify(initialMembers));
      }

      // 2. Publications
      const storedPubs = localStorage.getItem("aisrl_publications");
      if (storedPubs) {
        try { setPublications(JSON.parse(storedPubs)); } catch(e) { console.error(e); }
      } else {
        localStorage.setItem("aisrl_publications", JSON.stringify(initialPublications));
      }

      // 3. News
      const storedNews = localStorage.getItem("aisrl_news");
      if (storedNews) {
        try { setNews(JSON.parse(storedNews)); } catch(e) { console.error(e); }
      } else {
        localStorage.setItem("aisrl_news", JSON.stringify(initialNews));
      }
    };

    loadStoredData();

    window.addEventListener("storage", loadStoredData);
    return () => window.removeEventListener("storage", loadStoredData);
  }, [initialMembers, initialPublications, initialNews]);

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

  // GSAP: Transition on Tab Change & Page Switch
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentAreaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab, membersPage, pubsPage, newsPage]);

  // Save changes helper to localStorage
  const persistMembers = (updated: Member[]) => {
    setMembers(updated);
    localStorage.setItem("aisrl_members", JSON.stringify(updated));
  };

  const persistPublications = (updated: Publication[]) => {
    setPublications(updated);
    localStorage.setItem("aisrl_publications", JSON.stringify(updated));
  };

  const persistNews = (updated: NewsItem[]) => {
    setNews(updated);
    localStorage.setItem("aisrl_news", JSON.stringify(updated));
  };

  // DELETE Handlers
  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    persistMembers(updated);
    // Correct page if it becomes empty
    const newMaxPage = Math.max(1, Math.ceil(updated.length / itemsPerPage));
    if (membersPage > newMaxPage) {
      setMembersPage(newMaxPage);
    }
  };

  const handleDeletePub = (id: string) => {
    const updated = publications.filter((p) => p.id !== id);
    persistPublications(updated);
    const newMaxPage = Math.max(1, Math.ceil(updated.length / itemsPerPage));
    if (pubsPage > newMaxPage) {
      setPubsPage(newMaxPage);
    }
  };

  const handleDeleteNews = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    persistNews(updated);
    const newMaxPage = Math.max(1, Math.ceil(updated.length / itemsPerPage));
    if (newsPage > newMaxPage) {
      setNewsPage(newMaxPage);
    }
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
      const updated = members.map((m) => (m.id === editingId ? { ...m, ...memberForm } : m));
      persistMembers(updated);
    } else {
      const newMember: Member = {
        id: `member-${Date.now()}`,
        ...memberForm,
      };
      const updated = [...members, newMember];
      persistMembers(updated);
      // Go to last page to see new item
      setMembersPage(Math.ceil(updated.length / itemsPerPage));
    }
    closeForm();
  };

  const handleSavePub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title || !pubForm.authors) return;

    if (editingId) {
      const updated = publications.map((p) => (p.id === editingId ? { ...p, ...pubForm } : p));
      persistPublications(updated);
    } else {
      const newPub: Publication = {
        id: `pub-${Date.now()}`,
        ...pubForm,
      };
      const updated = [...publications, newPub];
      persistPublications(updated);
      setPubsPage(Math.ceil(updated.length / itemsPerPage));
    }
    closeForm();
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return;

    if (editingId) {
      const updated = news.map((n) => (n.id === editingId ? { ...n, ...newsForm } : n));
      persistNews(updated);
    } else {
      const newNews: NewsItem = {
        id: `news-${Date.now()}`,
        ...newsForm,
      };
      const updated = [...news, newNews];
      persistNews(updated);
      setNewsPage(Math.ceil(updated.length / itemsPerPage));
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
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

  // Pagination Slice Calculators
  const totalMembersPages = Math.ceil(members.length / itemsPerPage);
  const paginatedMembers = members.slice(
    (membersPage - 1) * itemsPerPage,
    membersPage * itemsPerPage
  );

  const totalPubsPages = Math.ceil(publications.length / itemsPerPage);
  const paginatedPubs = publications.slice(
    (pubsPage - 1) * itemsPerPage,
    pubsPage * itemsPerPage
  );

  const totalNewsPages = Math.ceil(news.length / itemsPerPage);
  const paginatedNews = news.slice(
    (newsPage - 1) * itemsPerPage,
    newsPage * itemsPerPage
  );

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
            Edit the data here, and it will immediately reflect across your public pages using local persistence.
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
                className={`pb-3 px-4 border-b-2 transition-all duration-205 cursor-pointer ${
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col border border-keel rounded overflow-hidden">
                <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                  <span className="col-span-4">Member Name</span>
                  <span className="col-span-2">Category</span>
                  <span className="col-span-4">Role Description</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>
                <div className="flex flex-col divide-y divide-keel">
                  {paginatedMembers.map((m) => (
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
              
              {/* Pagination Footer */}
              {totalMembersPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 font-mono text-xs tracking-widest uppercase">
                  <button
                    onClick={() => setMembersPage((p) => Math.max(1, p - 1))}
                    disabled={membersPage === 1}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalMembersPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setMembersPage(p)}
                      className={`w-6 h-6 rounded border transition ${
                        membersPage === p
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "border-keel text-muted hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setMembersPage((p) => Math.min(totalMembersPages, p + 1))}
                    disabled={membersPage === totalMembersPages}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PUBLICATIONS LIST */}
          {activeTab === "publications" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col border border-keel rounded overflow-hidden">
                <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                  <span className="col-span-5">Publication Title</span>
                  <span className="col-span-3">Authors</span>
                  <span className="col-span-2">Category</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>
                <div className="flex flex-col divide-y divide-keel">
                  {paginatedPubs.map((p) => (
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
              
              {/* Pagination Footer */}
              {totalPubsPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 font-mono text-xs tracking-widest uppercase">
                  <button
                    onClick={() => setPubsPage((p) => Math.max(1, p - 1))}
                    disabled={pubsPage === 1}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPubsPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPubsPage(p)}
                      className={`w-6 h-6 rounded border transition ${
                        pubsPage === p
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "border-keel text-muted hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPubsPage((p) => Math.min(totalPubsPages, p + 1))}
                    disabled={pubsPage === totalPubsPages}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* NEWS LIST */}
          {activeTab === "news" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col border border-keel rounded overflow-hidden">
                <div className="grid grid-cols-12 bg-stone-50/80 dark:bg-stone-900/40 p-4 border-b border-keel text-xs tracking-widest uppercase text-muted font-light">
                  <span className="col-span-3">Date</span>
                  <span className="col-span-5">Notice Title</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>
                <div className="flex flex-col divide-y divide-keel">
                  {paginatedNews.map((n) => (
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

              {/* Pagination Footer */}
              {totalNewsPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 font-mono text-xs tracking-widest uppercase">
                  <button
                    onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
                    disabled={newsPage === 1}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalNewsPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewsPage(p)}
                      className={`w-6 h-6 rounded border transition ${
                        newsPage === p
                          ? "bg-foreground text-background border-foreground font-semibold"
                          : "border-keel text-muted hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setNewsPage((p) => Math.min(totalNewsPages, p + 1))}
                    disabled={newsPage === totalNewsPages}
                    className="px-2.5 py-1 border border-keel rounded hover:border-accent disabled:opacity-30 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
