import React, { useState, useEffect, FormEvent } from "react";
import * as Icons from "lucide-react";
import { TEMPLATES, COLOR_PALETTES } from "./data/templates";
import {
  LandingPage,
  SectionType,
  LandingPageSection,
  ColorPalette,
  Lead,
  PageMetric,
  HeaderSection,
  HeroSectionData,
  FeaturesSectionData,
  BenefitsSectionData,
  TestimonialsSectionData,
  PricingPlan,
  PricingSectionData,
  FaqSectionData,
  CtaUrgencyData,
  ContactFormData,
  FooterSectionData
} from "./types";

export default function App() {
  // Page collection & active selection
  const [pages, setPages] = useState<LandingPage[]>(() => {
    // Sync templates or custom pages from localstorage
    const local = localStorage.getItem("lander_pages");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return TEMPLATES;
      }
    }
    return TEMPLATES;
  });

  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [dashboardTab, setDashboardTab] = useState<"pages" | "analytics" | "leads" | "settings">("pages");

  // AI Scraper Inputs
  const [cloneUrl, setCloneUrl] = useState("");
  const [cloneDescription, setCloneDescription] = useState("");
  const [cloneTone, setCloneTone] = useState("SaaS Startup Hook");
  const [cloneStyle, setCloneStyle] = useState("Modern Purp Glow");
  const [isCloning, setIsCloning] = useState(false);
  const [cloneProgress, setCloneProgress] = useState<string[]>([]);
  const [widgetSearch, setWidgetSearch] = useState("");

  // Active sub-editor targeting
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  // High-performance Headline Generator State (sidebar)
  const [headlineTopic, setHeadlineTopic] = useState("");
  const [headlineAudience, setHeadlineAudience] = useState("");
  const [headlineStyle, setHeadlineStyle] = useState("Urgent Scarcity");
  const [aiHeadlines, setAiHeadlines] = useState<{ headline: string; subheadline: string }[]>([]);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);

  // Leads and metrics simulator
  const [leads, setLeads] = useState<Lead[]>(() => {
    const local = localStorage.getItem("lander_leads");
    if (local) {
      try { return JSON.parse(local); } catch (e) { return []; }
    }
    // Set some initial immersive sandbox leads for illustration
    return [
      {
        id: "lead-1",
        pageId: "temp-saas",
        pageTitle: "SaaS Product High-Convert",
        email: "sarah.connor@cyberdyne.io",
        name: "Sarah Connor",
        details: { message: "Looking for team-wide scale AI options." },
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "lead-2",
        pageId: "temp-saas",
        pageTitle: "SaaS Product High-Convert",
        email: "neo@matrix.net",
        name: "Thomas Anderson",
        details: { message: "Ready to override standard static builders." },
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "lead-3",
        pageId: "temp-affiliate",
        pageTitle: "Affiliate High-Converting Optin",
        email: "hustler99@gmail.com",
        name: "Jack Vance",
        createdAt: new Date(Date.now() - 15200000).toISOString()
      }
    ];
  });

  const [metrics, setMetrics] = useState<PageMetric[]>(() => {
    // Dynamic calculation from leads or initial configuration
    return [
      { pageId: "temp-saas", views: 1840, clicks: 420, leads: 94, conversionRate: 5.1 },
      { pageId: "temp-affiliate", views: 950, clicks: 310, leads: 58, conversionRate: 6.1 }
    ];
  });

  // Client live render simulator window (Mock interactive site state)
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [mockFormInputs, setMockFormInputs] = useState<Record<string, string>>({});
  const [mockFormSuccess, setMockFormSuccess] = useState<string | null>(null);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem("lander_pages", JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem("lander_leads", JSON.stringify(leads));
  }, [leads]);

  // Dynamic Lucide Renderer
  const renderIcon = (name: string, className?: string) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.HelpCircle className={className} />;
  };

  const getPageById = (id: string | null): LandingPage | undefined => {
    if (!id) return undefined;
    return pages.find(p => p.id === id);
  };

  const activePage = getPageById(currentPageId);

  // AI cloning operation
  const handleAIClone = async (e: FormEvent) => {
    e.preventDefault();
    if (!cloneUrl) return;

    setIsCloning(true);
    setCloneProgress(["Initiating Lander AI Scraper pipeline...", "Connecting safely to edge reverse proxy..."]);

    const timer1 = setTimeout(() => {
      setCloneProgress(prev => [...prev, "Analyzing website grid spacing, margins, and CTA vectors...", "Extracting optimized copywriting tone elements..."]);
    }, 1200);

    const timer2 = setTimeout(() => {
      setCloneProgress(prev => [...prev, "Compiling modern glassmorphic theme and gradient presets...", "Structuring mobile-responsive sections layout..."]);
    }, 2800);

    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cloneUrl,
          description: cloneDescription,
          tone: cloneTone,
          refineStyle: cloneStyle
        })
      });

      if (!response.ok) {
        throw new Error("Target cloner returned an unexpected status code.");
      }

      const data = await response.json();
      if (data.success && data.page) {
        setPages(prev => [data.page, ...prev]);
        
        // Setup initial metrics for this new page
        const newMetric: PageMetric = {
          pageId: data.page.id,
          views: 1,
          clicks: 0,
          leads: 0,
          conversionRate: 0
        };
        setMetrics(prev => [...prev, newMetric]);
        
        // Redirect directly to the editor workspace
        setCurrentPageId(data.page.id);
        setSelectedSectionId(data.page.sections[1]?.id || null); // target Hero initially
      } else {
        alert("Cloner completed but failed to structures the JSON layout correctly.");
      }
    } catch (err: any) {
      console.error(err);
      alert("AI Scraper error: " + err.message + ". We loaded a fully styled fallback clone structure for you to edit.");
      // In case of error, instantiate a beautiful mock page structure
      const fallbackId = "scraped-fallback-" + Math.random().toString(36).substr(2, 4);
      const fallbackPage: LandingPage = {
        id: fallbackId,
        title: "Clean Clone of " + (cloneUrl.replace("https://", "").split("/")[0]),
        description: "Optimized modernization of similar elements.",
        slug: "cloned-" + Math.random().toString(36).substr(2, 4),
        sourceUrl: cloneUrl,
        createdAt: new Date().toISOString(),
        fontFamily: "sans",
        colorPalette: COLOR_PALETTES[0],
        sections: TEMPLATES[0].sections.map(s => ({...s, id: s.id + "-" + Math.random().toString(36).substr(2, 3)}))
      };
      setPages(prev => [fallbackPage, ...prev]);
      setCurrentPageId(fallbackId);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsCloning(false);
      setCloneProgress([]);
      setCloneUrl("");
      setCloneDescription("");
    }
  };

  // Section modifiers
  const updateSectionContent = (sectionId: string, updatedContent: any) => {
    if (!currentPageId) return;
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return {
        ...p,
        sections: p.sections.map(s => {
          if (s.id !== sectionId) return s;
          return { ...s, content: updatedContent };
        })
      };
    }));
  };

  const deleteSection = (sectionId: string) => {
    if (!currentPageId) return;
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return {
        ...p,
        sections: p.sections.filter(s => s.id !== sectionId)
      };
    }));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const moveSection = (direction: "up" | "down", sectionId: string) => {
    if (!currentPageId) return;
    const page = pages.find(p => p.id === currentPageId);
    if (!page) return;
    
    const index = page.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.sections.length) return;
    
    const updatedSections = [...page.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[targetIndex];
    updatedSections[targetIndex] = temp;
    
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return { ...p, sections: updatedSections };
    }));
  };

  // Adds a generic template section easily
  const handleAddSection = (afterSectionId: string, type: SectionType) => {
    if (!currentPageId) return;
    
    let defaultContent: any = {};
    if (type === SectionType.FEATURES) {
      defaultContent = {
        title: "Discover Unlimited AI Power",
        subtitle: "A cleaner, modernized modular experience.",
        items: [
          { id: "feat-new-1", title: "Automated Conversion Audit", description: "Lander.ai rates your checkout page and suggests better copy triggers dynamically.", icon: "Sparkles" },
          { id: "feat-new-2", title: "Global CDN Hosting", description: "One touch, instantly global. Speed test verified.", icon: "Globe" }
        ]
      };
    } else if (type === SectionType.TESTIMONIALS) {
      defaultContent = {
        title: "What Leaders Say After AI Cloner Upgrades",
        subtitle: "Validated numbers from rapid-growing startup agencies.",
        items: [
          { id: "test-new-1", name: "David Miller", role: "Growth Lead, Scalerio", quote: "We replaced our sluggish Systeme.io framework in 30 seconds. Double conversion rates!", rating: 5, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80" }
        ]
      };
    } else if (type === SectionType.PRICING) {
      defaultContent = {
        title: "Scale Beyond Static Limits Today",
        subtitle: "Predictable, crystal-clear commission models.",
        plans: [
          { id: "plan-new-1", name: "Single Launch Plan", price: "$19", period: "/mo", description: "Optimize a single affiliate link with standard parameters.", features: ["Global CDN Serverless", "2 AI copywriting audits/mo"], buttonText: "Secure Instant Lifetime Access", isPopular: true }
        ]
      };
    } else if (type === SectionType.FAQ) {
      defaultContent = {
        title: "Quick FAQ Desk",
        subtitle: "Answers directly supported by conversion coaches.",
        items: [
          { id: "faq-new-1", question: "Can I connect my Google Analytics dashboard?", answer: "Yes, standard pixel injections take literally 1 second inside Settings block." }
        ]
      };
    } else if (type === SectionType.HEADER) {
      defaultContent = {
        logoName: "ApexFlowai",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" }
        ],
        ctaText: "Start Cloner"
      };
    } else if (type === SectionType.AFF_REVIEW_STARS) {
      defaultContent = {
        title: "⭐️ Honest Review of ApexFlowai: Worth the Hype?",
        rating: 4.8,
        summary: "We rigorously benchmarked Lander.ai's dynamic page algorithms for 30 days. Here is our direct affiliate conversion review and metrics breakdown.",
        pros: ["99.8% Faster Serverless Loadtime", "Zero-setup page layout replication", "Active automatic layout variation checks"],
        cons: ["Only 5 template sets inside sandbox preview", "Requires steady internet connection"],
        buttonText: "Secure Our Limited Affiliate Discount Here (Save 60%)",
        affiliateUrl: "https://your-affiliate-link.com"
      };
    } else if (type === SectionType.AFF_PRO_CON_CARD) {
      defaultContent = {
        title: "Side-by-Side Breakdown: How Lander.ai Beats Standard Builders",
        subtitle: "A detailed comparison table compiled by conversion engineers.",
        compTitle1: "Lander.ai / ApexFlowai",
        compTitle2: "Traditional Page Builders",
        comp1Items: ["Instant URL Cloning Integration", "Built-in Elementor Pro Affiliate Widgets", "Server-proxied protected keys integration", "Supercharged global edge optimization CDN"],
        comp2Items: ["Locked behind expensive premium subscription tiers", "Prone to database server runtime overhead crashes", "Complex separate setup required, styling conflicts", "No live real-time simulation sandbox metrics"],
        buttonText: "Secure Immediate Lifetime Access Now",
        affiliateUrl: "https://your-affiliate-link.com"
      };
    } else if (type === SectionType.AFF_VIDEO_REVIEW) {
      defaultContent = {
        title: "🍿 Deep-Dive Video Demonstration",
        subtitle: "Watch us build, clone, optimize and deploy a complete affiliate campaign in under 2 minutes.",
        videoPlaceholderText: "Simulated High-Quality Video Review Demonstration Frame (Play Video)",
        badgeText: "🔥 22K+ Views",
        ctaTitle: "Claim Free Launch Day Bonuses ($599 Worth) When Buying via Our Link Below!",
        buttonText: "Claim Product & All Bonuses Now",
        affiliateUrl: "https://your-affiliate-link.com"
      };
    } else if (type === SectionType.AFF_BONUS_GRID) {
      defaultContent = {
        title: "🎁 Over $1,200 in Pure Value Bonuses",
        subtitle: "Get all these custom pre-configured premium materials instantly free when you purchase through our link.",
        items: [
          { id: "b1", title: "Bonus #1: High Ticket Swipe Vault ($197 Value)", description: "The exact copywriting swipe files used by elite affiliate networks to draft seven-figure promotions.", valueText: "FREE", icon: "FolderLock" },
          { id: "b2", title: "Bonus #2: Funnel Speed Optimization Suite ($297 Value)", description: "Pro scripts to compress imagery and optimize edge servers to bypass browser delays.", valueText: "FREE", icon: "Sliders" },
          { id: "b3", title: "Bonus #3: Private Mastermind Group Access ($499 Value)", description: "Network directly with seasoned agency founders and direct media buyers.", valueText: "FREE", icon: "MessageSquare" }
        ],
        buttonText: "Join ApexFlow & Receive Bonus Rewards Packages",
        affiliateUrl: "https://your-affiliate-link.com"
      };
    } else {
      defaultContent = {
        title: "Special Limited Offer Trigger",
        subtitle: "Secure high ticket bonus items before timer strikes absolute zero.",
        buttonText: "Secure VIP Entry Now",
        urgencyText: "Only 4 premium tickets remaining for this cycle!"
      };
    }

    const newSection: LandingPageSection = {
      id: `sec-${type.toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      isVisible: true,
      content: defaultContent
    };

    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      const index = p.sections.findIndex(s => s.id === afterSectionId);
      const updatedSections = [...p.sections];
      if (index === -1) {
        updatedSections.push(newSection);
      } else {
        updatedSections.splice(index + 1, 0, newSection);
      }
      return { ...p, sections: updatedSections };
    }));
  };

  // State / Font / Palette updates
  const changePalette = (palette: ColorPalette) => {
    if (!currentPageId) return;
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return { ...p, colorPalette: palette };
    }));
  };

  const changeFont = (font: "sans" | "serif" | "mono") => {
    if (!currentPageId) return;
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return { ...p, fontFamily: font };
    }));
  };

  const togglePagePublished = (pageId: string) => {
    setPages(prev => prev.map(p => {
      if (p.id !== pageId) return p;
      const nextStatus = !p.published;
      return { ...p, published: nextStatus };
    }));
  };

  // AI copywriting rewrites (Calling backend Endpoint)
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const handleAIRewrite = async (sectionId: string, tone: string) => {
    const page = pages.find(p => p.id === currentPageId);
    const section = page?.sections.find(s => s.id === sectionId);
    if (!section) return;

    setIsAiRewriting(true);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: section.type,
          originalContent: section.content,
          tone
        })
      });

      if (!response.ok) {
        throw new Error("Persuasion server returned abnormal status.");
      }

      const data = await response.json();
      if (data.success && data.content) {
        updateSectionContent(sectionId, data.content);
      } else {
        alert("Could not process rewrite properly.");
      }
    } catch (err: any) {
      console.error(err);
      alert("AI Rewrite error: " + err.message);
    } finally {
      setIsAiRewriting(false);
    }
  };

  // AI Headline wizard
  const triggerHeadlineGenerator = async (e: FormEvent) => {
    e.preventDefault();
    if (!headlineTopic) return;
    setIsGeneratingHeadlines(true);

    try {
      const response = await fetch("/api/headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: headlineTopic,
          audience: headlineAudience,
          style: headlineStyle
        })
      });

      const data = await response.json();
      if (data.success && data.options) {
        setAiHeadlines(data.options);
      }
    } catch (error) {
      console.error(error);
      setAiHeadlines([
        { headline: `The Ultimate ${headlineTopic} Framework`, subheadline: `Perfect for high converting ${headlineAudience || "visitors"} with immediate results.` },
        { headline: `Stop wasting time on standard static ${headlineTopic} campaigns`, subheadline: "Leverage automated conversion workflows in under 2 minutes." }
      ]);
    } finally {
      setIsGeneratingHeadlines(false);
    }
  };

  // Submit test leads
  const handleTestLeadSubmit = (e: FormEvent, pageId: string) => {
    e.preventDefault();
    const email = mockFormInputs["lead-email"] || mockFormInputs["email"] || "";
    const name = mockFormInputs["lead-name"] || mockFormInputs["name"] || "Visitor Test Lead";
    
    if (!email) return;

    // Log the new lead in state
    const newLead: Lead = {
      id: "lead-" + Math.random().toString(36).substr(2, 5),
      pageId: pageId,
      pageTitle: activePage?.title || "Draft Campaign",
      email: email,
      name: name,
      details: {
        note: "Submitted live via interactive sandbox visitor preview frame."
      },
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);

    // Update real metrics for views & convers
    setMetrics(prev => prev.map(m => {
      if (m.pageId !== pageId) return m;
      const nextLeads = m.leads + 1;
      const nextViews = m.views + 1;
      const nextRate = parseFloat(((nextLeads / nextViews) * 100).toFixed(1));
      return {
        ...m,
        leads: nextLeads,
        views: nextViews,
        conversionRate: nextRate
      };
    }));

    setMockFormSuccess("Submission successful! Your lead is logged in Lander.ai dashboard statistics in real-time.");
    setMockFormInputs({});
    setTimeout(() => setMockFormSuccess(null), 5000);
  };

  // Helper properties to track global stats
  const totalViews = metrics.reduce((acc, m) => acc + m.views, 0);
  const totalLeads = leads.length;
  const avgConversionRate = (totalViews > 0 ? parseFloat(((totalLeads / totalViews) * 100).toFixed(1)) : 0);

  return (
    <div className="flex bg-[#050510] text-slate-100 min-h-screen font-sans selection:bg-purple-600 selection:text-white" id="app-root">
      
      {/* 1. SIDEBAR NAVIGATION RAIL DIRECT IN IMMERSIVE CLASS STYLE */}
      <nav className="w-[80px] bg-[#09091a]/95 border-r border-white/[0.05] flex flex-col items-center py-6 shrink-0" id="sidebar-rail">
        
        {/* LOGO GESTURE */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-900/40 mb-10 select-none animate-pulse" id="glow-logo">
          L
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full px-2" id="nav-group">
          <button
            onClick={() => { setCurrentPageId(null); setDashboardTab("pages"); }}
            className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${
              currentPageId === null && dashboardTab === "pages"
                ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
            }`}
            title="My Landing Pages"
            id="nav-pages-btn"
          >
            <Icons.Layers className="w-5 h-5" />
          </button>

          <button
            onClick={() => { setCurrentPageId(null); setDashboardTab("analytics"); }}
            className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${
              currentPageId === null && dashboardTab === "analytics"
                ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
            }`}
            title="Real-time Analytics"
            id="nav-analytics-btn"
          >
            <Icons.TrendingUp className="w-5 h-5" />
          </button>

          <button
            onClick={() => { setCurrentPageId(null); setDashboardTab("leads"); }}
            className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${
              currentPageId === null && dashboardTab === "leads"
                ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
            }`}
            title="Conversion Leads"
            id="nav-leads-btn"
          >
            <Icons.Users className="w-5 h-5" />
          </button>
        </div>

        {/* BOTTOM UTILITY STATS */}
        <div className="flex flex-col gap-5 items-center justify-center" id="nav-support">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="AI Cloner Model: Ready" />
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 overflow-hidden font-bold select-none cursor-pointer">
            RS
          </div>
        </div>
      </nav>

      {/* 2. MAIN HUB WORKSPACE SCREEN */}
      <div className="flex-1 flex flex-col min-w-0" id="main-view">
        
        {/* VIEW 1: CENTRAL DASHBOARD SYSTEM */}
        {currentPageId === null ? (
          <div className="flex-1 overflow-y-auto" id="dashboard-system">
            
            {/* STYLED HERO HEADER ROW */}
            <header className="h-[72px] border-b border-white/[0.05] px-8 flex items-center justify-between bg-[#070715]/70 backdrop-blur-md sticky top-0 z-10" id="dashboard-header">
              <div className="flex items-center gap-3" id="db-brand">
                <span className="text-purple-500 font-extrabold text-2xl">•</span>
                <h1 className="text-lg font-bold tracking-tight text-white select-none">Lander.ai Hub</h1>
                <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-medium">
                  Billion-Dollar AI Startup Suite
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400" id="db-timer">
                <span>⚡ System Status: <b className="text-emerald-400 font-medium">99.98%</b></span>
                <span className="text-slate-600">|</span>
                <span>🕒 Server Time: <b>2026-05-28 08:30 UTC</b></span>
              </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8" id="db-main">
              
              {/* STATS TILES BANNER OVERVIEW */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6" id="stats-ribbon">
                <div className="bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 rounded-2xl p-6 transition-all" id="stat-traffic">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm">Global Traffic Views</span>
                    <Icons.Eye className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</h3>
                  <p className="text-xs text-slate-500 mt-2">📊 Standard sandbox simulation traffic</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 rounded-2xl p-6 transition-all" id="stat-leads-count">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm">Total Conversion Leads</span>
                    <Icons.Users className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{totalLeads}</h3>
                  <p className="text-xs text-slate-500 mt-2">📥 Syncing directly from opt-in forms</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 rounded-2xl p-6 transition-all" id="stat-conversion">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-sm">Mean Conversion Rate</span>
                    <Icons.TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{avgConversionRate}%</h3>
                  <p className="text-xs text-slate-500 mt-2">📈 Higher than ClickFunnels (avg 2.1%)</p>
                </div>

                <div className="bg-gradient-to-tr from-purple-950/60 to-indigo-950/60 border border-purple-500/20 rounded-2xl p-6 shadow-xl" id="stat-automation">
                  <div className="flex items-center justify-between text-purple-300 mb-2">
                    <span className="text-sm font-semibold">AI Clones Running</span>
                    <Icons.Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{pages.length}</h3>
                  <p className="text-xs text-purple-300/70 mt-2">🚀 Instant AI-structure cloner setup active</p>
                </div>
              </section>

              {/* RENDER PAGES LIST TAB PANEL */}
              {dashboardTab === "pages" && (
                <div className="space-y-8" id="tabs-pages-view">
                  
                  {/* CENTRAL MAGICAL GLOWING URL PASTE BOX */}
                  <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-950 border border-purple-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden" id="magical-cloner-widget">
                    
                    <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />

                    <div className="relative" id="cloner-inner">
                      <div className="flex items-center gap-2 text-purple-400 font-bold tracking-wider text-xs uppercase mb-3" id="brand-ticker">
                        <Icons.Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                        Automated AI Website Cloner Engine
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white max-w-2xl">
                        Clone & Optimize Any Website URL Instantly
                      </h2>
                      <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Paste any Systeme.io, ClickFunnels, coaching lander or digital product link. Our AI analyzes structure, copywriting, and layout to draft a modernized, responsive inspired draft instantly.
                      </p>

                      <form onSubmit={handleAIClone} className="mt-8 space-y-6 max-w-4xl" id="cloner-form">
                        <div className="flex flex-col md:flex-row gap-3" id="url-box">
                          <div className="relative flex-1">
                            <Icons.Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                              type="url"
                              value={cloneUrl}
                              onChange={(e) => setCloneUrl(e.target.value)}
                              placeholder="e.g., https://coachingv2.systeme.io/coaching-masterclass"
                              className="w-full bg-[#03030a]/80 text-white rounded-2xl pl-12 pr-6 py-3.5 border border-white/[0.1] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
                              required
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isCloning}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-3.5 rounded-2xl text-white font-bold transition-all shadow-lg hover:shadow-purple-700/30 flex items-center justify-center gap-2 cursor-pointer text-sm font-medium shrink-0 disabled:opacity-50"
                            id="run-cloner-btn"
                          >
                            {isCloning ? (
                              <>
                                <Icons.Loader2 className="w-5 h-5 animate-spin" />
                                Processing layout...
                              </>
                            ) : (
                              <>
                                <Icons.Zap className="w-5 h-5" />
                                Clone & Rewrite
                              </>
                            )}
                          </button>
                        </div>

                        {/* ADVANCED PERSUASION DIALS (COLLAPSIBLE / OPTIONAL TO MAKE IT Billion-Dollar Startup premium feel) */}
                        <div className="bg-[#04040a]/40 border border-white/[0.03] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs" id="dials-form">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-2">TARGET PERSUASION TONE</label>
                            <select
                              value={cloneTone}
                              onChange={(e) => setCloneTone(e.target.value)}
                              className="w-full bg-slate-900 border border-white/[0.08] text-slate-200 rounded-lg p-2 focus:border-purple-500"
                            >
                              <option value="SaaS Startup Hook">SaaS Startup Hook (Clean & technical)</option>
                              <option value="Direct Response Fire">Direct Response Fire (Affiliates, urgent hooks)</option>
                              <option value="Warm Lifestyle Coach">Warm Lifestyle Coach (Consultants, friendly values)</option>
                              <option value="Extreme Scarcity & Countdown">Extreme Scarcity & Urgency (Flash sales)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-2">DESIGN STYLE FOCUS</label>
                            <select
                              value={cloneStyle}
                              onChange={(e) => setCloneStyle(e.target.value)}
                              className="w-full bg-slate-900 border border-white/[0.08] text-slate-200 rounded-lg p-2 focus:border-purple-500"
                            >
                              <option value="Modern Immersive Dark">Modern Immersive Dark (Aesthetic purple)</option>
                              <option value="Light Clean Minimalist">Light Clean Minimalist (Slate sky theme)</option>
                              <option value="Zinc Affiliate Gold">Zinc Affiliate Gold (Zinc & gold contrast)</option>
                              <option value="Emerald Editorial Warm">Emerald Editorial Warm (Warm paper feel)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-2">OPTIONAL BUSINESS NOTES</label>
                            <input
                              type="text"
                              value={cloneDescription}
                              onChange={(e) => setCloneDescription(e.target.value)}
                              placeholder="e.g., Affiliate fitness blueprint book offer"
                              className="w-full bg-slate-900 border border-white/[0.08] text-slate-200 rounded-lg p-2 focus:border-purple-500"
                            />
                          </div>
                        </div>

                        {/* QUICK PRESETS INJECTION FOR EXPERIMENT */}
                        <div className="flex flex-wrap items-center gap-2" id="url-presets">
                          <span className="text-xs text-slate-500">Quick Testing Links:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCloneUrl("https://systeme.io/coaching-lander-v2");
                              setCloneDescription("A luxurious digital coaching workspace for wellness programs.");
                              setCloneTone("Warm Lifestyle Coach");
                            }}
                            className="text-xs bg-slate-900 hover:bg-slate-800 border border-white/[0.05] hover:border-slate-700 px-3 py-1 rounded-full text-slate-300 transition-all cursor-pointer"
                          >
                            Wellness Coach Page
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCloneUrl("https://clickfunnels.com/software-lifetime-special");
                              setCloneDescription("High tech software builder offering limited annual discount bonus packages.");
                              setCloneTone("Extreme Scarcity & Countdown");
                            }}
                            className="text-xs bg-slate-900 hover:bg-slate-800 border border-white/[0.05] hover:border-slate-700 px-3 py-1 rounded-full text-slate-300 transition-all cursor-pointer"
                          >
                            Software Deal Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCloneUrl("https://shopify.com/custom-retro-sneakers");
                              setCloneDescription("E-commerce sneaker boutique drops.");
                              setCloneTone("SaaS Startup Hook");
                            }}
                            className="text-xs bg-slate-900 hover:bg-slate-800 border border-white/[0.05] hover:border-slate-700 px-3 py-1 rounded-full text-slate-300 transition-all cursor-pointer"
                          >
                            Ecom Product Page
                          </button>
                        </div>
                      </form>

                      {/* AI SCANNER LOGS */}
                      {isCloning && (
                        <div className="mt-6 bg-[#03030b] border border-purple-500/20 rounded-2xl p-4 space-y-2" id="cloner-logs">
                          <div className="flex items-center gap-2 text-yellow-500 text-xs font-semibold" id="logs-title">
                            <Icons.Loader2 className="w-3.5 h-3.5 animate-spin" />
                            GEMINI MODEL ACTIVE [gemini-3.5-flash]
                          </div>
                          <div className="space-y-1 font-mono text-[11px] text-slate-400" id="logs-body">
                            {cloneProgress.map((line, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-purple-500">✓</span> {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* RECENT DRAFTS SECTION */}
                  <div className="space-y-4" id="recent-projects-block">
                    <div className="flex items-center justify-between" id="recent-header">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Icons.Layers className="w-5 h-5 text-purple-400" />
                        My Active Landing Pages
                      </h2>
                      <span className="text-xs text-slate-500">Auto-saved to Sandbox Storage</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
                      {pages.map((page) => {
                        const pm = metrics.find(m => m.pageId === page.id) || { views: 0, leads: 0, conversionRate: 0 };
                        return (
                          <div key={page.id} className="bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] rounded-2xl overflow-hidden transition-all group flex flex-col h-full" id={`page-card-${page.id}`}>
                            
                            {/* Header image / preview mock fallback */}
                            <div className="h-40 bg-gradient-to-tr from-[#09091e] to-[#150a28] relative flex items-center justify-center p-4 border-b border-white/[0.03]" id="card-hero-mock">
                              <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80')` }} />
                              
                              <div className="space-y-1.5 text-center relative z-10" id="card-title-group">
                                <span className={`text-[10px] uppercase tracking-widest font-mono border px-2 py-0.5 rounded-full ${
                                  page.fontFamily === 'mono' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-950/20' : 'border-purple-500/30 text-purple-300 bg-purple-950/20'
                                }`}>
                                  {page.fontFamily} design theme
                                </span>
                                <h3 className="text-sm font-semibold text-white drop-shadow-md line-clamp-1">{page.title}</h3>
                                <p className="text-[11px] text-slate-400 line-clamp-1">/{page.slug}</p>
                              </div>

                              <div className="absolute right-3 top-3 flex gap-1.5" id="card-status-pill">
                                {page.published ? (
                                  <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE
                                  </span>
                                ) : (
                                  <span className="bg-slate-900/60 text-slate-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    DRAFT
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Info body */}
                            <div className="p-5 flex-1 flex flex-col justify-between" id="card-body">
                              <p className="text-xs text-slate-400 line-clamp-2 italic mb-4">"{page.description}"</p>
                              
                              <div className="grid grid-cols-3 gap-2 border-t border-white/[0.03] pt-4 mb-4 text-center" id="card-mini-stats">
                                <div id="mini-views">
                                  <span className="text-[10px] text-slate-500 uppercase block">Views</span>
                                  <span className="font-semibold text-xs text-slate-300">{pm.views}</span>
                                </div>
                                <div id="mini-leads">
                                  <span className="text-[10px] text-slate-500 uppercase block">Leads</span>
                                  <span className="font-semibold text-xs text-purple-300">{pm.leads}</span>
                                </div>
                                <div id="mini-rate">
                                  <span className="text-[10px] text-slate-500 uppercase block">Conv. %</span>
                                  <span className="font-semibold text-xs text-emerald-400">{pm.conversionRate}%</span>
                                </div>
                              </div>

                              <div className="flex gap-2" id="card-actions">
                                <button
                                  onClick={() => {
                                    setCurrentPageId(page.id);
                                    // Default active editing block to first visible block
                                    setSelectedSectionId(page.sections[1]?.id || page.sections[0]?.id || null);
                                  }}
                                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] hover:border-white/[0.15] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 px-3 cursor-pointer"
                                  id="edit-page-trigger"
                                >
                                  <Icons.Edit3 className="w-3.5 h-3.5" />
                                  Edit Design
                                </button>
                                
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this campaign?")) {
                                      setPages(prev => prev.filter(p => p.id !== page.id));
                                    }
                                  }}
                                  className="w-9 h-9 bg-slate-950/40 hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 border border-white/[0.03] hover:border-rose-900/30 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                                  title="Delete Draft"
                                  id="delete-page-trigger"
                                >
                                  <Icons.Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* RENDER ANALYTICS SYSTEM */}
              {dashboardTab === "analytics" && (
                <div className="space-y-6" id="tabs-analytics-view">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8" id="analytics-chart-card">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Icons.TrendingUp className="w-5 h-5 text-purple-400" />
                      Dynamic Conversion Funnel Simulator
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">Real-time stats from sandbox page traffic runs.</p>

                    {/* SVG BAR GRAPH */}
                    <div className="h-64 flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4 mb-4 select-none" id="analytics-svg-bars">
                      {pages.map((p, i) => {
                        const m = metrics.find(metric => metric.pageId === p.id) || { views: 1, leads: 0, conversionRate: 0 };
                        // Max ratio calculation
                        const maxVal = Math.max(...metrics.map(me => me.views), 100);
                        const heightPercent = Math.min(((m.views / maxVal) * 100), 100);
                        return (
                          <div key={p.id} className="flex-1 flex flex-col items-center group relative" id={`analytics-bar-${p.id}`}>
                            
                            {/* Hover info tooltip */}
                            <div className="absolute bottom-full mb-2 bg-[#09091c] border border-purple-500/20 p-3 rounded-lg text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl" id="bar-tooltip">
                              <p className="font-bold text-white mb-1">{p.title}</p>
                              <p>Views: {m.views}</p>
                              <p>Leads Collected: {m.leads}</p>
                              <p className="text-emerald-400">Conversion Rate: {m.conversionRate}%</p>
                            </div>

                            <div className="w-full bg-slate-900/40 border border-white/[0.03] rounded-t-xl overflow-hidden relative" style={{ height: `${heightPercent + 20}px` }}>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-800 to-indigo-600 transition-all group-hover:brightness-125" style={{ height: `${heightPercent}%` }} />
                            </div>
                            
                            <span className="text-[10px] text-slate-400 line-clamp-1 text-center mt-3 font-mono">{p.title}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 px-2" id="chart-axes">
                      <span>📉 Minimum Activity Floor</span>
                      <span>📈 High Conversion Peak</span>
                    </div>
                  </div>

                  {/* CAMPAIGN LEADS TABLE SUMMARY */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6" id="dashboard-campaign-table">
                    <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-4">Conversion Efficiency Matrix</h3>
                    <div className="overflow-x-auto" id="table-wrap">
                      <table className="w-full text-left text-xs text-slate-300" id="matrix-table">
                        <thead>
                          <tr className="border-b border-white/[0.05] text-slate-400 font-bold">
                            <th className="pb-3 pr-4">Page Title</th>
                            <th className="pb-3">Source Trigger URL</th>
                            <th className="pb-3 text-center">Views count</th>
                            <th className="pb-3 text-center">Leads logged</th>
                            <th className="pb-3 text-center">Effective Rate</th>
                            <th className="pb-3 text-right">Draft Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                          {pages.map(p => {
                            const m = metrics.find(me => me.pageId === p.id) || { views: 0, leads: 0, conversionRate: 0 };
                            return (
                              <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                                <td className="py-4 pr-4 font-semibold text-white">{p.title}</td>
                                <td className="py-4 truncate max-w-[200px]" title={p.sourceUrl || "Templates Builder"}>
                                  {p.sourceUrl ? (
                                    <span className="text-slate-500 font-mono text-[10px]">{p.sourceUrl}</span>
                                  ) : (
                                    <span className="text-purple-400 font-mono text-[10px]">Lander Standard Preset</span>
                                  )}
                                </td>
                                <td className="py-4 text-center font-mono">{m.views}</td>
                                <td className="py-4 text-center font-mono text-purple-300 font-semibold">{m.leads}</td>
                                <td className="py-4 text-center">
                                  <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-mono font-medium">
                                    {m.conversionRate}%
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  {p.published ? (
                                    <span className="text-emerald-400">● Live Campaign</span>
                                  ) : (
                                    <span className="text-slate-500">Draft Work</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER LEADS TAB PANEL */}
              {dashboardTab === "leads" && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 space-y-6" id="tabs-leads-view">
                  <div className="flex items-center justify-between" id="leads-title-banner">
                    <div>
                      <h2 className="text-xl font-bold text-white">Dynamic Form Leads</h2>
                      <p className="text-xs text-slate-400 mt-1">Exportable direct-response user leads submitted on your generated pages.</p>
                    </div>
                    <button
                      onClick={() => alert("Simulating CSV Export: Initiated download path for " + leads.length + " leads.")}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      id="export-leads-btn"
                    >
                      <Icons.Download className="w-4 h-4" /> Export CSV Format
                    </button>
                  </div>

                  <div className="space-y-3" id="leads-list">
                    {leads.length === 0 ? (
                      <div className="py-12 text-center text-slate-500" id="leads-empty-state">
                        <Icons.Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm">No visitor leads collected yet.</p>
                        <p className="text-xs text-slate-600 mt-1">Publish a landing page and submit the contact form to verify.</p>
                      </div>
                    ) : (
                      leads.map(l => (
                        <div key={l.id} className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-500/20 transition-all" id={`lead-item-${l.id}`}>
                          <div className="space-y-1" id="lead-info">
                            <div className="flex items-center gap-2" id="lead-main">
                              <span className="text-sm font-semibold text-white">{l.name || "Anonymous Opt-in"}</span>
                              <span className="text-purple-400 text-xs font-mono">{l.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500" id="lead-meta">
                              <span>Page: <b>{l.pageTitle}</b></span>
                              <span>•</span>
                              <span>Logged: <b>{new Date(l.createdAt).toLocaleString()}</b></span>
                            </div>
                            {l.details && Object.keys(l.details).length > 0 && (
                              <p className="text-xs text-slate-400 bg-white/[0.02] border border-white/[0.03] p-2 rounded-lg mt-2 font-mono">
                                {JSON.stringify(l.details)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              if (confirm("Remove this lead from sandbox registers?")) {
                                setLeads(prev => prev.filter(item => item.id !== l.id));
                              }
                            }}
                            className="text-slate-600 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-950/20 transition-all cursor-pointer"
                            title="Delete Lead Registry"
                            id="delete-lead-btn"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </main>
          </div>
        ) : (
          
          /* VIEW 2: HIGH-FIDELITY DRAG & DROP EDITOR */
          <div className="flex-1 flex flex-col overflow-hidden" id="editor-workspace">
            
            {/* EDITOR WORKSPACE HEADER */}
            <header className="h-[72px] bg-[#070715] border-b border-white/[0.05] px-6 flex items-center justify-between shrink-0 z-20 shadow-lg" id="workspace-header">
              
              {/* Back & Title */}
              <div className="flex items-center gap-3" id="header-left">
                <button
                  onClick={() => { setCurrentPageId(null); setSelectedSectionId(null); }}
                  className="w-10 h-10 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl flex items-center justify-center text-slate-300 transition-all cursor-pointer"
                  title="Return to Dashboard Dashboard"
                  id="header-back-btn"
                >
                  <Icons.ArrowLeft className="w-4 h-4" />
                </button>
                
                <div id="header-title-box">
                  <div className="flex items-center gap-2" id="campaign-title-row">
                    <h2 className="text-sm font-bold text-white max-w-[180px] truncate">{activePage?.title}</h2>
                    {activePage?.published ? (
                      <span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800/80 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
                        Live
                      </span>
                    ) : (
                      <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
                        Draft
                      </span>
                    )}
                  </div>
                  {activePage?.sourceUrl && (
                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]" title={activePage.sourceUrl}>
                      🔗 Inspired: {activePage.sourceUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* View mode toggle controls */}
              <div className="bg-[#03030a]/80 p-1 border border-white/[0.08] rounded-xl flex items-center gap-1" id="header-middle-viewport">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "desktop" ? "bg-purple-600 text-white shadow-md shadow-purple-900/40" : "text-slate-400 hover:text-slate-200"
                  }`}
                  id="viewport-desktop-btn"
                >
                  <Icons.Monitor className="w-3.5 h-3.5" /> Desktop View
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "mobile" ? "bg-purple-600 text-white shadow-md shadow-purple-900/40" : "text-slate-400 hover:text-slate-200"
                  }`}
                  id="viewport-mobile-btn"
                >
                  <Icons.Smartphone className="w-3.5 h-3.5" /> mobile Responsive
                </button>
              </div>

              {/* Publish & Quick Test switches */}
              <div className="flex items-center gap-3" id="header-right-actions">
                <button
                  onClick={() => {
                    setIsPreviewActive(!isPreviewActive);
                    setMockFormSuccess(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isPreviewActive
                      ? "bg-amber-600/20 text-amber-300 border-amber-500/30"
                      : "bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]"
                  }`}
                  id="toggle-preview-mode"
                >
                  {isPreviewActive ? (
                    <>
                      <Icons.EyeOff className="w-4 h-4" /> Exit Preview Mode
                    </>
                  ) : (
                    <>
                      <Icons.Eye className="w-4 h-4" /> Interactive Test Drive
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (currentPageId) {
                      togglePagePublished(currentPageId);
                      alert(
                        !activePage?.published
                          ? "Congratulations! Your inspired landing page campaign is published publicly. Share the link below to generate mock leads."
                          : "Campaign taken down. Restored successfully to local Draft mode."
                      );
                    }
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                    activePage?.published
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-700/30"
                  }`}
                  id="editor-publish-btn"
                >
                  {activePage?.published ? (
                    <>
                      <Icons.XCircle className="w-4 h-4" /> Disable Link
                    </>
                  ) : (
                    <>
                      <Icons.Rocket className="w-4 h-4" /> Go Live Campaign
                    </>
                  )}
                </button>
              </div>

            </header>

            {/* SPLIT PREVIEW DESK & INSPECTOR TOOL */}
            <div className="flex-1 flex overflow-hidden bg-[#04040a]" id="workspace-body">
              
              {/* ELEMENTOR PRO WIDGET PALETTE SIDEBAR */}
              {!isPreviewActive && activePage && (
                <div className="w-[260px] bg-[#070712]/95 border-r border-white/[0.05] flex flex-col h-full overflow-hidden shrink-0" id="elementor-pro-sidebar">
                  {/* Sidebar Brand Header Banner with pink/red block signature to mimic Elementor Pro */}
                  <div className="p-4 bg-slate-900 border-b border-white/[0.05] flex items-center justify-between shrink-0" id="elementor-brand-header">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black text-xs flex items-center justify-center font-mono shadow-md tracking-wider">
                        E!
                      </span>
                      <div className="text-left">
                        <h4 className="text-xs font-extrabold tracking-wider text-white uppercase font-sans flex items-center gap-1 leading-none">
                          Elementor Pro <span className="text-[7px] text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1 py-0.5 rounded uppercase font-bold leading-none shrink-0">Affiliate</span>
                        </h4>
                        <p className="text-[8px] text-slate-500 leading-none mt-1">Instant affiliate landing tools</p>
                      </div>
                    </div>
                  </div>

                  {/* Search Box */}
                  <div className="p-3 border-b border-white/[0.03] shrink-0" id="elementor-search-box">
                    <div className="relative">
                      <Icons.Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={widgetSearch}
                        onChange={(e) => setWidgetSearch(e.target.value)}
                        placeholder="Search widgets (e.g., star, review)..."
                        className="w-full bg-[#030308] border border-white/[0.06] rounded-lg pl-8 p-1.5 text-[10px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/30 text-left"
                      />
                      {widgetSearch && (
                        <button onClick={() => setWidgetSearch("")} className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 text-[10px]">✕</button>
                      )}
                    </div>
                  </div>

                  {/* Widgets List Scroll area */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin text-left" id="elementor-categories-stack">
                    
                    {/* Category 1: Affiliate Special Hot components */}
                    <div className="space-y-2">
                      <span className="block text-[8px] font-bold text-rose-400 uppercase tracking-widest font-mono">✦ Pro Affiliate Widgets</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Card 1: Review Stars */}
                        {("affiliate stars rating review score".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.AFF_REVIEW_STARS);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/30 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-400 border border-yellow-500/20 w-fit shrink-0">
                              <Icons.Star className="w-4 h-4 fill-current group-hover:animate-pulse" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Review Score</span>
                              <span className="block text-[8px] text-slate-500 truncate">Rating pros/cons</span>
                            </div>
                          </button>
                        )}

                        {/* Card 2: Competitor compare */}
                        {("comparison versus side stack compare comptitles comp1items".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.AFF_PRO_CON_CARD);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/30 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20 w-fit shrink-0">
                              <Icons.Scale className="w-4 h-4 group-hover:rotate-12 transition-all" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Side-by-Side</span>
                              <span className="block text-[8px] text-slate-500 truncate">Compare benefits</span>
                            </div>
                          </button>
                        )}

                        {/* Card 3: Video Demo embed */}
                        {("video demonstration demo youtube review play".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.AFF_VIDEO_REVIEW);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/30 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20 w-fit shrink-0">
                              <Icons.Video className="w-4 h-4 group-hover:scale-11 transition-all" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Video Review</span>
                              <span className="block text-[8px] text-slate-500 truncate">Deep video specs</span>
                            </div>
                          </button>
                        )}

                        {/* Card 4: Affiliate referral reward bento */}
                        {("bonus rewards reference gift package bundle".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.AFF_BONUS_GRID);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/30 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 w-fit shrink-0">
                              <Icons.Gift className="w-4 h-4 group-hover:animate-bounce" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Value Bonuses</span>
                              <span className="block text-[8px] text-slate-500 truncate text-left">Buyer rewards grid</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category 2: Classic Conversion Elements */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">✦ Conversion Elements</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Urgency countdown */}
                        {("countdown timer urgency scarcity seats remaining".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.CTA_URGENCY);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/10 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 w-fit shrink-0">
                              <Icons.Hourglass className="w-4 h-4 group-hover:rotate-180 transition-all duration-1000" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Urgency Clock</span>
                              <span className="block text-[8px] text-slate-500 truncate">Time limiter</span>
                            </div>
                          </button>
                        )}

                        {/* Pricing table */}
                        {("pricing plans money costs tiers solo launch".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.PRICING);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/10 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20 w-fit shrink-0">
                              <Icons.CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Pricing Plans</span>
                              <span className="block text-[8px] text-slate-500 truncate">Affiliate levels</span>
                            </div>
                          </button>
                        )}

                        {/* Opt-in lead form */}
                        {("contact email newsletter form opt-in lead capture".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.CONTACT_FORM);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/10 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 w-fit shrink-0">
                              <Icons.Mail className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Opt-in Leads</span>
                              <span className="block text-[8px] text-slate-500 truncate">Contact form</span>
                            </div>
                          </button>
                        )}

                        {/* Feature checklist */}
                        {("feature deck checklist benefit items bullets icon".includes(widgetSearch.toLowerCase())) && (
                          <button
                            onClick={() => {
                              const lastId = activePage.sections[activePage.sections.length - 1]?.id || "";
                              handleAddSection(lastId, SectionType.FEATURES);
                            }}
                            className="group bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-rose-500/10 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02] cursor-pointer h-[100px]"
                          >
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 w-fit shrink-0">
                              <Icons.Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white leading-tight">Feature Deck</span>
                              <span className="block text-[8px] text-slate-500 truncate">Grid of metrics</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Easy Use Instructions micro banner */}
                  <div className="p-3 bg-slate-900/40 border-t border-white/[0.03] text-center text-[9px] text-slate-500 font-medium select-none shrink-0" id="elementor-micro-byline">
                    💡 <b className="text-rose-400">Click</b> standard cards to drop onto page
                  </div>
                </div>
              )}

              {/* CANVAS SCROLL WRAPPER */}
              <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start" id="canvas-column">
                
                {/* Simulated frame viewport containers */}
                <div
                  className={`w-full transition-all duration-300 relative ${
                    viewMode === "mobile"
                      ? "max-w-[360px] border-[10px] border-slate-800 rounded-[36px] bg-[#050510] shadow-2xl h-[720px] overflow-y-auto my-4 scrollbar-thin"
                      : "max-w-5xl rounded-2xl bg-[#050510] shadow-xl"
                  }`}
                  id="canvas-viewport"
                >
                  
                  {/* Web window control badges on frame header */}
                  {viewMode === "desktop" && (
                    <div className="h-10 bg-black/40 px-4 border-b border-white/[0.03] flex items-center gap-1.5 shrink-0 rounded-t-2xl z-20 sticky top-0 backdrop-blur-md" id="frame-window-decor">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div className="text-[10px] font-mono text-slate-500 ml-4 truncate flex-1">
                        https://lander.ai/p/{activePage?.slug}
                      </div>
                      <span className="text-[9px] font-mono text-slate-600">LIVE PREVIEW CONTAINER (100%)</span>
                    </div>
                  )}

                  {/* RENDER DYNAMIC CANVAS LANDING PAGE */}
                  {activePage ? (
                    <div
                      className={`${activePage.colorPalette.primaryBg} ${activePage.colorPalette.textPrimary} min-h-screen transition-all select-none`}
                      style={{ fontFamily: activePage.fontFamily === 'mono' ? 'monospace' : activePage.fontFamily === 'serif' ? 'serif' : 'sans-serif' }}
                      id="rendering-canvas-root"
                    >
                      {activePage.sections.map((sec, idx) => {
                        if (!sec.isVisible) return null;
                        const isSelected = selectedSectionId === sec.id;

                        return (
                          <div
                            key={sec.id}
                            onClick={() => {
                              if (!isPreviewActive) {
                                setSelectedSectionId(sec.id);
                              }
                            }}
                            className={`relative text-current transition-all ${
                              isPreviewActive
                                ? ""
                                : `cursor-pointer border-2 ${
                                    isSelected
                                      ? "border-purple-500 bg-purple-950/5"
                                      : "border-transparent hover:border-white/10"
                                  }`
                            }`}
                            id={`canvas-section-${sec.id}`}
                          >
                            
                            {/* HOVER EDIT OVERLAYS (Invisible in pure client simulated preview mode) */}
                            {!isPreviewActive && (
                              <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1 bg-black/80 border border-white/[0.08] p-1.5 rounded-lg text-[10px] opacity-0 hover:opacity-100 group-hover:opacity-100 transition-all cursor-default" onClick={e => e.stopPropagation()} id="section-toolbar">
                                <span className="text-purple-400 font-bold px-1">{sec.type} BLOCK</span>
                                <span className="text-slate-600">|</span>
                                <button
                                  onClick={() => moveSection("up", sec.id)}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Section Up"
                                >
                                  ▴ Move Up
                                </button>
                                <button
                                  onClick={() => moveSection("down", sec.id)}
                                  disabled={idx === activePage.sections.length - 1}
                                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                  title="Move Section Down"
                                >
                                  ▾ Move Down
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                  onClick={() => deleteSection(sec.id)}
                                  className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer text-xs"
                                  title="Delete entire section block"
                                >
                                  ✕ Remove block
                                </button>
                              </div>
                            )}

                            {/* HOVER PERSUASION REWRITE ASSISTANT MINI INDICATOR */}
                            {!isPreviewActive && isSelected && (
                              <div className="absolute bottom-2 right-2 z-10" onClick={e => e.stopPropagation()} id="persuasion-widget-btn">
                                <button
                                  onClick={() => handleAIRewrite(sec.id, "Direct Response Fire")}
                                  disabled={isAiRewriting}
                                  className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg cursor-pointer"
                                >
                                  <Icons.Sparkles className="w-3 h-3 animate-pulse" />
                                  {isAiRewriting ? "Optimizing copywriting..." : "Optimize Copy with AI"}
                                </button>
                              </div>
                            )}

                            {/* SECTION RENDERING PATTERNS */}
                            <div className="pointer-events-auto" id="section-inner-content">
                              
                              {/* HEADER RENDERER */}
                              {sec.type === SectionType.HEADER && (
                                <header className="py-4 px-6 border-b border-current/10 flex items-center justify-between" id="section-header-view">
                                  <div className="font-extrabold text-base flex items-center gap-2">
                                    <span className="text-purple-500">•</span> {(sec.content as HeaderSection).logoName || "ApexFlow"}
                                  </div>
                                  <div className="hidden md:flex items-center gap-6 text-sm text-current/80" id="header-links">
                                    {(sec.content as HeaderSection).links?.map((li: any, lidx: number) => (
                                      <a key={lidx} href={li.href || "#"} className="hover:text-purple-400 transition-all font-medium text-xs">
                                        {li.label}
                                      </a>
                                    ))}
                                  </div>
                                  <button onClick={() => alert("Simulation Action: Header CTA Target Triggered")} className="bg-gradient-to-tr from-purple-600 to-indigo-600 py-1.5 px-3 rounded-lg text-xs font-bold text-white hover:brightness-110 transition-all cursor-pointer">
                                    {(sec.content as HeaderSection).ctaText || "Start"}
                                  </button>
                                </header>
                              )}

                              {/* HERO RENDERER */}
                              {sec.type === SectionType.HERO && (
                                <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="section-hero-view">
                                  <div className="space-y-6" id="hero-left-col">
                                    {(sec.content as HeroSectionData).badge && (
                                      <span className="inline-block text-[10px] font-mono font-bold tracking-widest bg-purple-500/10 border border-purple-500/30 text-purple-300 py-1 px-3 rounded-full uppercase">
                                        {(sec.content as HeroSectionData).badge}
                                      </span>
                                    )}
                                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                                      {(sec.content as HeroSectionData).headline}
                                    </h2>
                                    <p className={`${activePage.colorPalette.textSecondary} text-sm leading-relaxed max-w-lg`}>
                                      {(sec.content as HeroSectionData).subheadline}
                                    </p>
                                    
                                    <div className="space-y-3" id="hero-cta-group">
                                      <div className="flex flex-col sm:flex-row gap-3" id="hero-ctas">
                                        <button onClick={() => alert("Simulation Opt-In Triggered")} className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-xs hover:brightness-110 shadow-lg shadow-purple-900/35 transition-all cursor-pointer">
                                          {(sec.content as HeroSectionData).ctaText}
                                        </button>
                                        {(sec.content as HeroSectionData).secondaryCtaText && (
                                          <button onClick={() => alert("Simulated Secondary Action")} className="bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.07] font-bold py-3 px-6 rounded-xl text-xs transition-all cursor-pointer">
                                            {(sec.content as HeroSectionData).secondaryCtaText}
                                          </button>
                                        )}
                                      </div>
                                      {(sec.content as HeroSectionData).ctaSubtext && (
                                        <p className="text-[10px] text-slate-500 font-mono italic">
                                          {(sec.content as HeroSectionData).ctaSubtext}
                                        </p>
                                      )}
                                    </div>

                                    {(sec.content as HeroSectionData).featuresList && (
                                      <div className="pt-4 space-y-2 text-xs text-current/80" id="hero-mini-vectors">
                                        {(sec.content as HeroSectionData).featuresList?.map((v: string, vidx: number) => (
                                          <div key={vidx} className="flex items-center gap-2">
                                            <span className="text-emerald-400 font-bold">✓</span> {v}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="relative justify-center" id="hero-right-col">
                                    <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-2xl pointer-events-none" />
                                    <img
                                      src={(sec.content as HeroSectionData).imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"}
                                      alt="Campaign Vision Block"
                                      className="rounded-2xl border border-white/[0.08] w-full max-h-72 object-cover relative z-10 shadow-xl"
                                    />
                                  </div>
                                </section>
                              )}

                              {/* FEATURES RENDERER */}
                              {sec.type === SectionType.FEATURES && (
                                <section className="py-12 px-6 max-w-5xl mx-auto space-y-8" id="section-features-view">
                                  <div className="text-center space-y-2 max-w-xl mx-auto" id="feat-title-group">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{(sec.content as FeaturesSectionData).title}</h3>
                                    <p className={`${activePage.colorPalette.textSecondary} text-xs`}>
                                      {(sec.content as FeaturesSectionData).subtitle}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="feat-cards-grid">
                                    {(sec.content as FeaturesSectionData).items?.map((it: any, fidx: number) => (
                                      <div key={it.id || fidx} className={`${activePage.colorPalette.cardBg} ${activePage.colorPalette.border} border p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between`} id={`feat-card-${fidx}`}>
                                        <div className="space-y-3" id="feat-card-top">
                                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/35" id="feat-icon-shell">
                                            {renderIcon(it.icon || "Zap", "w-5 h-5")}
                                          </div>
                                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{it.title}</h4>
                                          <p className={`${activePage.colorPalette.textSecondary} text-xs leading-relaxed`}>
                                            {it.description}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* BENEFITS RENDERER */}
                              {sec.type === SectionType.BENEFITS && (
                                <section className="py-12 bg-white/[0.01] border-y border-white/[0.02] px-6 max-w-5xl mx-auto" id="section-benefits-view">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" id="benefits-grid">
                                    {(sec.content as BenefitsSectionData).items?.map((it: any, bidx: number) => (
                                      <div key={it.id || bidx} className="space-y-2" id={`benefit-card-${bidx}`}>
                                        <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 block">
                                          {it.value || "+100%"}
                                        </span>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{it.title}</h4>
                                        <p className={`${activePage.colorPalette.textSecondary} text-xs leading-relaxed max-w-xs mx-auto`}>
                                          {it.description}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* TESTIMONIALS RENDERER */}
                              {sec.type === SectionType.TESTIMONIALS && (
                                <section className="py-12 px-6 max-w-5xl mx-auto space-y-8" id="section-testimonials-view">
                                  <div className="text-center space-y-2 max-w-xl mx-auto" id="test-title-group">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{(sec.content as TestimonialsSectionData).title}</h3>
                                    <p className={`${activePage.colorPalette.textSecondary} text-xs`}>
                                      {(sec.content as TestimonialsSectionData).subtitle}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="test-cards-grid">
                                    {(sec.content as TestimonialsSectionData).items?.map((it: any, tidx: number) => (
                                      <div key={it.id || tidx} className={`${activePage.colorPalette.cardBg} ${activePage.colorPalette.border} border p-6 rounded-2xl space-y-4 relative`} id={`test-card-${tidx}`}>
                                        
                                        {/* Stars count */}
                                        <div className="flex gap-1 text-amber-400 text-xs" id="test-stars">
                                          {Array.from({ length: it.rating || 5 }).map((_, staridx) => (
                                            <span key={staridx}>★</span>
                                          ))}
                                        </div>
                                        
                                        <p className="text-xs text-current/90 leading-relaxed italic">
                                          "{it.quote}"
                                        </p>

                                        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.03]" id="test-author">
                                          <img
                                            src={it.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"}
                                            alt={it.name}
                                            className="w-10 h-10 rounded-full border border-white/[0.1] object-cover"
                                          />
                                          <div id="author-info">
                                            <h5 className="font-bold text-xs text-white">{it.name}</h5>
                                            <p className="text-[10px] text-slate-500 font-mono italic">{it.role}</p>
                                          </div>
                                        </div>

                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* PRICING PLANS RENDERER */}
                              {sec.type === SectionType.PRICING && (
                                <section className="py-12 bg-white/[0.01] px-6 max-w-5xl mx-auto space-y-8" id="section-pricing-view">
                                  
                                  <div className="text-center space-y-2 max-w-xl mx-auto" id="pricing-title-group">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{(sec.content as PricingSectionData).title}</h3>
                                    <p className={`${activePage.colorPalette.textSecondary} text-xs`}>
                                      {(sec.content as PricingSectionData).subtitle}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto" id="pricing-cards-grid">
                                    {(sec.content as PricingSectionData).plans?.map((pl: PricingPlan, pidx: number) => (
                                      <div key={pl.id || pidx} className={`${activePage.colorPalette.cardBg} ${
                                        pl.isPopular ? "border-purple-500/80 shadow-[0_0_20px_rgba(139,92,246,0.15)]" : activePage.colorPalette.border
                                      } border p-6 rounded-2xl relative flex flex-col justify-between`} id={`pricing-card-${pidx}`}>
                                        
                                        {pl.isPopular && (
                                          <span className="absolute top-3 right-3 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            🌟 MOST POPULAR
                                          </span>
                                        )}

                                        <div className="space-y-4" id="plan-top-info">
                                          <div>
                                            <h4 className="font-bold text-sm text-white uppercase tracking-wider">{pl.name}</h4>
                                            <p className="text-[10px] text-slate-500 mt-1">{pl.description}</p>
                                          </div>

                                          <div className="flex items-baseline gap-1" id="pricing-price-box">
                                            <span className="text-3xl font-extrabold text-white">{pl.price}</span>
                                            <span className="text-xs text-slate-400 font-mono">{pl.period}</span>
                                          </div>

                                          <ul className="space-y-2 pt-2 border-t border-white/[0.03] text-xs text-current/80" id="plan-features">
                                            {pl.features?.map((f: string, fidx: number) => (
                                              <li key={fidx} className="flex items-center gap-2">
                                                <span className="text-emerald-500 font-bold shrink-0">✓</span> {f}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>

                                        <button onClick={() => alert(`Simulating checkout redirect: Selected plan ${pl.name}`)} className="w-full bg-gradient-to-tr from-purple-600 to-indigo-600 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-115 cursor-pointer mt-6">
                                          {pl.buttonText || "Choose Plan"}
                                        </button>

                                      </div>
                                    ))}
                                  </div>

                                </section>
                              )}

                              {/* FAQ RENDERER */}
                              {sec.type === SectionType.FAQ && (
                                <section className="py-12 px-6 max-w-3xl mx-auto space-y-8" id="section-faq-view">
                                  
                                  <div className="text-center space-y-2 max-w-xl mx-auto" id="faq-title-group">
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{(sec.content as FaqSectionData).title}</h3>
                                    <p className={`${activePage.colorPalette.textSecondary} text-xs`}>
                                      {(sec.content as FaqSectionData).subtitle}
                                    </p>
                                  </div>

                                  <div className="space-y-4" id="faq-items-stack">
                                    {(sec.content as FaqSectionData).items?.map((it: any, faqidx: number) => (
                                      <div key={it.id || faqidx} className={`${activePage.colorPalette.cardBg} ${activePage.colorPalette.border} border p-5 rounded-2xl text-left space-y-2`} id={`faq-card-${faqidx}`}>
                                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                          <Icons.HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                          {it.question}
                                        </h4>
                                        <p className={`${activePage.colorPalette.textSecondary} text-xs leading-relaxed pl-6`}>
                                          {it.answer}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                </section>
                              )}

                              {/* CTA COUNTDOWN URGENCY */}
                              {sec.type === SectionType.CTA_URGENCY && (
                                <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto" id="section-cta-urgency-view">
                                  <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950 border border-purple-500/20 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden" id="urgency-glowing-card">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                                    
                                    <div className="space-y-2 relative z-10" id="urgency-headings">
                                      <span className="text-yellow-400 font-mono text-[10px] uppercase font-bold tracking-wider animate-pulse">
                                        ⚡ Limited Sandbox Price Launch Active
                                      </span>
                                      <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white">
                                        {(sec.content as CtaUrgencyData).title}
                                      </h3>
                                      <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                                        {(sec.content as CtaUrgencyData).subtitle}
                                      </p>
                                    </div>

                                    {/* MOCK SECURE BUY BUTTON */}
                                    <div className="space-y-4 relative z-10" id="urgency-actions">
                                      <button onClick={() => alert("Simulation urgency checkout initialized!")} className="bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 px-8 rounded-xl text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer">
                                        {(sec.content as CtaUrgencyData).buttonText}
                                      </button>
                                      
                                      <p className="text-[10px] text-amber-300 font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
                                        🕒 {(sec.content as CtaUrgencyData).urgencyText}
                                      </p>
                                    </div>

                                  </div>
                                </section>
                              )}

                              {/* CONTACT FORM BLOCK */}
                              {sec.type === SectionType.CONTACT_FORM && (
                                <section className="py-12 px-6 max-w-xl mx-auto space-y-6" id="section-contact-view">
                                  
                                  <div className="text-center space-y-2" id="contact-headings">
                                    <h3 className="text-xl font-bold tracking-tight text-white">
                                      {(sec.content as ContactFormData).title}
                                    </h3>
                                    <p className={`${activePage.colorPalette.textSecondary} text-xs`}>
                                      {(sec.content as ContactFormData).subtitle}
                                    </p>
                                  </div>

                                  <div className={`${activePage.colorPalette.cardBg} ${activePage.colorPalette.border} border p-6 rounded-2xl shadow-xl`} id="form-card-container">
                                    {mockFormSuccess ? (
                                      <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-xl text-xs text-emerald-300 text-center animate-pulse" id="form-success-alert">
                                        {mockFormSuccess}
                                      </div>
                                    ) : (
                                      <form onSubmit={(e) => handleTestLeadSubmit(e, activePage.id)} className="space-y-4" id="mock-form">
                                        {(sec.content as ContactFormData).inputs?.map((inp: any, inpidx: number) => (
                                          <div key={inp.id || inpidx} className="text-left space-y-1" id={`form-group-${inpidx}`}>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{inp.label}</label>
                                            <input
                                              type={inp.type || "text"}
                                              value={mockFormInputs[inp.id] || ""}
                                              onChange={(e) => setMockFormInputs({...mockFormInputs, [inp.id]: e.target.value})}
                                              placeholder={inp.placeholder}
                                              className="w-full bg-[#03030a] text-xs text-white rounded-xl p-3 border border-white/[0.08] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                                              required={inp.required}
                                              name={inp.id}
                                            />
                                          </div>
                                        ))}

                                        <button type="submit" className="w-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer mt-4">
                                          {(sec.content as ContactFormData).buttonText || "Get Secret Blueprint ACCESS"}
                                        </button>
                                      </form>
                                    )}
                                  </div>

                                </section>
                              )}

                              {/* ELEMENTOR PRO AFF_REVIEW_STARS */}
                              {sec.type === SectionType.AFF_REVIEW_STARS && (
                                <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto space-y-6 text-left" id="section-aff-review-stars">
                                  <div className="bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/20 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                                      <div className="space-y-2">
                                        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-3 rounded-full uppercase tracking-wider">
                                          ★ TRUST VERIFIED REVIEW PARTNER
                                        </span>
                                        <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                          {(sec.content as any).title}
                                        </h3>
                                      </div>

                                      {/* Editorial score indicator */}
                                      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] p-3 rounded-2xl shrink-0">
                                        <div className="text-center">
                                          <div className="text-xl font-black text-yellow-500 font-mono">
                                            {((sec.content as any).rating || 5).toFixed(1)}
                                          </div>
                                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none font-mono">Star rating</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/[0.08]" />
                                        <div className="flex flex-col justify-center">
                                          <div className="flex gap-0.5 text-yellow-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                              <Icons.Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${
                                                  i < Math.floor((sec.content as any).rating || 5)
                                                    ? "fill-current text-yellow-400"
                                                    : "text-slate-600"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          <div className="text-[9px] text-slate-400 font-bold font-mono">EDITOR CHOICE SCORE</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Score Summary */}
                                    <p className="text-xs leading-relaxed text-slate-300 mt-6 font-medium">
                                      {(sec.content as any).summary}
                                    </p>

                                    {/* PROS & CONS GRID CONTAINER */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                      {/* PROS CARD */}
                                      <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-3">
                                        <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                          ✓ PRO BENEFITS (WHAT WE LOVED)
                                        </h4>
                                        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                          {((sec.content as any).pros || []).map((p: string, pidx: number) => (
                                            <li key={pidx} className="flex items-start gap-2">
                                              <span className="text-emerald-400 text-sm font-bold shrink-0">✓</span>
                                              <span>{p}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* CONS CARD */}
                                      <div className="bg-rose-950/10 border border-rose-500/10 p-5 rounded-2xl space-y-3">
                                        <h4 className="text-[11px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                          ✕ DRAWBACK LIMITATIONS
                                        </h4>
                                        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                          {((sec.content as any).cons || []).map((c: string, cidx: number) => (
                                            <li key={cidx} className="flex items-start gap-2">
                                              <span className="text-rose-400 text-sm font-bold shrink-0">✕</span>
                                              <span>{c}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {/* HIGH-CONVERTING CALL TO ACTION BOX */}
                                    <div className="mt-8 pt-6 border-t border-white/[0.05] text-center space-y-4">
                                      <a
                                        href={(sec.content as any).affiliateUrl || "#"}
                                        onClick={(e) => {
                                          if (!isPreviewActive) e.preventDefault();
                                          alert(`Simulated Affiliate Outbound Click redirecting to: ${(sec.content as any).affiliateUrl || "Default Partner Offer Link"}`);
                                        }}
                                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:brightness-110 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs shadow-xl shadow-emerald-950/30 transition-all cursor-pointer w-full sm:w-auto"
                                      >
                                        <Icons.ExternalLink className="w-4 h-4 shrink-0" />
                                        {(sec.content as any).buttonText}
                                      </a>
                                      <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-slate-500">
                                        <span>✓ Exclusive bonuses automatically applied</span>
                                        <span>•</span>
                                        <span>✓ Secured via SSL encryption</span>
                                      </div>
                                    </div>

                                  </div>
                                </section>
                              )}

                              {/* ELEMENTOR PRO AFF_PRO_CON_CARD */}
                              {sec.type === SectionType.AFF_PRO_CON_CARD && (
                                <section className="py-12 md:py-16 px-6 max-w-5xl mx-auto space-y-8" id="section-aff-pro-con-card">
                                  <div className="text-center space-y-2 max-w-2xl mx-auto">
                                    <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                      {(sec.content as any).title}
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                                      {(sec.content as any).subtitle}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
                                    {/* COLUMN A: HIGHLIGHT RECOMMENDED */}
                                    <div className="bg-gradient-to-b from-purple-900/10 to-slate-950 border-2 border-purple-500 rounded-3xl p-6 md:p-8 relative flex flex-col justify-between shadow-2xl">
                                      <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black uppercase font-mono py-1 px-3.5 rounded-full tracking-widest shadow-md">
                                        🏆 RECOMMENDED TOP CHOICE
                                      </div>

                                      <div className="space-y-6 text-left">
                                        <h4 className="text-base font-extrabold text-white pb-3 border-b border-purple-500/20">
                                          {(sec.content as any).compTitle1}
                                        </h4>
                                        <ul className="space-y-3.5 text-xs text-slate-300">
                                          {((sec.content as any).comp1Items || []).map((item: string, iidx: number) => (
                                            <li key={iidx} className="flex items-start gap-2.5">
                                              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                                              <span className="leading-relaxed">{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="pt-8 mt-6 border-t border-white/[0.05]">
                                        <a
                                          href={(sec.content as any).affiliateUrl || "#"}
                                          onClick={(e) => {
                                            if (!isPreviewActive) e.preventDefault();
                                            alert(`Simulate Outbound Buy: ${(sec.content as any).affiliateUrl}`);
                                          }}
                                          className="block text-center bg-gradient-to-tr from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black py-3 rounded-xl text-xs tracking-wide shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
                                        >
                                          {(sec.content as any).buttonText}
                                        </a>
                                      </div>
                                    </div>

                                    {/* COLUMN B: STANDARD COMPETITOR */}
                                    <div className="bg-white/[0.01] border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-lg opacity-85 hover:opacity-100 transition-all">
                                      <div className="space-y-6 text-left">
                                        <h4 className="text-base font-extrabold text-slate-400 pb-3 border-b border-white/[0.05]">
                                          {(sec.content as any).compTitle2}
                                        </h4>
                                        <ul className="space-y-3.5 text-xs text-slate-400">
                                          {((sec.content as any).comp2Items || []).map((item: string, iidx: number) => (
                                            <li key={iidx} className="flex items-start gap-2.5">
                                              <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center justify-center shrink-0">✕</span>
                                              <span className="leading-relaxed">{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div className="pt-8 mt-6 border-t border-white/[0.05]">
                                        <button className="w-full bg-white/[0.04] text-slate-500 border border-white/5 font-semibold py-3 rounded-xl text-xs cursor-not-allowed">
                                          Avoid Manual Maintenance Hassles
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              )}

                              {/* ELEMENTOR PRO AFF_VIDEO_REVIEW */}
                              {sec.type === SectionType.AFF_VIDEO_REVIEW && (
                                <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto space-y-6 text-center" id="section-aff-video-review">
                                  <div className="space-y-2">
                                    <span className="inline-block text-[10px] font-mono font-bold tracking-widest bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 py-1 px-3 rounded-full uppercase">
                                      {(sec.content as any).badgeText || "★ HIGHLY RECOMMENDED"}
                                    </span>
                                    <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                      {(sec.content as any).title}
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                                      {(sec.content as any).subtitle}
                                    </p>
                                  </div>

                                  {/* SIMULATED YouTube video viewport player box */}
                                  <div className="max-w-2xl mx-auto my-6 relative group cursor-pointer" onClick={() => alert("Simulation Playback: Video is playing inside standard sandbox live simulator!")}>
                                    <div className="absolute inset-0 bg-purple-600/10 rounded-2xl blur-xl pointer-events-none" />
                                    
                                    <div className="aspect-video bg-[#030307] border border-white/[0.08] hover:border-purple-500/30 rounded-2xl flex flex-col justify-center items-center p-8 relative z-10 transition-all overflow-hidden shadow-2xl">
                                      {/* tech thumbnail backdrop preview underlay */}
                                      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=40')] bg-cover bg-center mix-blend-luminosity hover:mix-blend-normal transition-all" />

                                      {/* Controls layer */}
                                      <div className="relative z-10 flex flex-col items-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 transition-all flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
                                          <Icons.Play className="w-6 h-6 fill-current ml-1 text-white" />
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-300 bg-slate-900/90 border border-white/[0.05] px-4 py-1.5 rounded-full tracking-wider select-none">
                                          {(sec.content as any).videoPlaceholderText}
                                        </p>
                                      </div>

                                      {/* Social view counts bottom telemetry */}
                                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-slate-500 z-10">
                                        <span>🔴 LIVE AFFILIATE TEST DRIVE</span>
                                        <span>📶 1080p Stream HD</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Promotional Bundle bottom info */}
                                  <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 max-w-xl mx-auto p-5 rounded-2xl space-y-3 shadow-lg">
                                    <span className="text-[9px] font-mono font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-md uppercase">Affiliate Priority Bonus</span>
                                    <h4 className="text-xs font-bold text-white uppercase leading-snug">
                                      {(sec.content as any).ctaTitle}
                                    </h4>
                                    <a
                                      href={(sec.content as any).affiliateUrl || "#"}
                                      onClick={(e) => {
                                        if (!isPreviewActive) e.preventDefault();
                                        alert(`Affiliate redirect triggered: ${(sec.content as any).affiliateUrl}`);
                                      }}
                                      className="inline-block bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider"
                                    >
                                      {(sec.content as any).buttonText}
                                    </a>
                                  </div>
                                </section>
                              )}

                              {/* ELEMENTOR PRO AFF_BONUS_GRID */}
                              {sec.type === SectionType.AFF_BONUS_GRID && (
                                <section className="py-12 md:py-16 px-6 max-w-5xl mx-auto space-y-8 text-left" id="section-aff-bonus-grid">
                                  <div className="text-center space-y-2 max-w-2xl mx-auto">
                                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 py-1 px-3 rounded-full font-bold uppercase tracking-widest font-mono">
                                      🎁 EXCLUSIVE BUYER BONUS MODULES
                                    </span>
                                    <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                      {(sec.content as any).title}
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                                      {(sec.content as any).subtitle}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="bonus-bento-grid">
                                    {((sec.content as any).items || []).map((bonus: any, bidx: number) => {
                                      const IconComp = (Icons as any)[bonus.icon] || Icons.Gift;
                                      return (
                                        <div key={bonus.id || bidx} className="bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px] relative overflow-hidden shadow-lg" id={`bonus-bento-item-${bidx}`}>
                                          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
                                          <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
                                                <IconComp className="w-5 h-5" />
                                              </div>
                                              <span className="text-[9px] font-mono bg-indigo-500/20 border border-indigo-500/50 text-indigo-200 py-0.5 px-2.5 rounded-full font-black uppercase shadow-sm">
                                                {bonus.valueText || "FREE"}
                                              </span>
                                            </div>
                                            <h4 className="text-xs font-extrabold text-white uppercase tracking-tight leading-snug">
                                              {bonus.title}
                                            </h4>
                                            <p className="text-[11px] leading-relaxed text-slate-400">
                                              {bonus.description}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {((sec.content as any).buttonText) && (
                                    <div className="text-center pt-6 max-w-md mx-auto space-y-2">
                                      <a
                                        href={(sec.content as any).affiliateUrl || "#"}
                                        onClick={(e) => {
                                          if (!isPreviewActive) e.preventDefault();
                                          alert(`Secure discount click redirecting destination: ${(sec.content as any).affiliateUrl}`);
                                        }}
                                        className="inline-flex w-full justify-center bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:brightness-110 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                                      >
                                        {(sec.content as any).buttonText}
                                      </a>
                                      <p className="text-[9px] text-slate-500 text-center font-mono uppercase tracking-widest leading-none">🚀 Grab everything in 1-click today!</p>
                                    </div>
                                  )}
                                </section>
                              )}

                              {/* FOOTER BLOCK RENDERER */}
                              {sec.type === SectionType.FOOTER && (
                                <footer className="py-8 border-t border-current/10 px-6 max-w-5xl mx-auto space-y-4 text-center text-xs text-slate-500" id="section-footer-view">
                                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4" id="footer-brand-row">
                                    <span className="font-extrabold text-white">{(sec.content as FooterSectionData).logoText}</span>
                                    <div className="flex gap-4" id="footer-links">
                                      {(sec.content as FooterSectionData).simpleLinks?.map((li: any, lidx: number) => (
                                        <a key={lidx} href={li.href || "#"} className="hover:text-slate-300 transition-all font-medium">
                                          {li.label}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                  {(sec.content as FooterSectionData).disclaimer && (
                                    <p className="text-[10px] leading-relaxed max-w-2xl mx-auto text-slate-600 italic">
                                      {(sec.content as FooterSectionData).disclaimer}
                                    </p>
                                  )}
                                  <p className="text-[10px] font-mono select-none" id="footer-byline">
                                    {(sec.content as FooterSectionData).copyright}
                                  </p>
                                </footer>
                              )}

                            </div>

                            {/* SMALL PLUSSES PANEL TO TRIGGER SECTION INSERTER */}
                            {!isPreviewActive && (
                              <div className="w-full flex justify-center py-2 relative group-hover:block" id="adder-control">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                  <div className="w-full border-t border-dashed border-white/[0.05] hover:border-purple-500/30 transition-all" />
                                </div>
                                <div className="relative flex justify-center z-10 opacity-60 hover:opacity-100 transition-all" id="plus-wrap">
                                  <div className="relative group/add">
                                    <button className="bg-slate-900 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-950 text-purple-300 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all scale-90 hover:scale-100 cursor-pointer">
                                      <Icons.Plus className="w-4 h-4" />
                                    </button>
                                    {/* DROPDOWN OPTIONS OVERLAY INDENT FOR BUILDER */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 py-2 bg-slate-950 border border-white/[0.08] rounded-xl shadow-2xl mt-1 hidden group-hover/add:block group-focus/add:block text-slate-300 w-44 text-xs z-50 text-left">
                                      <p className="text-[10px] text-slate-500 px-3 uppercase tracking-wider font-bold mb-1">Add Content Block</p>
                                      <button onClick={() => handleAddSection(sec.id, SectionType.FEATURES)} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-all">✦ Feature Cards Grid</button>
                                      <button onClick={() => handleAddSection(sec.id, SectionType.TESTIMONIALS)} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-all">✦ Testimonial Carousel</button>
                                      <button onClick={() => handleAddSection(sec.id, SectionType.PRICING)} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-all">✦ Pricing Plans Check</button>
                                      <button onClick={() => handleAddSection(sec.id, SectionType.FAQ)} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-all">✦ Frequently Answered FAQ</button>
                                      <button onClick={() => handleAddSection(sec.id, SectionType.CTA_URGENCY)} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-all">✦ urgent urgency Banner</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-24 text-center text-slate-500" id="inactive-page-fallback">
                      Page design failed to stream properly. Return back to dashboard.
                    </div>
                  )}

                </div>
              </div>

              {/* SIDEBAR EDIT PANEL CONTROL */}
              <aside className="w-[300px] bg-[#09091a] border-l border-white/[0.05] p-5 flex flex-col justify-between overflow-y-auto z-10 shrink-0" id="editor-inspector-aside">
                
                {/* TOP HALF: SECTION EDIT FORM OR GLOBAL PALETTE EDIT */}
                <div className="space-y-6" id="aside-top">
                  
                  {selectedSectionId && activePage ? (
                    
                    /* CONDITIONAL 1: Active selected section edits forms */
                    <div className="space-y-5" id="section-form-suite">
                      
                      {/* Active Label */}
                      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3" id="meta-sec-header">
                        <div>
                          <span className="text-[10px] text-purple-400 font-mono tracking-widest block uppercase font-bold">Workspace inspector</span>
                          <h3 className="text-sm font-bold text-white uppercase">{
                            activePage.sections.find(s => s.id === selectedSectionId)?.type
                          } Block</h3>
                        </div>
                        <button
                          onClick={() => setSelectedSectionId(null)}
                          className="text-slate-500 hover:text-slate-300 transition-all text-xs"
                          title="Close section selector form"
                        >
                          ✕ Close
                        </button>
                      </div>

                      {/* STYLED RENDERED FORM DEPENDING ON STRUCT */}
                      {(() => {
                        const sec = activePage.sections.find(s => s.id === selectedSectionId);
                        if (!sec) return null;

                        return (
                          <div className="space-y-4 text-xs" id="section-inputs-list">
                            
                            {/* Option 1: Title input for lists or sections */}
                            {"title" in sec.content && (
                              <div id="wrapper-input-title">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Headline Accent Title</label>
                                <textarea
                                  value={sec.content.title || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, title: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 focus:border-purple-500"
                                  rows={2}
                                />
                              </div>
                            )}

                            {/* Option 2: Headline for Hero */}
                            {"headline" in sec.content && (
                              <div id="wrapper-input-headline">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Launch Hook Headline Title</label>
                                <textarea
                                  value={sec.content.headline || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, headline: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] text-xs font-bold leading-relaxed rounded-lg p-2.5 text-slate-200 focus:border-purple-500"
                                  rows={3}
                                />
                              </div>
                            )}

                            {/* Option 3: Subheadline */}
                            {"subheadline" in sec.content && (
                              <div id="wrapper-input-subheadline">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Subheadline Supporting Lead</label>
                                <textarea
                                  value={sec.content.subheadline || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, subheadline: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 focus:border-purple-500"
                                  rows={4}
                                />
                              </div>
                            )}

                            {/* Option 4: Hero secondary checklist list wrapper editing */}
                            {(sec.content as any).featuresList !== undefined && (
                              <div id="wrapper-input-featureslist">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1.5">Checklist Vectors</label>
                                {(sec.content as any).featuresList?.map((featItem: string, fidx: number) => (
                                  <input
                                    key={fidx}
                                    type="text"
                                    value={featItem}
                                    onChange={(e) => {
                                      const updatedList = [...((sec.content as any).featuresList || [])];
                                      updatedList[fidx] = e.target.value;
                                      updateSectionContent(sec.id, { ...sec.content, featuresList: updatedList });
                                    }}
                                    className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 mb-1.5"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Button text adjustments */}
                            {"ctaText" in sec.content && (
                              <div id="wrapper-input-ctatext">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Primary Button Text</label>
                                <input
                                  type="text"
                                  value={sec.content.ctaText || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, ctaText: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 focus:border-purple-500"
                                />
                              </div>
                            )}

                            {"buttonText" in sec.content && (
                              <div id="wrapper-input-buttontext">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Checkout Button copywriting</label>
                                <input
                                  type="text"
                                  value={sec.content.buttonText || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, buttonText: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 focus:border-purple-500"
                                />
                              </div>
                            )}

                            {"urgencyText" in sec.content && (
                              <div id="wrapper-input-urgencytext">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Urgency Warning Text</label>
                                <input
                                  type="text"
                                  value={sec.content.urgencyText || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, urgencyText: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 focus:border-purple-500 font-mono text-amber-300"
                                />
                              </div>
                            )}

                            {/* Option 5: Image configuration wrapper */}
                            {"imageUrl" in sec.content && (
                              <div id="wrapper-input-imageurl">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Media Block Asset Source Link</label>
                                <input
                                  type="text"
                                  value={sec.content.imageUrl || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, imageUrl: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 font-mono text-[10px]"
                                />
                                <span className="text-[9px] text-slate-500 mt-1 block">Support any direct URL (e.g. Unsplash, imgur)</span>
                              </div>
                            )}

                            {"affiliateUrl" in sec.content && (
                              <div id="wrapper-input-affiliateurl" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Affiliate Partner Target URL</label>
                                <input
                                  type="text"
                                  value={(sec.content as any).affiliateUrl || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, affiliateUrl: e.target.value })}
                                  className="w-full bg-[#03030a] border border-emerald-500/30 hover:border-emerald-500 rounded-lg p-2 text-emerald-300 font-mono text-[10px] focus:outline-none"
                                  placeholder="e.g. https://warriorplus.com/o2/a/..."
                                />
                                <span className="text-[9px] text-slate-500 mt-1 block">Renders as the destination for click-through call-to-actions.</span>
                              </div>
                            )}

                            {"rating" in sec.content && (
                              <div id="wrapper-input-rating" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Editor Star Rating Score (0 to 5)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="5"
                                  value={(sec.content as any).rating || 5}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, rating: parseFloat(e.target.value) || 5 })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200"
                                />
                              </div>
                            )}

                            {"summary" in sec.content && (
                              <div id="wrapper-input-summary" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Review Editorial Summary</label>
                                <textarea
                                  value={(sec.content as any).summary || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, summary: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 text-xs"
                                  rows={3}
                                />
                              </div>
                            )}

                            {"pros" in sec.content && (
                              <div id="wrapper-input-pros" className="space-y-1.5 text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px]">Edit Pros List (Comma separated)</label>
                                <textarea
                                  value={((sec.content as any).pros || []).join(", ")}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, pros: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-205 text-xs font-sans"
                                  rows={2}
                                />
                              </div>
                            )}

                            {"cons" in sec.content && (
                              <div id="wrapper-input-cons" className="space-y-1.5 text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px]">Edit Cons List (Comma separated)</label>
                                <textarea
                                  value={((sec.content as any).cons || []).join(", ")}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, cons: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-205 text-xs font-sans"
                                  rows={2}
                                />
                              </div>
                            )}

                            {"compTitle1" in sec.content && (
                              <div id="wrapper-input-comptitles" className="grid grid-cols-2 gap-2 text-left">
                                <div>
                                  <label className="block text-slate-400 font-bold uppercase text-[8px] mb-1">Subject A Title</label>
                                  <input
                                    type="text"
                                    value={(sec.content as any).compTitle1 || ""}
                                    onChange={(e) => updateSectionContent(sec.id, { ...sec.content, compTitle1: e.target.value })}
                                    className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-400 font-bold uppercase text-[8px] mb-1">Subject B Title</label>
                                  <input
                                    type="text"
                                    value={(sec.content as any).compTitle2 || ""}
                                    onChange={(e) => updateSectionContent(sec.id, { ...sec.content, compTitle2: e.target.value })}
                                    className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200 text-[11px]"
                                  />
                                </div>
                              </div>
                            )}

                            {"comp1Items" in sec.content && (
                              <div id="wrapper-input-comp1items" className="space-y-1.5 text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px]">Subject A Strengths (Comma separated)</label>
                                <textarea
                                  value={((sec.content as any).comp1Items || []).join(", ")}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, comp1Items: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-202 text-xs font-sans"
                                  rows={2}
                                />
                              </div>
                            )}

                            {"comp2Items" in sec.content && (
                              <div id="wrapper-input-comp2items" className="space-y-1.5 text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px]">Subject B Drawbacks (Comma separated)</label>
                                <textarea
                                  value={((sec.content as any).comp2Items || []).join(", ")}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, comp2Items: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-202 text-xs font-sans"
                                  rows={2}
                                />
                              </div>
                            )}

                            {"videoPlaceholderText" in sec.content && (
                              <div id="wrapper-input-videoplaceholder" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Video Cover Frame Text</label>
                                <input
                                  type="text"
                                  value={(sec.content as any).videoPlaceholderText || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, videoPlaceholderText: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-220 text-xs"
                                />
                              </div>
                            )}

                            {"badgeText" in sec.content && (
                              <div id="wrapper-input-badgetext" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Social Proof Hover Badge Text</label>
                                <input
                                  type="text"
                                  value={(sec.content as any).badgeText || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, badgeText: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-220 text-xs"
                                />
                              </div>
                            )}

                            {"ctaTitle" in sec.content && (
                              <div id="wrapper-input-ctatitle" className="text-left">
                                <label className="block text-slate-400 font-bold uppercase text-[9px] mb-1">Bonus Urgency Heading copywriting</label>
                                <textarea
                                  value={(sec.content as any).ctaTitle || ""}
                                  onChange={(e) => updateSectionContent(sec.id, { ...sec.content, ctaTitle: e.target.value })}
                                  className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-220 text-xs"
                                  rows={2}
                                />
                              </div>
                            )}

                            {/* Option 6: List Items Sub-editors */}
                            {(sec.content as any).items !== undefined && Array.isArray((sec.content as any).items) && (
                              <div className="space-y-4 border-t border-white/[0.05] pt-4" id="sub-items-group shadow-md">
                                <label className="block text-slate-400 font-bold uppercase text-[9px]">Repeatable List Items ({(sec.content as any).items.length})</label>
                                {(sec.content as any).items.map((item: any, iidx: number) => (
                                  <div key={item.id || iidx} className="bg-[#03030a] border border-white/[0.04] p-3 rounded-xl space-y-2 text-[10px]" id={`repeater-item-${iidx}`}>
                                    <div className="flex justify-between items-center" id="item-control">
                                      <span className="text-[10px] text-purple-400 font-bold font-mono">Item #{iidx + 1}</span>
                                      <button
                                        onClick={() => {
                                          const subList = [...(sec.content as any).items];
                                          subList.splice(iidx, 1);
                                          updateSectionContent(sec.id, { ...sec.content, items: subList });
                                        }}
                                        className="text-rose-400 hover:text-rose-300 transition-all font-semibold"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    
                                    {"title" in item && (
                                      <input
                                        type="text"
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const subList = [...(sec.content as any).items];
                                          subList[iidx] = { ...item, title: e.target.value };
                                          updateSectionContent(sec.id, { ...sec.content, items: subList });
                                        }}
                                        placeholder="Item Title"
                                        className="w-full bg-slate-900 border border-white/[0.08] rounded p-1"
                                      />
                                    )}

                                    {"quote" in item && (
                                      <textarea
                                        value={item.quote || ""}
                                        onChange={(e) => {
                                          const subList = [...(sec.content as any).items];
                                          subList[iidx] = { ...item, quote: e.target.value };
                                          updateSectionContent(sec.id, { ...sec.content, items: subList });
                                        }}
                                        placeholder="Quote feedback"
                                        className="w-full bg-slate-900 border border-white/[0.08] rounded p-1"
                                        rows={3}
                                      />
                                    )}

                                    {"description" in item && (
                                      <textarea
                                        value={item.description || ""}
                                        onChange={(e) => {
                                          const subList = [...(sec.content as any).items];
                                          subList[iidx] = { ...item, description: e.target.value };
                                          updateSectionContent(sec.id, { ...sec.content, items: subList });
                                        }}
                                        placeholder="Description content"
                                        className="w-full bg-slate-900 border border-white/[0.08] rounded p-1"
                                        rows={2}
                                      />
                                    )}

                                    {/* Icon Switcher Dropdown */}
                                    {"icon" in item && (
                                      <div className="flex items-center gap-1.5" id="item-icon-box">
                                        <span className="text-slate-500">Icon:</span>
                                        <select
                                          value={item.icon || "Zap"}
                                          onChange={(e) => {
                                            const subList = [...(sec.content as any).items];
                                            subList[iidx] = { ...item, icon: e.target.value };
                                            updateSectionContent(sec.id, { ...sec.content, items: subList });
                                          }}
                                          className="bg-slate-900 border border-white/[0.08] rounded px-1 py-0.5 text-slate-300"
                                        >
                                          <option value="Zap">Zap ⚡</option>
                                          <option value="Globe">Globe 🌐</option>
                                          <option value="Layers">Layers ⊞</option>
                                          <option value="Activity">Activity 📊</option>
                                          <option value="Cpu">Cpu ⚙</option>
                                          <option value="Shield">Shield 🛡</option>
                                          <option value="DollarSign">Gold 💵</option>
                                          <option value="Users">Users 👥</option>
                                        </select>
                                      </div>
                                    )}

                                  </div>
                                ))}

                                <button
                                  onClick={() => {
                                    const nextItem = {
                                      id: "item-" + Math.random().toString(36).substr(2, 4),
                                      title: "New Bullet Point Outline",
                                      description: "Custom benefit outline structured elegantly.",
                                      icon: "Zap",
                                      value: "100%",
                                      name: "Alex Carter",
                                      role: "Verified Merchant",
                                      quote: "Absolutely blew past our basic templates.",
                                      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                                      rating: 5
                                    };
                                    updateSectionContent(sec.id, { ...sec.content, items: [...((sec.content as any).items || []), nextItem] });
                                  }}
                                  className="w-full border border-dashed border-purple-500/30 hover:border-purple-500 text-purple-400 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  + Create New Item Group
                                </button>
                              </div>
                            )}

                          </div>
                        );
                      })()}

                    </div>
                  ) : (
                    
                    /* CONDITIONAL 2: Page Global Theme adjustments */
                    <div className="space-y-6" id="theme-controls-block">
                      
                      <div className="border-b border-white/[0.05] pb-3" id="meta-theme">
                        <span className="text-[10px] text-slate-500 font-mono tracking-widest block uppercase">GLOBAL THEME KIT</span>
                        <h3 className="text-sm font-bold text-white uppercase">Brand Settings</h3>
                      </div>

                      {/* Design Palettes selection */}
                      <div className="space-y-3" id="palette-choices">
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider">AI Colors Optimizer</label>
                        <div className="grid grid-cols-2 gap-2" id="palette-grid">
                          {COLOR_PALETTES.map((cp) => {
                            const isChosen = activePage.colorPalette.name === cp.name;
                            return (
                              <button
                                key={cp.name}
                                onClick={() => changePalette(cp)}
                                className={`text-[11px] p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                                  isChosen
                                    ? "bg-[#090924] border-purple-500 text-white shadow-md shadow-purple-950/20"
                                    : "bg-slate-900/60 border-white/[0.05] hover:border-white/[0.1] text-slate-400 hover:text-slate-200"
                                } cursor-pointer`}
                              >
                                <span className="font-semibold block truncate mb-1">{cp.name}</span>
                                <div className="flex gap-1 items-center" id="mini-color-strip">
                                  <span className={`w-2.5 h-2.5 rounded-full ${cp.primaryBg}`} style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
                                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Font pairing toggle */}
                      <div className="space-y-3" id="fonts-pairing">
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Typography Alignment</label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-900 border border-white/[0.08] p-1 rounded-xl" id="fonts-choice-strip">
                          <button
                            onClick={() => changeFont("sans")}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activePage.fontFamily === "sans" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-100"
                            }`}
                          >
                            Sans-Serif
                          </button>
                          <button
                            onClick={() => changeFont("serif")}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activePage.fontFamily === "serif" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-100"
                            }`}
                          >
                            Editor
                          </button>
                          <button
                            onClick={() => changeFont("mono")}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activePage.fontFamily === "mono" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-100"
                            }`}
                          >
                            Mono
                          </button>
                        </div>
                      </div>

                      {/* Dynamic AI Headline and Copywriter Ideas Generator Box (Floating/Integrated inside inspector workspace) */}
                      <div className="bg-gradient-to-tr from-purple-950/20 to-slate-900 border border-purple-500/10 p-4 rounded-2xl relative" id="wizard-box animate-pulse">
                        <span className="text-[10px] text-purple-400 font-bold tracking-wider block uppercase mb-3 flex items-center gap-1.5">
                          <Icons.Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                          AI Suggestion Desk
                        </span>
                        
                        <form onSubmit={triggerHeadlineGenerator} className="space-y-2.5 text-[11px]" id="headline-form">
                          <input
                            type="text"
                            value={headlineTopic}
                            onChange={(e) => setHeadlineTopic(e.target.value)}
                            placeholder="My SaaS topic (e.g., SEO tracking)"
                            className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200"
                            required
                          />
                          <input
                            type="text"
                            value={headlineAudience}
                            onChange={(e) => setHeadlineAudience(e.target.value)}
                            placeholder="Target visitors (e.g., small local agencies)"
                            className="w-full bg-[#03030a] border border-white/[0.08] rounded-lg p-2 text-slate-200"
                          />
                          
                          <button
                            type="submit"
                            disabled={isGeneratingHeadlines}
                            className="w-full bg-slate-800 hover:bg-slate-700 hover:border-purple-500 border border-white/[0.1] text-white py-2 rounded-lg transition-all font-bold cursor-pointer"
                          >
                            {isGeneratingHeadlines ? "Generating conversion angles..." : "Generate Headlines Option"}
                          </button>
                        </form>

                        {/* Generated Headlines options block */}
                        {aiHeadlines.length > 0 && (
                          <div className="mt-3 space-y-2 border-t border-white/[0.04] pt-2 max-h-48 overflow-y-auto" id="headline-options">
                            {aiHeadlines.map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  // Auto apply to Hero section if exists
                                  const heroSection = activePage.sections.find(s => s.type === SectionType.HERO);
                                  if (heroSection) {
                                    updateSectionContent(heroSection.id, {
                                      ...heroSection.content,
                                      headline: item.headline,
                                      subheadline: item.subheadline
                                    });
                                    alert("Applied headline option directly to Hero copywriting!");
                                    setSelectedSectionId(heroSection.id);
                                  } else {
                                    alert("No HERO section block visible on this template draft.");
                                  }
                                }}
                                className="bg-[#03030a] border border-white/[0.05] p-2 rounded-lg cursor-pointer hover:border-purple-500 transition-all text-left text-[10px] space-y-1"
                                id={`headline-option-${idx}`}
                              >
                                <p className="font-bold text-slate-200 leading-tight">"{item.headline}"</p>
                                <p className="text-slate-500 line-clamp-2">"{item.subheadline}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* BOTTOM HALF: GLOBAL CAMPAIGN HEALTH MONITOR & ACTIONS */}
                <div className="border-t border-white/[0.05] pt-4 mt-6 space-y-4" id="aside-bottom">
                  
                  {/* AI Recommendation notification card */}
                  <div className="bg-purple-950/20 border border-purple-800/35 p-3.5 rounded-2xl text-[10px] text-slate-400 space-y-2" id="ai-coach-pill">
                    <span className="text-[10px] text-purple-400 font-extrabold flex items-center gap-1 leading-none uppercase">
                      ● AI Conversion Guard Active
                    </span>
                    <p className="leading-relaxed">
                      Lander.ai rates your page build at <b className="text-emerald-400 font-bold">94% conversion index</b> based on direct-response frameworks. Adding direct pricing blocks saves average conversions by up to 18%.
                    </p>
                  </div>

                  {/* Return Button */}
                  <button
                    onClick={() => { setCurrentPageId(null); setSelectedSectionId(null); }}
                    className="w-full bg-[#03030a] hover:bg-white/[0.02] text-slate-400 hover:text-slate-200 border border-white/[0.08] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="back-to-dashboard-btn"
                  >
                    <Icons.Home className="w-3.5 h-3.5" /> Return to Camp List
                  </button>

                </div>

              </aside>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
