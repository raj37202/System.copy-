export enum SectionType {
  HERO = "HERO",
  FEATURES = "FEATURES",
  BENEFITS = "BENEFITS",
  TESTIMONIALS = "TESTIMONIALS",
  PRICING = "PRICING",
  FAQ = "FAQ",
  CTA_URGENCY = "CTA_URGENCY",
  CONTACT_FORM = "CONTACT_FORM",
  FOOTER = "FOOTER",
  HEADER = "HEADER",
  AFF_REVIEW_STARS = "AFF_REVIEW_STARS",
  AFF_PRO_CON_CARD = "AFF_PRO_CON_CARD",
  AFF_VIDEO_REVIEW = "AFF_VIDEO_REVIEW",
  AFF_BONUS_GRID = "AFF_BONUS_GRID"
}

export interface ColorPalette {
  name: string;
  primaryBg: string; // e.g., bg-slate-50
  accent: string;    // e.g., purple-600
  accentGradient: string; // e.g., from-purple-600 to-blue-600
  textPrimary: string;    // e.g., text-slate-900
  textSecondary: string;  // e.g., text-slate-600
  cardBg: string;         // e.g., bg-white
  border: string;         // e.g., border-slate-200/80
}

export interface HeaderSection {
  logoName: string;
  links: { label: string; href: string }[];
  ctaText: string;
}

export interface HeroSectionData {
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSubtext: string;
  secondaryCtaText: string;
  imageUrl: string;
  featuresList?: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon string
  imageUrl?: string;
}

export interface FeaturesSectionData {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface BenefitItem {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
}

export interface BenefitsSectionData {
  title: string;
  subtitle: string;
  items: BenefitItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
  rating: number;
}

export interface TestimonialsSectionData {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string; // e.g., /mo or /one-time
  description: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

export interface PricingSectionData {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionData {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface CtaUrgencyData {
  title: string;
  subtitle: string;
  buttonText: string;
  urgencyText: string; // e.g., "Only 14 seats remaining today"
  countdownMinutes?: number;
}

export interface ContactFormData {
  title: string;
  subtitle: string;
  buttonText: string;
  inputs: { id: string; label: string; placeholder: string; type: string; required: boolean }[];
  successMessage: string;
}

export interface FooterSectionData {
  copyright: string;
  logoText: string;
  disclaimer?: string;
  simpleLinks: { label: string; href: string }[];
}

export interface AffReviewStarsData {
  title: string;
  rating: number;
  summary: string;
  pros: string[];
  cons: string[];
  buttonText: string;
  affiliateUrl: string;
}

export interface AffProConCardData {
  title: string;
  subtitle: string;
  compTitle1: string;
  compTitle2: string;
  comp1Items: string[];
  comp2Items: string[];
  buttonText: string;
  affiliateUrl: string;
}

export interface AffVideoReviewData {
  title: string;
  subtitle: string;
  videoPlaceholderText: string;
  badgeText: string;
  ctaTitle: string;
  buttonText: string;
  affiliateUrl: string;
}

export interface AffBonusGridData {
  title: string;
  subtitle: string;
  items: { id: string; title: string; description: string; valueText: string; icon: string }[];
  buttonText?: string;
  affiliateUrl?: string;
}

export interface LandingPageSection {
  id: string;
  type: SectionType;
  isVisible: boolean;
  content:
    | HeaderSection
    | HeroSectionData
    | FeaturesSectionData
    | BenefitsSectionData
    | TestimonialsSectionData
    | PricingSectionData
    | FaqSectionData
    | CtaUrgencyData
    | ContactFormData
    | FooterSectionData
    | AffReviewStarsData
    | AffProConCardData
    | AffVideoReviewData
    | AffBonusGridData;
}

export interface LandingPage {
  id: string;
  title: string;
  description: string;
  slug: string;
  sourceUrl?: string; // If cloned from a URL
  createdAt: string;
  colorPalette: ColorPalette;
  fontFamily: "sans" | "serif" | "mono";
  sections: LandingPageSection[];
  published?: boolean;
}

export interface Lead {
  id: string;
  pageId: string;
  pageTitle: string;
  email: string;
  name?: string;
  details?: Record<string, string>;
  createdAt: string;
}

export interface PageMetric {
  pageId: string;
  views: number;
  clicks: number;
  leads: number;
  conversionRate: number;
}
