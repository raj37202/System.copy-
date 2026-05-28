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
  const [elementorSidebarTab, setElementorSidebarTab] = useState<"widgets" | "global" | "navigator">("widgets");

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

  // Simulated Checkout & Secure Payment Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutPlanName, setCheckoutPlanName] = useState("");
  const [checkoutPlanPrice, setCheckoutPlanPrice] = useState("");
  const [checkoutPlanPeriod, setCheckoutPlanPeriod] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutCardName, setCheckoutCardName] = useState("");
  const [checkoutCardNum, setCheckoutCardNum] = useState("4242 4242 4242 4242");
  const [checkoutCardExpiry, setCheckoutCardExpiry] = useState("12/28");
  const [checkoutCardCVC, setCheckoutCardCVC] = useState("123");
  const [checkoutIsPaying, setCheckoutIsPaying] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutBrand, setCheckoutBrand] = useState<"card" | "paypal" | "gpay">("card");

  const triggerCheckout = (name: string, price: string, period: string) => {
    setCheckoutPlanName(name);
    setCheckoutPlanPrice(price);
    setCheckoutPlanPeriod(period);
    setCheckoutEmail("");
    setCheckoutCardName("");
    setCheckoutSuccess(false);
    setCheckoutIsPaying(false);
    setIsCheckoutModalOpen(true);
  };

  const handleSimulatedPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutIsPaying(true);
    setTimeout(() => {
      setCheckoutIsPaying(false);
      setCheckoutSuccess(true);
      
      // Save buyer as a Lead so it gets integrated with Campaign Leads automatically!
      const newLeadId = "lead-" + Math.random().toString(36).substr(2, 5);
      const matchedPage = getPageById(currentPageId);
      const newLead: Lead = {
        id: newLeadId,
        pageId: currentPageId || "sandbox",
        pageTitle: matchedPage ? matchedPage.title : "Direct Checkout Product",
        email: checkoutEmail || "buyer." + Math.random().toString(36).substr(2, 4) + "@gmail.com",
        name: checkoutCardName || "Verified Buyer",
        details: { 
          message: `👑 CHECKOUT SUCCESS: Purchased ${checkoutPlanName} pricing plan for ${checkoutPlanPrice}${checkoutPlanPeriod || ""}.`,
          method: checkoutBrand === 'card' ? '👨‍💻 Credit Card (SSL)' : checkoutBrand === 'paypal' ? '🌐 PayPal Secure' : '📱 Google Pay Express'
        },
        createdAt: new Date().toISOString()
      };
      
      setLeads(prev => [newLead, ...prev]);

      // Update metrics click & conversions counts
      if (currentPageId) {
        setMetrics(prev => prev.map(m => {
          if (m.pageId === currentPageId) {
            return {
              ...m,
              clicks: m.clicks + 1,
              leads: m.leads + 1,
              conversionRate: Math.round(((m.leads + 1) / m.views) * 1000) / 10
            };
          }
          return m;
        }));
      }
    }, 1500);
  };

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

  const renderHeadline = (text: string) => {
    if (!text) return "";
    if (text.toLowerCase().includes("online courses")) {
      const index = text.toLowerCase().indexOf("online courses");
      const before = text.substring(0, index);
      const after = text.substring(index + "online courses".length);
      return (
        <span>
          {before}
          <span className="relative inline-block text-[#1d2939] z-10 font-black">
            online courses
            <span className="absolute left-0 bottom-[1px] md:bottom-[-2px] w-full h-[6px] bg-[#00a4ff] -z-10 rounded opacity-90" />
          </span>
          {after}
        </span>
      );
    }
    return text;
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

  const updateAllAffiliateUrls = (newUrl: string) => {
    if (!currentPageId || !newUrl) return;
    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return {
        ...p,
        sections: p.sections.map(s => {
          if (s.content && "affiliateUrl" in s.content) {
            return {
              ...s,
              content: {
                ...s.content,
                affiliateUrl: newUrl
              }
            };
          }
          return s;
        })
      };
    }));
  };

  const injectNicheTemplate = (nicheType: string) => {
    if (!currentPageId) return;
    let newSections: LandingPageSection[] = [];
    const affiliateUrl = "https://your-affiliate-link.com";

    if (nicheType === "saas") {
      newSections = [
        {
          id: `sec-header-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HEADER,
          isVisible: true,
          content: {
            logoName: "ApexFlowai",
            links: [
              { label: "Product Review", href: "#section-aff-review-stars" },
              { label: "Comparison", href: "#section-aff-pro-con-card" },
              { label: "Exclusive Bonuses", href: "#section-aff-bonus-grid" }
            ],
            ctaText: "Go To Deal"
          }
        },
        {
          id: `sec-hero-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HERO,
          isVisible: true,
          content: {
            badge: "⚡ EXCLUSIVE 60% COMMISSION PARTNER DISCOUNT DISCOVERED",
            headline: "Brutally Honest ApexFlowai Review: Is It Worth $79/Month Or Total Sensation?",
            subheadline: "We spent 35 days benchmarking ApexFlowai's real-world dynamic page layout cloning algorithms. Check our direct conversion metrics below before joining.",
            ctaText: "Claim Exclusive Deal Now (60% Off)",
            ctaSubtext: "Includes all priority affiliate bonuses listed below automatically.",
            secondaryCtaText: "Scroll Down To Case Study",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            featuresList: ["99.8% Faster Serverless Loadtime", "Real-time AI rewriting included", "Instant custom Domain setup in 1-click"]
          }
        },
        {
          id: `sec-revstars-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_REVIEW_STARS,
          isVisible: true,
          content: {
            title: "⭐ Honest Review of ApexFlowai: Worth the Hype?",
            rating: 4.9,
            summary: "After rigorous performance validation, ApexFlow's clean serverless caching easily beats manual Elementor or WordPress setups. If you deal with active paid traffic campaigns, this is an absolute must-have tool for your tech stack.",
            pros: [
              "99.8% Faster Serverless Edge caching bypasses standard server delays",
              "1-click URL clone mechanics perfectly structures clean landing sections",
              "Inbuilt high-converting copy AI assistant writes headlines instantly"
            ],
            cons: [
              "Only 5 template pre-sets available during early beta sandbox preview",
              "Currently requires a persistent active internet connections"
            ],
            buttonText: "Secure Exclusive Lifetime Discount Slot (Save 60%)",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-procon-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_PRO_CON_CARD,
          isVisible: true,
          content: {
            title: "Side-by-Side Breakdown: How ApexFlow Beats Traditional Builders",
            subtitle: "A detailed metrics chart compiled for direct response marketing professionals.",
            compTitle1: "ApexFlowai / Lander.ai",
            compTitle2: "Traditional Page Builders",
            comp1Items: [
              "Instant AI URL Landing Page Cloning Setup",
              "Native Elementor Pro conversion widgets bundle",
              "Built-in hosting with automated absolute SSL certificates",
              "Dynamic simulated metrics telemetry live checker"
            ],
            comp2Items: [
              "Locked behind expensive individual software subscriptions",
              "Prone to massive WordPress server load slow-downs",
              "Complex separate setups required, style CSS code bugs",
              "No built-in AI copywriting support"
            ],
            buttonText: "Get Instant Lifetime VIP Access Today",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-videorev-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_VIDEO_REVIEW,
          isVisible: true,
          content: {
            title: "🍿 Deep-Dive Video Walkthrough & Test Drive",
            subtitle: "Watch us build, edit, audit, and launch an incredible lead-generation campaign in under 2 minutes.",
            videoPlaceholderText: "Simulated ApexFlow Live Build High-Quality Demonstration video cover. Press play.",
            badgeText: "🔥 24K+ YouTube Views",
            ctaTitle: "Claim $1,200 Worth of Pure Digital Marketing Bonuses When Buying Via Our Link Below Today!",
            buttonText: "Secure Deal & Unlock All Bonuses Now",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-bonus-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_BONUS_GRID,
          isVisible: true,
          content: {
            title: "🎁 Over $1,200 in Pure Actionable Bonuses Added Automatically",
            subtitle: "Every single item is configured instantly free of charge download when you proceed to secure the software via our partner link.",
            items: [
              { id: "b1", title: "Bonus #1: High Ticket Copywriting Vault ($197 Value)", description: "The precise copywriting swipe files used by elite agencies to build high-performance ad promotions.", valueText: "FREE", icon: "FolderLock" },
              { id: "b2", title: "Bonus #2: Page Speed Edge Optimizer ($297 Value)", description: "Code scripts to compress image payloads and scale servers to bypass page delays.", valueText: "FREE", icon: "Sliders" },
              { id: "b3", title: "Bonus #3: Direct Response Private Mastermind ($499 Value)", description: "Network live with seasoned direct response agency founders and copywriters in our Slack.", valueText: "FREE", icon: "MessageSquare" }
            ],
            buttonText: "Register Through Our Partner Link & Claim Bonuses",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-footer-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FOOTER,
          isVisible: true,
          content: {
            copyright: `© ${new Date().getFullYear()} ApexFlow Reviewer. All rights reserved.`,
            logoText: "ApexFlow Reviewer",
            disclaimer: "Income Disclaimer: Results represent individual outcomes. Success requires active application, continuous effort, and marketing diligence. We represent this product as an affiliate and receive commissions on purchases.",
            simpleLinks: [
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Affiliate Disclosure", href: "#" }
            ]
          }
        }
      ];
    } else if (nicheType === "health") {
      newSections = [
        {
          id: `sec-header-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HEADER,
          isVisible: true,
          content: {
            logoName: "SlimCore Wellness",
            links: [
              { label: "Lab Test Results", href: "#section-aff-review-stars" },
              { label: "How It Compares", href: "#section-aff-pro-con-card" },
              { label: "Keto Bonuses", href: "#section-aff-bonus-grid" }
            ],
            ctaText: "Visit Lab Site"
          }
        },
        {
          id: `sec-hero-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HERO,
          isVisible: true,
          content: {
            badge: "🥗 NATURAL DIET VERIFIED SAFE AND BIO-AVAILABLE",
            headline: "Slimcore Keto Drops Pro: Can You Melt 12lbs In 14 Days Without Starving?",
            subheadline: "We analyzed the chemical composition, clinical test groups, and customer feedback of SlimCore premium ketone fat burners. The truth might shock you.",
            ctaText: "Check Official Slimcore Stock Status (Save 50%)",
            ctaSubtext: "Guaranteed 100% money-back satisfaction from official supplier.",
            secondaryCtaText: "Check Core Ingredients",
            imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
            featuresList: ["100% Organic USDA ingredients", "Accelerates ketosis metabolic rate safely", "No synthetic caffeine or nervous jitters"]
          }
        },
        {
          id: `sec-revstars-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_REVIEW_STARS,
          isVisible: true,
          content: {
            title: "⭐ Clinical Testing & Score of Slimcore Drops",
            rating: 4.8,
            summary: "SlimCore Ketone complex is a sublingual drop formula designed for rapid bio-availability. Testing showed a 40% faster ketosis activation than standard powder supplements, while suppressing daily sugar cravings effortlessly.",
            pros: [
              "Sublingual absorption bypasses gastric acid digestion loss",
              "Increases natural baseline energy and limits cognitive fog",
              "Suppresses persistent emotional appetite from Day 1"
            ],
            cons: [
              "Slight herbal tart flavor might require drinking water",
              "Extremely high demand often causes official stock delays"
            ],
            buttonText: "Check Current Slimcore Factory Direct Discounts Available",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-procon-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_PRO_CON_CARD,
          isVisible: true,
          content: {
            title: "Side-by-Side: Slimcore Natural Drops vs Standard Diet Pills",
            subtitle: "Chemical comparison performed by independent health and wellness professionals.",
            compTitle1: "Slimcore Wellness Ketones",
            compTitle2: "Standard Fat Burner Pills",
            comp1Items: [
              "Direct sublingual rapid bio-available delivery",
              "100% clinically verified organic green extracts",
              "Promotes slow and sound sleep alongside ketosis",
              "Zero synthetic additives, fillers, or binding powders"
            ],
            comp2Items: [
              "Must pass hepatic digest systems (70% active ingredient waste)",
              "Laced with unsafe levels of dehydrating caffeine",
              "Causes heavy blood sugar spikes and crashes",
              "Hard to swallow, slow to dissolve"
            ],
            buttonText: "Secure Official Discount Bottle Pack Today",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-videorev-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_VIDEO_REVIEW,
          isVisible: true,
          content: {
            title: "🍿 Customer Testimonial Diaries & Fluid Dissolve Demo",
            subtitle: "Watch us perform a clear bio-availability dissolve test in hot liquids and review real 12-week weight loss logs.",
            videoPlaceholderText: "Simulated Nutritionist Lab Testing Demonstration. Press to play.",
            badgeText: "🔥 58K+ Active Orders",
            ctaTitle: "Grab Slimcore Today & Receive Our Exclusive Fit-Life Bonus Bundle Books Instantly Free!",
            buttonText: "Get Slimcore & Free Bonuses Today",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-bonus-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_BONUS_GRID,
          isVisible: true,
          content: {
            title: "🎁 Over $300 in Premium Fitness and Habit Bonuses Included",
            subtitle: "Get all these custom pre-configured premium materials instantly free when you purchase through our link.",
            items: [
              { id: "b1", title: "Bonus #1: The Keto Recipe Swipe Deck ($147 Value)", description: "The ultimate 10-minute recipes to maintain maximum ketone levels without giving up delicious food.", valueText: "FREE", icon: "FolderLock" },
              { id: "b2", title: "Bonus #2: Water Habit Mobile Calendar Tracker ($47 Value)", description: "Daily notification prompts and calendars to maintain perfect cell hydration during rapid ketosis.", valueText: "FREE", icon: "Sliders" },
              { id: "b3", title: "Bonus #3: Premium Clean Detox Tea Secrets ($97 Value)", description: "Simple herbal detox tea recipes you can make at home to cleanse liver and kidney systems.", valueText: "FREE", icon: "MessageSquare" }
            ],
            buttonText: "Secure Bottle Promotion & Claim Nutritional Bonuses",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-footer-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FOOTER,
          isVisible: true,
          content: {
            copyright: `© ${new Date().getFullYear()} SlimCore Reviews. All rights reserved.`,
            logoText: "SlimCore Reviews",
            disclaimer: "Disclaimer: These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Results represent individual outcomes.",
            simpleLinks: [
              { label: "Privacy Core", href: "#" },
              { label: "FDA Disclaimers", href: "#" },
              { label: "Affiliate Affiliate Compensation", href: "#" }
            ]
          }
        }
      ];
    } else if (nicheType === "crypto") {
      newSections = [
        {
          id: `sec-header-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HEADER,
          isVisible: true,
          content: {
            logoName: "Wealth DeFi Protocol",
            links: [
              { label: "Audit Report", href: "#section-aff-review-stars" },
              { label: "System Compare", href: "#section-aff-pro-con-card" },
              { label: "DeFi Bonuses", href: "#section-aff-bonus-grid" }
            ],
            ctaText: "Join Live Class"
          }
        },
        {
          id: `sec-hero-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HERO,
          isVisible: true,
          content: {
            badge: "📈 100% PASSIVE BLOCKCHAIN INCOME SYSTEM REVIEWED",
            headline: "Passive Wealth Protocol: The Underground Crypto Staking System of 2026",
            subheadline: "Tired of volatile shitcoins and trading fatigue? We completed an audit on a passive decentralized liquidity protocol that targets a steady 12.5% yield completely offline.",
            ctaText: "Check Web Seminar Slots (No-Cost Ticket)",
            ctaSubtext: "Includes immediate training workbook free download.",
            secondaryCtaText: "Read Protocol Metrics",
            imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
            featuresList: ["Zero trading experience required", "Runs completely hands-free once setup", "Fully backed by audited smart-contracts"]
          }
        },
        {
          id: `sec-revstars-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_REVIEW_STARS,
          isVisible: true,
          content: {
            title: "⭐ Professional Safety & Smart-Contract Audit",
            rating: 4.7,
            summary: "The Passive Wealth Protocol uses a dual-hedged market maker pool to capture micro swap gas fees. The protocol passed a major safety audit with flying colors, displaying standard stablecoin liquidity with zero risk of capital drain.",
            pros: [
              "Generates steady passive yields directly from blockchain network gas fees",
              "Smart-contracts fully audited by CertiK with a safe score",
              "Requires as little as $100 in baseline liquidity capital to initiate"
            ],
            cons: [
              "Requires a MetaMask or Exodus decentralized cryptocurrency wallet",
              "Subject to minor Ethereum or Solana baseline network gas spikes"
            ],
            buttonText: "Claim Free Ticket to Crypto Wealth Web Masterclass",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-procon-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_PRO_CON_CARD,
          isVisible: true,
          content: {
            title: "Side-by-Side: Automated Vault Staking vs Shitcoin Trading",
            subtitle: "Risk-reward comparison designed to preserve and scale generational wealth.",
            compTitle1: "Passive Wealth Liquidity Pool",
            compTitle2: "Typical Crypto Trading",
            comp1Items: [
              "Algorithmic mathematically backed slow & safe wealth growth",
              "Audited smart-contract secure escrow pools",
              "Requires only 10 minutes of weekly maintenance",
              "Captures transaction gas fees from all swap tokens"
            ],
            comp2Items: [
              "Exposed to highly aggressive pump & dump market manipulation",
              "Kept on fragile centralized exchange servers (FTX risk)",
              "Requires 12+ hours daily screen charting, causes severe anxiety",
              "Only profitable during active bull markets"
            ],
            buttonText: "Secure Verified Training Reservation Free",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-videorev-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_VIDEO_REVIEW,
          isVisible: true,
          content: {
            title: "🍿 Live Vault Dashboard & Secret Staking Demonstration",
            subtitle: "Watch real live wallet staking pool run on mainnet. We deposit coins live, and harvest real-time rewards in under 90 seconds.",
            videoPlaceholderText: "Simulated Mainnet Vault Deposit Walkthrough. Press to play.",
            badgeText: "🔥 14K+ Live Students",
            ctaTitle: "Enroll For No-Cost Today & Claim Our Exclusive Developer Bonus DeFi Yield Farming Cheat Sheets!",
            buttonText: "Enroll In Free Training & Receive DeFi Manuals",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-bonus-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.AFF_BONUS_GRID,
          isVisible: true,
          content: {
            title: "🎁 Over $500 in High-Ticket Crypto DeFi Bonuses",
            subtitle: "Receive all download links immediately inside the masterclass registration room.",
            items: [
              { id: "b1", title: "Bonus #1: DeFi Yield Farm Cheat Sheet ($197 Value)", description: "The direct hot list of highest yielding audited stablecoin pools updated daily.", valueText: "FREE", icon: "FolderLock" },
              { id: "b2", title: "Bonus #2: Low-Gas Crypto Wallet Setup Guide ($99 Value)", description: "Step-by-step illustrations to optimize your wallet parameters to pay lowest network fees.", valueText: "FREE", icon: "Sliders" },
              { id: "b3", title: "Bonus #3: VIP Wealth Signal Mastermind Access ($297 Value)", description: "A free 30-day ticket to check live staking signals and chat with blockchain veteran miners.", valueText: "FREE", icon: "MessageSquare" }
            ],
            buttonText: "Secure Free Registration Ticket & Access DeFi Manuals Now",
            affiliateUrl: affiliateUrl
          }
        },
        {
          id: `sec-footer-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FOOTER,
          isVisible: true,
          content: {
            copyright: `© ${new Date().getFullYear()} Passive Yield Hub. All rights reserved.`,
            logoText: "Passive Yield Hub",
            disclaimer: "Disclaimer: Trading and staking cryptocurrencies involves high risk. This is not financial advice. Past performance is not indicative of future rewards.",
            simpleLinks: [
              { label: "Privacy Policy", href: "#" },
              { label: "Risk Disclosures", href: "#" },
              { label: "Partner Commissions", href: "#" }
            ]
          }
        }
      ];
    } else if (nicheType === "systeme") {
      newSections = [
        {
          id: `sec-header-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HEADER,
          isVisible: true,
          content: {
            logoName: "systeme.io",
            links: [
              { label: "Why systeme.io?", href: "#" },
              { label: "Features", href: "#" },
              { label: "Resources", href: "#" },
              { label: "Pricing", href: "#" }
            ],
            ctaText: "Start for free"
          }
        },
        {
          id: `sec-hero-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.HERO,
          isVisible: true,
          content: {
            badge: "",
            headline: "Your platform for online courses",
            subheadline: "Powering 500,000+ entrepreneurs. Get your free account now!",
            ctaText: "Click here",
            ctaSubtext: "Free forever. No credit card required.",
            secondaryCtaText: "",
            imageUrl: ""
          }
        },
        {
          id: `sec-features-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FEATURES,
          isVisible: true,
          content: {
            title: "All the features you need in one place",
            subtitle: "Stop using 10 different tools to run your business. Systeme replaces them with absolute ease.",
            items: [
              {
                id: "sysf1",
                title: "Instant Sales Funnels",
                description: "Create sales funnels quickly based on responsive, beautiful layouts designed to elevate email capture.",
                icon: "Zap"
              },
              {
                id: "sysf2",
                title: "Email Automated Marketing",
                description: "Send unlimited marketing newsletters, organize triggers, and automate your entire series.",
                icon: "Mail"
              },
              {
                id: "sysf3",
                title: "Online Courses Portal",
                description: "Construct elegant membership sites, organize student levels, and process checkouts directly.",
                icon: "Layers"
              }
            ]
          }
        },
        {
          id: `sec-pricing-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.PRICING,
          isVisible: true,
          content: {
            title: "Pricing Plans built for solo scale developers",
            subtitle: "Start absolutely free and upgrade later as your business grows.",
            plans: [
              {
                id: "sysp1",
                name: "Free Subscription",
                price: "$0",
                period: "/mo",
                description: "Everything you need to set up your initial list with zero budget.",
                features: [
                  "2,000 Active Contacts",
                  "Three custom sales funnels",
                  "Unlimited email delivery sends",
                  "1 Membership course portal",
                  "24/7 dedicated support desk"
                ],
                buttonText: "Start FREE Now",
                isPopular: false
              },
              {
                id: "sysp2",
                name: "Startup Active Tier",
                price: "$27",
                period: "/mo",
                description: "Perfect for launch models ready to establish professional branding and domains.",
                features: [
                  "5,000 Active Contacts",
                  "Ten custom sales funnels",
                  "Unlimited email delivery sends",
                  "5 Membership course portals",
                  "Custom domain name integrations",
                  "Automatic affiliate engine triggers"
                ],
                buttonText: "Scale My Campaigns",
                isPopular: true
              }
            ]
          }
        },
        {
          id: `sec-faq-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FAQ,
          isVisible: true,
          content: {
            title: "Common Inquiries",
            subtitle: "Your questions answered in seconds.",
            items: [
              {
                id: "sysq1",
                question: "Is the Free plan really free forever?",
                answer: "Yes. Our Free plan costs $0 and will remain free for life as long as you do not exceed 2,000 contacts or need custom complex automation triggers."
              },
              {
                id: "sysq2",
                question: "Can I transfer courses from other builders?",
                answer: "Absolutely! Our professional migration team will extract, organize, and import all materials to systeme.io completely free on any annual upgrade."
              }
            ]
          }
        },
        {
          id: `sec-footer-${Math.random().toString(36).substr(2, 4)}`,
          type: SectionType.FOOTER,
          isVisible: true,
          content: {
            copyright: `© 2026 systeme.io. Reconstruction developed with Lander.ai. All rights reserved.`,
            logoText: "systeme.io Ltd",
            disclaimer: "Disclaimer: This landing page is inspired by systeme.io. It is an affiliate-focused blueprint configured dynamically inside Lander.ai.",
            simpleLinks: [
              { label: "Disclaimer", href: "#" },
              { label: "T&C", href: "#" }
            ]
          }
        }
      ];
    }

    setPages(prev => prev.map(p => {
      if (p.id !== currentPageId) return p;
      return {
        ...p,
        sections: newSections
      };
    }));
    
    // Automatically select the first review as selected section to show control panel immediately
    const firstReview = newSections.find(s => s.type === SectionType.AFF_REVIEW_STARS);
    if (firstReview) {
      setSelectedSectionId(firstReview.id);
    }
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
                <div className="w-[280px] bg-[#070712]/95 border-r border-[#ffffff]/10 flex flex-col h-full overflow-hidden shrink-0" id="elementor-pro-sidebar">
                  {/* Sidebar Brand Header Banner with pink/red block signature to mimic Elementor Pro */}
                  <div className="p-3 bg-slate-900 border-b border-white/[0.05] shrink-0" id="elementor-brand-header">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black text-xs flex items-center justify-center font-mono shadow-md tracking-wider shrink-0">
                          E!
                        </span>
                        <div className="text-left">
                          <h4 className="text-xs font-extrabold tracking-wider text-white uppercase font-sans flex items-center gap-1 leading-none font-sans">
                            Elementor Pro <span className="text-[7px] text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1 py-0.5 rounded uppercase font-bold leading-none shrink-0 font-sans">Affiliate</span>
                          </h4>
                          <p className="text-[8px] text-slate-500 leading-none mt-1 font-sans">Instant affiliate landing tools</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Navigation Tabs */}
                  <div className="grid grid-cols-3 border-b border-white/[0.04] bg-[#020206] shrink-0 p-1 gap-1" id="elementor-tabs">
                    <button
                      onClick={() => setElementorSidebarTab("widgets")}
                      className={`py-2 rounded text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all font-sans ${
                        elementorSidebarTab === "widgets"
                          ? "bg-rose-600/15 text-rose-405 border border-rose-500/25"
                          : "text-slate-400 hover:text-slate-205 border border-transparent"
                      }`}
                    >
                      <Icons.Grid className="w-3.5 h-3.5" />
                      Widgets
                    </button>
                    <button
                      onClick={() => setElementorSidebarTab("global")}
                      className={`py-2 rounded text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all font-sans ${
                        elementorSidebarTab === "global"
                          ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/25"
                          : "text-slate-400 hover:text-slate-205 border border-transparent"
                      }`}
                    >
                      <Icons.Settings className="w-3.5 h-3.5" />
                      Setup
                    </button>
                    <button
                      onClick={() => setElementorSidebarTab("navigator")}
                      className={`py-2 rounded text-[10px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all font-sans ${
                        elementorSidebarTab === "navigator"
                          ? "bg-purple-600/15 text-purple-405 border border-purple-500/25"
                          : "text-slate-400 hover:text-slate-205 border border-transparent"
                      }`}
                    >
                      <Icons.Layers className="w-3.5 h-3.5" />
                      Navigator
                    </button>
                  </div>

                  {/* Tab Panels */}
                  {elementorSidebarTab === "widgets" && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Search Box */}
                      <div className="p-3 border-b border-white/[0.03] shrink-0" id="elementor-search-box">
                        <div className="relative font-sans">
                          <Icons.Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="text"
                            value={widgetSearch}
                            onChange={(e) => setWidgetSearch(e.target.value)}
                            placeholder="Search widgets (e.g., star, review)..."
                            className="w-full bg-[#030308] border border-white/[0.06] rounded-lg pl-8 p-1.5 text-[10px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/30 text-left font-sans"
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
                              <span className="block text-[8px] text-slate-500 truncate font-sans">Grid of metrics</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

                  {/* Tab Content Panel 2: GLOBAL SETUP & PERSUASIVE STARTERS */}
                  {elementorSidebarTab === "global" && (
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin text-left font-sans" id="elementor-global-panel">
                      {/* Section A: Global Commission routing */}
                      <div className="space-y-1.5 font-sans">
                        <span className="block text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">🔗 COMMISSION LINK ROUTER</span>
                        <div className="bg-[#0b1c11]/80 border border-emerald-500/20 rounded-xl p-3 space-y-1.5 shadow-sm font-sans">
                          <label className="block text-[9px] text-slate-300 font-bold uppercase tracking-wider font-sans">Your Affiliate Target URL</label>
                          <div className="relative font-sans">
                            <Icons.Link className="absolute left-2 top-2.5 w-3 h-3 text-emerald-400 animate-pulse" />
                            <input
                              type="text"
                              value={
                                (activePage.sections.find(s => s.content && "affiliateUrl" in s.content)?.content as any)?.affiliateUrl || ""
                              }
                              onChange={(e) => updateAllAffiliateUrls(e.target.value)}
                              placeholder="e.g., https://warriorplus.com/..."
                              className="w-full bg-black/70 border border-emerald-500/35 text-emerald-300 font-mono text-[9px] pl-6 p-1.5 rounded-lg focus:outline-none focus:border-emerald-400 text-left"
                            />
                          </div>
                          <span className="block text-[8px] text-emerald-500/90 leading-tight font-sans">
                            ⚡ <b>Instant Auto-Sync:</b> This immediately writes your custom link to all active reviewer buttons, headers, and bonuses!
                          </span>
                        </div>
                      </div>

                      {/* Section B: 1-Click expert Niche Content starters */}
                      <div className="space-y-2 pt-1 border-t border-white/[0.03] font-sans">
                        <span className="block text-[9px] font-bold text-rose-400 uppercase tracking-widest font-mono">🚀 1-CLICK NICHE PRELOADERS</span>
                        <p className="text-[9.5px] text-slate-400 leading-tight font-sans">Pre-populate your workspace with professional affiliate review copy in seconds:</p>

                        <div className="space-y-2 pt-1 font-sans">
                          {/* SaaS review */}
                          <button
                            onClick={() => {
                              if (confirm("Replace current view with professional SaaS AI Software clone template reviews? Your configurations will be updated.")) {
                                injectNicheTemplate("saas");
                              }
                            }}
                            className="w-full bg-slate-900/60 hover:bg-slate-900 border border-white/[0.04] hover:border-pink-500/30 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer group text-left transition-all font-sans"
                          >
                            <div className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg group-hover:scale-105 transition-all">
                              <Icons.Zap className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0 font-sans">
                              <span className="block text-[10px] font-bold text-white group-hover:text-pink-300 font-sans">Software / AI SaaS Reviews</span>
                              <span className="block text-[8px] text-slate-500 font-mono">Applies ApexFlowai verified copy</span>
                            </div>
                          </button>

                          {/* Health drop */}
                          <button
                            onClick={() => {
                              if (confirm("Replace current view with professional Bio-Health Weight Loss supplement reviews? Your configurations will be updated.")) {
                                injectNicheTemplate("health");
                              }
                            }}
                            className="w-full bg-slate-900/60 hover:bg-slate-905 border border-white/[0.04] hover:border-emerald-500/35 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer group text-left transition-all font-sans"
                          >
                            <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:scale-105 transition-all">
                              <Icons.Activity className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0 font-sans">
                              <span className="block text-[10px] font-bold text-white group-hover:text-emerald-300 font-sans">Health Drops / Supplement</span>
                              <span className="block text-[8px] text-slate-500 font-mono font-sans">Applies Slimcore Wellness copy</span>
                            </div>
                          </button>

                          {/* Crypto course */}
                          <button
                            onClick={() => {
                              if (confirm("Replace current view with high ticket Blockchain passive signals course templates? Your configurations will be updated.")) {
                                injectNicheTemplate("crypto");
                              }
                            }}
                            className="w-full bg-slate-900/60 hover:bg-slate-950 border border-white/[0.04] hover:border-yellow-500/35 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer group text-left transition-all font-sans"
                          >
                            <div className="p-1.5 bg-yellow-500/10 text-yellow-550 rounded-lg group-hover:scale-105 transition-all">
                              <Icons.Coins className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0 font-sans">
                              <span className="block text-[10px] font-bold text-white group-hover:text-yellow-400 font-sans">Wealth System & DeFi Masterclass</span>
                              <span className="block text-[8px] text-slate-500 font-mono font-sans">Applies Passive Protocol copy</span>
                            </div>
                          </button>

                          {/* Systeme.io course */}
                          <button
                            onClick={() => {
                              if (confirm("Replace current view with high-fidelity Systeme.io courses and funnels template? Your configurations will be updated.")) {
                                injectNicheTemplate("systeme");
                              }
                            }}
                            className="w-full bg-slate-900/60 hover:bg-slate-950 border border-white/[0.04] hover:border-blue-500/35 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer group text-left transition-all font-sans"
                          >
                            <div className="p-1.5 bg-blue-500/10 text-[#00a4ff] rounded-lg group-hover:scale-105 transition-all">
                              <Icons.MonitorPlay className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0 font-sans">
                              <span className="block text-[10px] font-bold text-white group-hover:text-blue-300 font-sans">Systeme.io Electric Funnel</span>
                              <span className="block text-[8px] text-slate-500 font-mono font-sans">Applies Systeme Course capture copy</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Section C: Aesthetic Skins presets */}
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.03] font-sans">
                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">🎨 BRAND APPEARANCE SKINS</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {COLOR_PALETTES.map((pal, idx) => (
                            <button
                              key={idx}
                              onClick={() => changePalette(pal)}
                              className={`p-1.5 rounded-lg border text-[9px] transition-all text-left truncate cursor-pointer font-sans ${
                                activePage.colorPalette?.name === pal.name
                                  ? "border-purple-500 bg-purple-500/10 text-white"
                                  : "border-white/[0.04] bg-slate-900/40 text-slate-400 hover:text-slate-205"
                              }`}
                            >
                              <div className="flex items-center gap-1 font-sans">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 inline-block shrink-0" />
                                <span className="truncate font-sans font-sans">{pal.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content Panel 3: REAL-TIME NAVIGATOR TREE */}
                  {elementorSidebarTab === "navigator" && (
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin text-left font-sans" id="elementor-navigator-panel">
                      <div className="flex items-center justify-between shrink-0 font-sans">
                        <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest font-mono">🗺️ PAGE INSTANCE TREE</span>
                        <span className="text-[8px] text-slate-500 font-mono">{activePage.sections.length} Components</span>
                      </div>

                      <div className="space-y-1.5 font-sans justify-start">
                        {activePage.sections.map((sec, idx) => {
                          const isSelected = selectedSectionId === sec.id;
                          return (
                            <div
                              key={sec.id}
                              className={`group p-2 rounded-xl border flex items-center justify-between transition-all font-sans ${
                                isSelected
                                  ? "bg-purple-600/10 border-purple-500/50 text-purple-200"
                                  : "bg-slate-900/30 border-white/[0.03] text-slate-400 hover:bg-slate-900/70"
                              }`}
                            >
                              {/* Left detail anchor click */}
                              <button
                                onClick={() => {
                                  setSelectedSectionId(sec.id);
                                  document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                className="flex-1 text-left truncate cursor-pointer mr-2 font-sans"
                              >
                                <span className="block text-[9px] font-extrabold truncate font-sans">
                                  {idx + 1}. {sec.type.replace("aff_", "⭐ ").replace(/_/g, " ").toUpperCase()}
                                </span>
                                <span className="block text-[8px] text-slate-500 truncate font-mono">id: {sec.id}</span>
                              </button>

                              {/* Operations buttons */}
                              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-all">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => moveSection("up", sec.id)}
                                  className="p-1 hover:bg-black/40 text-slate-500 hover:text-white rounded disabled:opacity-20 cursor-pointer"
                                  title="Move Up"
                                >
                                  <Icons.ArrowUp className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  disabled={idx === activePage.sections.length - 1}
                                  onClick={() => moveSection("down", sec.id)}
                                  className="p-1 hover:bg-black/40 text-slate-500 hover:text-white rounded disabled:opacity-20 cursor-pointer"
                                  title="Move Down"
                                >
                                  <Icons.ArrowDown className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this section from your landing page?")) {
                                      deleteSection(sec.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                                  title="Delete component"
                                >
                                  <Icons.Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {activePage.sections.length === 0 && (
                        <div className="p-8 text-center text-slate-600 text-xs font-mono">
                          No sections. Drop a widget!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Easy Use Instructions micro banner */}
                  <div className="p-3 bg-slate-900/40 border-t border-white/[0.03] text-center text-[9px] text-slate-500 font-medium select-none shrink-0" id="elementor-micro-byline-persistent">
                    🚀 <b className="text-rose-400 uppercase font-bold tracking-wider font-sans">Elementor Core Toolset Active</b>
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
                        const isLightSkin = activePage.colorPalette.primaryBg === "bg-[#f4f4f5]" || activePage.colorPalette.primaryBg === "bg-white" || activePage.colorPalette.primaryBg === "bg-slate-50" || activePage.colorPalette.primaryBg === "bg-zinc-50" || activePage.colorPalette.primaryBg === "bg-stone-50" || activePage.colorPalette.name.includes("Systeme");
                        const textHeadingClass = isLightSkin ? "text-[#1d2939]" : "text-white";
                        const isSystemeTheme = activePage.colorPalette.name.includes("Systeme");

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
                              {sec.type === SectionType.HEADER && (() => {
                                const hasSystemeLogo = ((sec.content as HeaderSection).logoName || "").toLowerCase().includes("systeme");
                                return (
                                  <header className="py-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800" id="section-header-view">
                                    <div className="font-extrabold text-base flex items-center gap-2">
                                      {hasSystemeLogo ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-[#00a4ff] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm select-none">
                                            s
                                          </div>
                                          <span className="text-[#1d2939] font-extrabold text-lg tracking-tight select-none">systeme<span className="text-[#00a4ff]">.io</span></span>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="text-purple-500">•</span> {(sec.content as HeaderSection).logoName || "ApexFlow"}
                                        </>
                                      )}
                                    </div>
                                    <div className="hidden md:flex items-center gap-6 text-sm text-slate-600" id="header-links">
                                      {(sec.content as HeaderSection).links?.map((li: any, lidx: number) => (
                                        <a key={lidx} href={li.href || "#"} className="hover:text-[#00a4ff] transition-all font-semibold text-xs text-[#475467]">
                                          {li.label}
                                        </a>
                                      ))}
                                    </div>
                                    <button 
                                      onClick={() => triggerCheckout("Premium Member Pass", "$19", "/mo")} 
                                      className={`${
                                        hasSystemeLogo 
                                          ? "bg-transparent hover:bg-slate-50 text-[#475467] font-semibold border border-slate-200 py-2 px-4" 
                                          : "bg-gradient-to-tr from-purple-600 to-indigo-600 font-bold text-white py-1.5 px-3"
                                      } rounded-lg text-xs transition-all cursor-pointer`}
                                    >
                                      {(sec.content as HeaderSection).ctaText || "Start"}
                                    </button>
                                  </header>
                                );
                              })()}

                              {/* HERO RENDERER */}
                              {sec.type === SectionType.HERO && (() => {
                                const isSystemeHero = (sec.content as HeroSectionData).headline?.toLowerCase().includes("online courses") || !(sec.content as HeroSectionData).imageUrl;
                                if (isSystemeHero) {
                                  return (
                                    <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-8" id="section-hero-view">
                                      <div className="space-y-6 max-w-3xl flex flex-col items-center justify-center text-center animate-fade-in" id="hero-centered-content">
                                        {(sec.content as HeroSectionData).badge && (
                                          <span className="inline-block text-[10px] font-mono font-bold tracking-widest bg-blue-500/10 border border-blue-500/30 text-[#00a4ff] py-1 px-3 rounded-full uppercase">
                                            {(sec.content as HeroSectionData).badge}
                                          </span>
                                        )}
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-[#1d2939] max-w-2xl">
                                          {renderHeadline((sec.content as HeroSectionData).headline)}
                                        </h2>
                                        <div className="space-y-2">
                                          <p className="text-base md:text-xl font-medium text-[#475467] leading-relaxed max-w-2xl font-sans text-center">
                                            Powering 500,000+ entrepreneurs
                                          </p>
                                          <p className="text-xs md:text-sm font-bold text-[#00a4ff] tracking-wide uppercase font-sans">
                                            Get your free account now!
                                          </p>
                                        </div>
                                        
                                        <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 pt-4" id="hero-sys-inputs">
                                          <div className="relative flex-1">
                                            <input
                                              type="email"
                                              placeholder="Enter your email address"
                                              disabled
                                              className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-3 pr-3 py-3.5 text-sm text-[#1d2939] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a4ff] font-sans antialiased text-left shadow-xs"
                                            />
                                          </div>
                                          <button onClick={() => triggerCheckout("Free Systeme Course Account", "$0", " /forever")} className="bg-[#00a4ff] hover:bg-[#0090ff] text-white font-extrabold py-3.5 px-8 rounded-lg text-sm transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer font-sans tracking-wide">
                                            {(sec.content as HeroSectionData).ctaText || "Click here"}
                                          </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 text-[#475467] text-xs font-sans font-medium" id="hero-badges-sys">
                                          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/80 bg-white shadow-xs">
                                            <Icons.ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Free forever
                                          </span>
                                          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/80 bg-white shadow-xs">
                                            <Icons.Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required
                                          </span>
                                        </div>
                                      </div>
                                    </section>
                                  );
                                }
                                
                                return (
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
                                          <button onClick={() => triggerCheckout("VIP All-Access Growth Tier", "$27", "/mo")} className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-xs hover:brightness-110 shadow-lg shadow-purple-900/35 transition-all cursor-pointer">
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
                                );
                              })()}

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
                                          <h4 className={`text-xs font-bold ${textHeadingClass} uppercase tracking-wider`}>{it.title}</h4>
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
                                        <h4 className={`text-xs font-bold ${textHeadingClass} uppercase tracking-wider`}>{it.title}</h4>
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
                                            <h5 className={`font-bold text-xs ${textHeadingClass}`}>{it.name}</h5>
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
                                            <h4 className={`font-bold text-sm ${textHeadingClass} uppercase tracking-wider`}>{pl.name}</h4>
                                            <p className="text-[10px] text-slate-500 mt-1">{pl.description}</p>
                                          </div>

                                          <div className="flex items-baseline gap-1" id="pricing-price-box">
                                            <span className={`text-3xl font-extrabold ${textHeadingClass}`}>{pl.price}</span>
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

                                        <button onClick={() => triggerCheckout(pl.name, pl.price, pl.period)} className={`w-full ${isSystemeTheme ? "bg-[#00a4ff] hover:bg-[#0090ff]" : "bg-gradient-to-tr from-purple-600 to-indigo-600"} py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:brightness-115 cursor-pointer mt-6`}>
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
                                        <h4 className={`text-xs font-bold ${textHeadingClass} flex items-center gap-2`}>
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
                                      <button onClick={() => triggerCheckout((sec.content as CtaUrgencyData).title || "Flash Offer Deal", "$49", "/one-time")} className="bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 px-8 rounded-xl text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer">
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

      {/* SECURE CHECKOUT SIMULATED PROCESSOR MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto" id="checkout-modal-overlay">
          <div className="bg-[#0b0c14] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col" id="checkout-modal-content">
            
            {/* Modal header/branding banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 p-6 text-white border-b border-white/[0.06] relative" id="checkout-banner">
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all bg-white/[0.05] hover:bg-white/[0.1] rounded-full p-1.5 cursor-pointer"
                title="Cancel Checkout"
              >
                <Icons.X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Icons.Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider uppercase">
                  Secure Sandbox Processor
                </span>
              </div>
              <h3 className="text-lg font-bold">Complete Your Purchase</h3>
              <p className="text-xs text-purple-300">
                Authorized Sandbox Simulation checkout matching direct landing metrics.
              </p>
            </div>

            {/* Price breakdown block */}
            <div className="bg-[#121424] px-6 py-4 border-b border-white/[0.04] flex items-center justify-between" id="checkout-plan-pill">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Selected Tier Plan</span>
                <span className="text-xs font-bold text-slate-200">{checkoutPlanName || "Growth Premium Offer"}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Billing</span>
                <span className="text-sm font-extrabold text-white">{checkoutPlanPrice || "$27"}<span className="text-[10px] text-slate-400 font-normal">{checkoutPlanPeriod || "/mo"}</span></span>
              </div>
            </div>

            {checkoutSuccess ? (
              /* Verification/Receipt success Screen */
              <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center" id="checkout-success-view">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-bounce">
                  <Icons.Check className="w-8 h-8 text-emerald-400" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Payment Authorized Successfully! 🎉</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Thank you! The sandbox simulation completed securely. This contact email status has been registered directly inside your campaign <b>Leads CRM database</b>.
                  </p>
                </div>

                <div className="bg-[#121424] border border-white/[0.04] p-4 rounded-xl w-full text-left space-y-2.5 text-xs" id="receipt-details">
                  <div className="flex justify-between text-slate-400">
                    <span>Invoice Reference</span>
                    <span className="font-mono text-slate-200">#INV-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Method</span>
                    <span className="text-slate-200 text-right capitalize">{checkoutBrand} Secure ({checkoutBrand === 'card' ? 'Visa' : checkoutBrand})</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Registered Buyer Address</span>
                    <span className="text-slate-200 font-mono text-right truncate max-w-xs">{checkoutEmail || "anonymous@sandbox.io"}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Processed Date</span>
                    <span className="text-slate-200">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs hover:brightness-110 shadow-lg shadow-purple-900/30 cursor-pointer transition-all"
                >
                  Return to Page Editor
                </button>
              </div>
            ) : (
              /* Payment Checkout form fields */
              <form onSubmit={handleSimulatedPaymentSubmit} className="p-6 space-y-5" id="checkout-form-body">
                
                {/* Email Address details section */}
                <div className="space-y-1.5" id="checkout-email-group">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="Enter your email for buyer verification"
                    className="w-full bg-[#03030a] border border-white/[0.08] focus:border-purple-500 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Tabs choosing between payment brands */}
                <div className="grid grid-cols-3 gap-2" id="checkout-payment-tabs">
                  <button
                    type="button"
                    onClick={() => setCheckoutBrand("card")}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${checkoutBrand === 'card' ? 'bg-purple-950/20 border-purple-500 text-white' : 'bg-[#03030a] border-white/[0.06] text-slate-400 hover:text-white'}`}
                  >
                    <Icons.CreditCard className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold uppercase">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutBrand("paypal");
                      setCheckoutEmail(checkoutEmail || "paypal-buyer@sandbox.io");
                      setCheckoutCardName("Paypal Express Account");
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${checkoutBrand === 'paypal' ? 'bg-purple-950/20 border-purple-500 text-white' : 'bg-[#03030a] border-white/[0.06] text-slate-400 hover:text-white'}`}
                  >
                    <Icons.Globe className="w-4 h-4 mb-1 text-blue-400" />
                    <span className="text-[9px] font-bold uppercase">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutBrand("gpay");
                      setCheckoutEmail(checkoutEmail || "gpay-buyer@sandbox.io");
                      setCheckoutCardName("Google Pay Auth User");
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${checkoutBrand === 'gpay' ? 'bg-purple-950/20 border-purple-500 text-white' : 'bg-[#03030a] border-white/[0.06] text-slate-400 hover:text-white'}`}
                  >
                    <Icons.Smartphone className="w-4 h-4 mb-1 text-emerald-400" />
                    <span className="text-[9px] font-bold uppercase">Google Pay</span>
                  </button>
                </div>

                {checkoutBrand === "card" ? (
                  /* Credit card inputs layout */
                  <div className="space-y-4" id="cc-details-group">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={checkoutCardName}
                        onChange={(e) => setCheckoutCardName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#03030a] border border-white/[0.08] focus:border-purple-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={checkoutCardNum}
                          onChange={(e) => setCheckoutCardNum(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-[#03030a] border border-white/[0.08] focus:border-purple-500 rounded-lg p-2.5 pl-9 text-xs font-mono text-slate-200 focus:outline-none"
                        />
                        <Icons.CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={checkoutCardExpiry}
                          onChange={(e) => setCheckoutCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#03030a] border border-white/[0.08] focus:border-purple-500 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={checkoutCardCVC}
                          onChange={(e) => setCheckoutCardCVC(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#03030a] border border-white/[0.08] focus:border-purple-500 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : checkoutBrand === "paypal" ? (
                  /* PayPal specific state simulation */
                  <div className="bg-[#121424]/40 border border-blue-500/10 p-5 rounded-2xl text-center space-y-3" id="paypal-sim">
                    <Icons.Globe className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-300">
                      We will redirect securely to <b>PayPal Sandbox Express Checkout</b>. No payment configuration is needed in this test playground environment.
                    </p>
                    <span className="text-[10px] text-blue-400 block font-mono">Status: Connected (Simulated)</span>
                  </div>
                ) : (
                  /* Google Pay specific simulation state */
                  <div className="bg-[#121424]/40 border border-emerald-500/10 p-5 rounded-2xl text-center space-y-3" id="gpay-sim">
                    <Icons.Smartphone className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-300">
                      Express checkout with stored browser biometric or cards with <b>Google Pay</b>. High-speed checkout active in campaign.
                    </p>
                    <span className="text-[10px] text-emerald-400 block font-mono">Status: Pay with Browser Fingerprint</span>
                  </div>
                )}

                {/* Submitting/Processing Secure Payment button */}
                <div className="pt-2" id="checkout-button-container">
                  <button
                    type="submit"
                    disabled={checkoutIsPaying}
                    className="w-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {checkoutIsPaying ? (
                      <>
                        <Icons.Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
                        Authorizing Sandbox Secure SSL Gateway...
                      </>
                    ) : (
                      <>
                        <Icons.Lock className="w-3.5 h-3.5" />
                        Authorize Secure Sandbox Payment & Register Offer
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-2.5 flex items-center justify-center gap-1">
                    🔒 SSL SECURE 256-BIT ENCRYPTION — TEST ENVIRONMENT DRAFT
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>

  </div>
  );
}
