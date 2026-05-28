import { LandingPage, SectionType } from "../types";

// Helper color palettes to keep things consistent and beautiful
export const COLOR_PALETTES = [
  {
    name: "SaaS Cosmic Purple",
    primaryBg: "bg-slate-950",
    accent: "purple-600",
    accentGradient: "from-violet-600 to-indigo-600",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    cardBg: "bg-slate-900/60",
    border: "border-slate-800/80"
  },
  {
    name: "Light Minimalist Blue",
    primaryBg: "bg-slate-50",
    accent: "blue-600",
    accentGradient: "from-blue-600 to-cyan-500",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-600",
    cardBg: "bg-white",
    border: "border-slate-200/80"
  },
  {
    name: "Affiliate High Contrast Gold",
    primaryBg: "bg-zinc-950",
    accent: "yellow-500",
    accentGradient: "from-amber-500 to-yellow-400",
    textPrimary: "text-zinc-50",
    textSecondary: "text-zinc-400",
    cardBg: "bg-zinc-900/80",
    border: "border-zinc-800"
  },
  {
    name: "Systeme.io Electric Blue",
    primaryBg: "bg-white",
    accent: "blue-500",
    accentGradient: "from-[#00a4ff] to-[#0090ff]",
    textPrimary: "text-[#1d2939]",
    textSecondary: "text-[#475467]",
    cardBg: "bg-white",
    border: "border-slate-200"
  },
  {
    name: "Warm Editorial Teal",
    primaryBg: "bg-stone-50",
    accent: "emerald-700",
    accentGradient: "from-emerald-700 to-teal-600",
    textPrimary: "text-stone-900",
    textSecondary: "text-stone-600",
    cardBg: "bg-white",
    border: "border-stone-200"
  }
];

export const TEMPLATES: LandingPage[] = [
  {
    id: "temp-saas",
    title: "SaaS Product High-Convert",
    description: "Sleek glassmorphic template optimized for tech software and early-stage SaaS conversions.",
    slug: "saas-launch",
    createdAt: new Date().toISOString(),
    colorPalette: COLOR_PALETTES[0], // Dark cosmic
    fontFamily: "sans",
    sections: [
      {
        id: "sec-header",
        type: SectionType.HEADER,
        isVisible: true,
        content: {
          logoName: "ApexFlowai",
          links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" }
          ],
          ctaText: "Start Free Today"
        }
      },
      {
        id: "sec-hero",
        type: SectionType.HERO,
        isVisible: true,
        content: {
          badge: "✨ Version 2.0 Live",
          headline: "Maximize Your SaaS Leads With Autonomous Landing Pages",
          subheadline: "Stop burning ad spend with static websites. Let our AI system continuously rewrite copy, generate CTAs, and convert modern visitors in real-time.",
          ctaText: "Generate My First Page",
          ctaSubtext: "No credit card required. Setup in 60 seconds.",
          secondaryCtaText: "Request Demo",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          featuresList: ["Instant AI-Optimization", "99.8% Serverless Uptime", "Zero Coding Knowledge Needed"]
        }
      },
      {
        id: "sec-features",
        type: SectionType.FEATURES,
        isVisible: true,
        content: {
          title: "Engineered For High-Converting Teams",
          subtitle: "We replace ClickFunnels, Leadpages, and complex builders with absolute simplicity.",
          items: [
            {
              id: "feat1",
              title: "AI Website Cloner",
              description: "Paste any link to instantly convert it into a fully responsive, customized layout aligned to your startup brand.",
              icon: "Zap"
            },
            {
              id: "feat2",
              title: "AI Interactive Editor",
              description: "Simply click any segment, edit the headline, and see immediate previews in mobile and tablet containers.",
              icon: "Layers"
            },
            {
              id: "feat3",
              title: "One-Click Instant Hosting",
              description: "Publish your campaign to the web with high-performance global CDN hosting in literally one click.",
              icon: "Globe"
            }
          ]
        }
      },
      {
        id: "sec-cta-urgency",
        type: SectionType.CTA_URGENCY,
        isVisible: true,
        content: {
          title: "Secure Your Early-Adopter Lifetime Price",
          subtitle: "Join over 1,420 marketing agencies and direct response brands driving 4x conversions this month.",
          buttonText: "Claim AI Lifetime Access",
          urgencyText: "Special offer expires in 15 minutes! Price increases by $100."
        }
      },
      {
        id: "sec-pricing",
        type: SectionType.PRICING,
        isVisible: true,
        content: {
          title: "Simple, Honest Pricing For Big Thinkers",
          subtitle: "No long-term contracts. Pause or cancel your subscription at any moment.",
          plans: [
            {
              id: "plan1",
              name: "Solo Marketer",
              price: "$29",
              period: "/mo",
              description: "Perfect for single campaigns, affiliates, and digital product sellers.",
              features: [
                "3 Active Landing Pages",
                "Unlimited Leads Generated",
                "Basic AI Copywriter (50 runs/mo)",
                "Standard Web Hosting",
                "SSL Certification Included"
              ],
              buttonText: "Go Solo",
              isPopular: false
            },
            {
              id: "plan2",
              name: "Scale AI Pro",
              price: "$79",
              period: "/mo",
              description: "Our most requested tier for growing brands requiring continuous AI optimization.",
              features: [
                "Unlimited Active Pages",
                "Complete AI Cloner & Scraper",
                "Unlimited AI Writing & Rewrites",
                "Custom Domains Setup",
                "Realtime Analytics Integration",
                "24/7 Priority Support"
              ],
              buttonText: "Start Scaling Pro",
              isPopular: true
            }
          ]
        }
      },
      {
        id: "sec-faq",
        type: SectionType.FAQ,
        isVisible: true,
        content: {
          title: "Frequently Asked Questions",
          subtitle: "A clear answers to all your design questions.",
          items: [
            {
              id: "faq1",
              question: "Will the generated page look exactly like the original URL?",
              answer: "No, we do not make exact pixel-for-pixel stolen copies. Instead, our AI analyzes the core blocks, pricing, copy triggers, and headings to generate a much cleaner, modernized layout optimized for immediate conversions."
            },
            {
              id: "faq2",
              question: "Do I need to sign up for external web hosting?",
              answer: "Absolutely not. Every single page built inside our builder includes instant hosting on our lightning-fast global edge CDN, setup for you automatically in one touch."
            },
            {
              id: "faq3",
              question: "Can I collect leads dynamically?",
              answer: "Yes, our Contact Form and CTA sections automatically collect and log user submissions directly to your Analytics Dashboard, exportable instantly as a CSV."
            }
          ]
        }
      },
      {
        id: "sec-footer",
        type: SectionType.FOOTER,
        isVisible: true,
        content: {
          copyright: `© ${new Date().getFullYear()} ApexFlow. All rights reserved.`,
          logoText: "ApexFlowai",
          disclaimer: "Disclaimer: This landing page generator is an AI tool. Use of similar structures of existing websites is meant purely as architectural design inspiration.",
          simpleLinks: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Support Desk", href: "#" }
          ]
        }
      }
    ]
  },
  {
    id: "temp-affiliate",
    title: "Affiliate High-Converting Optin",
    description: "Designed for affiliate marketers driving rapid traffic from TikTok, YouTube, or Google Ads.",
    slug: "bonus-offer",
    createdAt: new Date().toISOString(),
    colorPalette: COLOR_PALETTES[2], // Dark zinc gold
    fontFamily: "mono",
    sections: [
      {
        id: "sec-hero-affiliate",
        type: SectionType.HERO,
        isVisible: true,
        content: {
          badge: "🔥 FREE TRAINING BLUEPRINT",
          headline: "The 3-Step System To Build $10,000/Month Passive Income Campaign",
          subheadline: "No website. No prior experience. Grab our high-converting landing page framework and start generating automated commissions tonight.",
          ctaText: "Download Free Blueprint Now",
          ctaSubtext: "Instant PDF Access + 60-Minute Video Masterclass",
          secondaryCtaText: "Watch Video",
          imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
          featuresList: ["100% Free Workbook Included", "Copy & Paste Email Scripts", "Live Campaign Case-Study"]
        }
      },
      {
        id: "sec-benefits",
        type: SectionType.BENEFITS,
        isVisible: true,
        content: {
          title: "What You Will Discover Inside This Automated Guide",
          subtitle: "Skip 12 months of painful trial-and-error. Accelerate your results with clear milestones.",
          items: [
            {
              id: "ben1",
              title: "Proven Traffic Sources",
              value: "Step 1",
              description: "How to drive qualified attention from scratch without spending a single dollar on initial advertisements.",
              icon: "Activity"
            },
            {
              id: "ben2",
              title: "The Golden Conversion Rate",
              value: "Step 2",
              description: "Copy and paste our high-converting opt-in structure designed to collect name & emails continuously.",
              icon: "TrendingUp"
            },
            {
              id: "ben3",
              title: "Premium Monetization",
              value: "Step 3",
              description: "Selecting high-ticket digital product networks that pay up to 75% lifetime recurring commissions.",
              icon: "DollarSign"
            }
          ]
        }
      },
      {
        id: "sec-testimonials",
        type: SectionType.TESTIMONIALS,
        isVisible: true,
        content: {
          title: "Real Affiliates. Real Automated Results.",
          subtitle: "Listen to other everyday digital marketers who made their first sale within days.",
          items: [
            {
              id: "test1",
              name: "Marcus Vance",
              role: "Freelance Hustler",
              avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
              quote: "I pasted a complex coaching page and cloned a cleaner layout in 10 seconds. Added my affiliate link and drove 48 opt-ins on my first day!",
              rating: 5
            },
            {
              id: "test2",
              name: "Chelsea Kim",
              role: "Ecom Affiliate",
              avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
              quote: "The copywriting rewrite feature is a life-saver. I transformed dull technical text into dynamic conversational bullet points that sell instantly.",
              rating: 5
            }
          ]
        }
      },
      {
        id: "sec-contact",
        type: SectionType.CONTACT_FORM,
        isVisible: true,
        content: {
          title: "Enter Your Email To Unlock Immediate VIP Access",
          subtitle: "We'll send the PDF blueprint and training link straight to your inbox.",
          buttonText: "Send Me The Guide",
          inputs: [
            { id: "lead-name", label: "Full Name", placeholder: "e.g., Alex Carter", type: "text", required: true },
            { id: "lead-email", label: "Best Email Address", placeholder: "e.g., alex@domain.com", type: "email", required: true }
          ],
          successMessage: "Submission success! Your blueprint and training invite are on their way to your inbox."
        }
      },
      {
        id: "sec-footer-affiliate",
        type: SectionType.FOOTER,
        isVisible: true,
        content: {
          copyright: `Copyright © ${new Date().getFullYear()} AffiliateMastery. All rights reserved.`,
          logoText: "AffiliateMastery",
          disclaimer: "Income Disclaimer: Results represent individual outcomes. Success requires active application, continuous effort, and marketing diligence.",
          simpleLinks: [
            { label: "Privacy Core", href: "#" },
            { label: "Earning Disclaimers", href: "#" }
          ]
        }
      }
    ]
  },
  {
    id: "temp-systeme",
    title: "Systeme.io Electric Funnel",
    description: "Centred high-converting course capture landing page mimicking Systeme.io's clean display signature.",
    slug: "systeme-courses",
    createdAt: new Date().toISOString(),
    colorPalette: {
      name: "Systeme.io Electric Blue",
      primaryBg: "bg-white",
      accent: "blue-500",
      accentGradient: "from-[#00a4ff] to-[#0090ff]",
      textPrimary: "text-[#1d2939]",
      textSecondary: "text-[#475467]",
      cardBg: "bg-white",
      border: "border-slate-200"
    },
    fontFamily: "sans",
    sections: [
      {
        id: "sec-header-sys",
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
        id: "sec-hero-sys",
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
        id: "sec-features-sys",
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
        id: "sec-pricing-sys",
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
        id: "sec-faq-sys",
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
        id: "sec-footer-sys",
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
    ]
  }
];
