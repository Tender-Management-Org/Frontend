/**
 * Landing page 2 — all marketing copy and demo product data lives here so the
 * section components stay purely presentational.
 *
 * Every tender example below is representative sample data used for product
 * illustration only.
 */

export type FitBreakdown = { label: string; value: number };

export type DemoTender = {
  id: string;
  title: string;
  department: string;
  location: string;
  value: string;
  emd: string;
  fee: string;
  closing: string;
  fit: number;
  fitLabel: string;
  eligibility: string;
  source: string;
  status?: "Matched" | "Interested" | "Applied" | "Won";
};

/* ── Hero product composition ─────────────────────────────────────────────── */

export const HERO_TENDERS: DemoTender[] = [
  {
    id: "RJ/PWD/2026/RD-4471",
    title: "Construction of Rural Road — Jaipur",
    department: "PWD, Government of Rajasthan",
    location: "Jaipur, Rajasthan",
    value: "₹2.4 Cr",
    emd: "₹4,50,000",
    fee: "₹5,000",
    closing: "18 Aug",
    fit: 94,
    fitLabel: "Excellent Match",
    eligibility: "8/9 criteria matched",
    source: "Rajasthan e-Proc",
  },
  {
    id: "RJ/RUIDP/2026/WS-0912",
    title: "Water Supply Augmentation Scheme — Jodhpur",
    department: "RUIDP, Urban Development",
    location: "Jodhpur, Rajasthan",
    value: "₹5.8 Cr",
    emd: "₹11,60,000",
    fee: "₹10,000",
    closing: "26 Aug",
    fit: 88,
    fitLabel: "Strong Match",
    eligibility: "7/9 criteria matched",
    source: "Rajasthan e-Proc",
  },
  {
    id: "GEM/2026/B/6620144",
    title: "Supply & Installation of Solar Rooftop — Kota",
    department: "Renewable Energy Corporation",
    location: "Kota, Rajasthan",
    value: "₹48 Lakh",
    emd: "₹96,000",
    fee: "₹2,000",
    closing: "09 Sep",
    fit: 81,
    fitLabel: "Good Match",
    eligibility: "6/9 criteria matched",
    source: "GeM",
  },
  {
    id: "RJ/DOIT/2026/IT-2210",
    title: "IT Infrastructure Upgrade — Udaipur Collectorate",
    department: "Dept. of IT & Communication",
    location: "Udaipur, Rajasthan",
    value: "₹1.2 Cr",
    emd: "₹2,40,000",
    fee: "₹5,000",
    closing: "02 Sep",
    fit: 76,
    fitLabel: "Worth Reviewing",
    eligibility: "6/9 criteria matched",
    source: "Rajasthan e-Proc",
  },
];

/**
 * The raw, unranked feed the hero starts on — what a bid team actually sees on
 * the portals before any of this exists. Deliberately mixed relevance and no
 * Fit Scores, so the recommendations panel that replaces it reads as a result.
 */
export const RAW_FEED = [
  { title: "Rural road package — Alwar", meta: "PWD, Rajasthan", value: "₹1.9 Cr" },
  { title: "Hospital linen procurement", meta: "Medical & Health Dept.", value: "₹14 Lakh" },
  { title: "Streetlight LED retrofit — Ajmer", meta: "Municipal Corporation", value: "₹36 Lakh" },
  { title: "Stationery rate contract", meta: "Secretariat", value: "₹6 Lakh" },
  { title: "Borewell drilling — Bikaner", meta: "PHED", value: "₹22 Lakh" },
  { title: "Data centre AMC — Jaipur", meta: "RISL", value: "₹38 Lakh" },
  { title: "Canal desilting works — Kota", meta: "Water Resources Dept.", value: "₹54 Lakh" },
];

/** Short labels used for the "thousands of tenders" flood animation. */
export const FLOOD_TITLES = [
  "Rural road package — Alwar",
  "Borewell drilling — Bikaner",
  "School furniture supply",
  "Hospital linen procurement",
  "Streetlight LED retrofit",
  "Canal desilting works",
  "Fire tender procurement",
  "Data centre AMC",
  "Solar pump installation",
  "Bridge repair — Bhilwara",
  "Stationery rate contract",
  "Ambulance hiring — Ajmer",
  "Sewer line laying — Kota",
  "CCTV surveillance rollout",
  "Boundary wall construction",
  "Laboratory equipment supply",
  "Housekeeping services",
  "Transformer procurement",
  "Drinking water pipeline",
  "Road resurfacing — Sikar",
  "ERP implementation",
  "Rooftop solar — Pali",
  "Cold storage civil works",
  "Network switches supply",
  "Bituminous road overlay",
  "Sports complex flooring",
  "Rainwater harvesting units",
  "Fibre optic laying",
];

/* ── Section 3 — the problem ──────────────────────────────────────────────── */

export const OLD_WORKFLOW = [
  "Open government portal",
  "Search by keyword",
  "Solve the CAPTCHA",
  "Open a tender",
  "Download the PDF",
  "Read 100+ pages",
  "Check eligibility by hand",
  "Repeat again tomorrow",
];

/* ── Section 4 — Fit Score ────────────────────────────────────────────────── */

export const PROFILE_SIGNALS = [
  "Industry",
  "Sector",
  "Scope of Work",
  "Location",
  "Financial Profile",
  "Past Projects",
  "Business Capabilities",
];

export const FIT_BREAKDOWN: FitBreakdown[] = [
  { label: "Business Capability", value: 96 },
  { label: "Geography", value: 92 },
  { label: "Project Relevance", value: 95 },
  { label: "Financial Fit", value: 89 },
];

/* ── Section 6 — Document Intelligence ────────────────────────────────────── */

export type ExtractedGroup = {
  title: string;
  items: { label: string; value?: string; state: "ok" | "warn" }[];
};

export const EXTRACTED: ExtractedGroup[] = [
  {
    title: "Eligibility",
    items: [
      { label: "Minimum turnover requirement", state: "ok" },
      { label: "Relevant project experience", state: "ok" },
      { label: "Solvency certificate required", state: "warn" },
    ],
  },
  {
    title: "Required Documents",
    items: [
      { label: "Incorporation Certificate", state: "ok" },
      { label: "GST Registration", state: "ok" },
      { label: "PAN", state: "ok" },
      { label: "Latest Solvency Certificate", state: "warn" },
    ],
  },
  {
    title: "Submission Requirements",
    items: [
      { label: "EMD", value: "₹4,50,000", state: "ok" },
      { label: "Tender Fee", value: "₹5,000", state: "ok" },
      { label: "Closing Date", value: "18 Aug, 6:00 PM", state: "ok" },
    ],
  },
];

export const REPOSITORY_MATCHES = [
  { requirement: "Incorporation Certificate", result: "Document Found", state: "ok" as const },
  { requirement: "GST Registration", result: "Document Found", state: "ok" as const },
  { requirement: "PAN", result: "Document Found", state: "ok" as const },
  { requirement: "Solvency Certificate", result: "Missing", state: "warn" as const },
];

/** Fake document body lines for the 146-page tender preview. */
export const DOC_LINES: { text: string; highlight?: boolean }[] = [
  { text: "SECTION III — INSTRUCTIONS TO BIDDERS" },
  { text: "3.1  The bidder shall have an average annual financial turnover of" },
  { text: "     not less than ₹90,00,000 during the last three financial years.", highlight: true },
  { text: "3.2  Bids shall be submitted online through the e-procurement portal" },
  { text: "     on or before the date and time stipulated in the notice." },
  { text: "3.3  The bidder must have satisfactorily completed at least one similar" },
  { text: "     work of value not less than ₹96,00,000 in the last seven years.", highlight: true },
  { text: "3.4  Earnest Money Deposit of ₹4,50,000 shall be furnished in the form", highlight: true },
  { text: "     of a demand draft or online payment against the tender reference." },
  { text: "3.5  Tender processing fee of ₹5,000 is non-refundable." },
  { text: "3.6  A solvency certificate issued within the preceding twelve months", highlight: true },
  { text: "     by a scheduled bank shall be uploaded with the technical bid." },
  { text: "3.7  Conditional bids are liable to be summarily rejected." },
  { text: "3.8  The bid shall remain valid for 120 days from the date of opening." },
  { text: "SECTION IV — QUALIFICATION CRITERIA" },
  { text: "4.1  Registration with the appropriate authority in Class AA or above." },
  { text: "4.2  Valid GST registration and PAN issued in the name of the bidder.", highlight: true },
  { text: "4.3  Certificate of incorporation or partnership deed, as applicable." },
];

/* ── Section 7 — workspace ────────────────────────────────────────────────── */

export const PIPELINE_STAGES = ["Matched", "Interested", "Applied", "Won"] as const;

export const DASHBOARD_WIDGETS = [
  { label: "AI Recommendations", value: 24, tone: "elec" as const },
  { label: "Closing This Week", value: 7, tone: "amber" as const },
  { label: "Awaiting Decision", value: 5, tone: "violet" as const },
  { label: "Bids Submitted", value: 12, tone: "ink" as const },
  { label: "Won", value: 4, tone: "green" as const },
];

/* ── Section 8 — semantic search ──────────────────────────────────────────── */

export const SEARCH_SCENES = [
  {
    query: "Road construction tenders in Rajasthan above ₹50 lakh",
    results: [
      { title: "Construction of Rural Road — Jaipur", meta: "PWD Rajasthan · ₹2.4 Cr · 18 Aug", fit: 94 },
      { title: "Bituminous Road Overlay — Sikar", meta: "PWD Rajasthan · ₹1.7 Cr · 24 Aug", fit: 89 },
      { title: "Approach Road & Culvert Works — Bhilwara", meta: "RSRDC · ₹82 Lakh · 30 Aug", fit: 84 },
    ],
  },
  {
    query: "IT infrastructure projects closing this month",
    results: [
      { title: "IT Infrastructure Upgrade — Udaipur Collectorate", meta: "DoIT&C · ₹1.2 Cr · 02 Sep", fit: 91 },
      { title: "Network Switches & Structured Cabling — Kota", meta: "RISL · ₹64 Lakh · 29 Aug", fit: 86 },
      { title: "Data Centre AMC — Jaipur", meta: "RISL · ₹38 Lakh · 27 Aug", fit: 79 },
    ],
  },
];

/* ── Section 9 — bento features ───────────────────────────────────────────── */

export const FEATURES = [
  {
    key: "discovery",
    title: "Automated Tender Discovery",
    body: "New opportunities discovered continuously from procurement portals.",
  },
  { key: "fit", title: "AI Fit Score", body: "See how closely every opportunity matches your business." },
  {
    key: "docs",
    title: "Document Intelligence",
    body: "Extract eligibility, documents and submission requirements automatically.",
  },
  {
    key: "eligibility",
    title: "Eligibility Analysis",
    body: "Know what you qualify for before your team spends hours reviewing a tender.",
  },
  { key: "dashboard", title: "Smart Dashboard", body: "Focus immediately on opportunities that require attention." },
  { key: "pipeline", title: "Tender Pipeline", body: "Manage opportunities from Matched to Won." },
  { key: "firm", title: "Firm Profile", body: "Your company profile powers increasingly accurate recommendations." },
  { key: "search", title: "Semantic Search", body: "Search opportunities using natural language." },
] as const;

/* ── Section 10 — before vs after ─────────────────────────────────────────── */

export const COMPARISONS = [
  { before: "Manual searching every day", after: "Automated continuous discovery" },
  { before: "Keyword search", after: "AI semantic matching" },
  { before: "Same tenders for everyone", after: "Personalized Fit Scores" },
  { before: "Manual document review", after: "AI Document Intelligence" },
  { before: "Manually check eligibility", after: "Automatic eligibility assessment" },
  { before: "Search folders for documents", after: "Automatic document readiness" },
  { before: "Spreadsheet tracking", after: "Complete tender pipeline" },
  { before: "One procurement portal", after: "Multiple sources, one workspace" },
];

/* ── Section 11 — outcome ─────────────────────────────────────────────────── */

export const VALUE_CARDS = [
  { title: "Discover Faster", body: "Relevant tenders automatically reach your team." },
  { title: "Decide Faster", body: "Know the Fit Score, eligibility and document readiness immediately." },
  { title: "Bid Smarter", body: "Focus effort on opportunities your company can realistically pursue." },
];

/* ── Section 12 — audiences ───────────────────────────────────────────────── */

export const AUDIENCES = [
  {
    key: "civil",
    title: "Civil Contractors",
    body: "Road, building and municipal works across state and central portals.",
  },
  {
    key: "infra",
    title: "Infrastructure Companies",
    body: "Large packages in water, power, transport and urban development.",
  },
  {
    key: "it",
    title: "IT & Technology Firms",
    body: "Systems, networks, software and managed services contracts.",
  },
  {
    key: "supply",
    title: "Suppliers & Manufacturers",
    body: "Rate contracts, equipment procurement and GeM catalogue bids.",
  },
] as const;

/* ── Browse directory ─────────────────────────────────────────────────────── */

/**
 * The public browse pages. Each deep link lands on the tender dashboard with the
 * filter already applied, so a signed-in visitor arrives at results rather than
 * at an empty search box.
 */
export const BROWSE_GROUPS = [
  {
    key: "state",
    title: "Browse by State",
    body: "Government procurement across all 37 states and Union Territories.",
    href: "/browse/states",
    cta: "All 37 states",
    popular: [
      { label: "Rajasthan", href: "/tenders?location=Rajasthan" },
      { label: "Maharashtra", href: "/tenders?location=Maharashtra" },
      { label: "Gujarat", href: "/tenders?location=Gujarat" },
      { label: "Karnataka", href: "/tenders?location=Karnataka" },
      { label: "Delhi", href: "/tenders?location=Delhi" },
      { label: "Uttar Pradesh", href: "/tenders?location=Uttar%20Pradesh" },
    ],
  },
  {
    key: "category",
    title: "Browse by Category",
    body: "Sixteen popular categories, from solar and railways to healthcare.",
    href: "/browse/categories",
    cta: "16 categories",
    popular: [
      { label: "Solar", href: "/tenders?search=solar%20energy%20rooftop%20solar" },
      { label: "Railways", href: "/tenders?search=railway%20metro%20rail" },
      { label: "IT", href: "/tenders?search=information%20technology%20software" },
      { label: "Construction", href: "/tenders?search=construction%20civil%20works" },
      { label: "Water", href: "/tenders?search=water%20supply%20sanitation" },
      { label: "Healthcare", href: "/tenders?search=medical%20healthcare%20hospital" },
    ],
  },
  {
    key: "sector",
    title: "Browse by Sector",
    body: "Every industry we track — agriculture through telecom, A to Z.",
    href: "/browse/sectors",
    cta: "60+ sectors",
    popular: [
      { label: "Roads & Highways", href: "/tenders?search=roads%20and%20highways" },
      { label: "Power", href: "/tenders?search=power%20and%20electricity" },
      { label: "Defence", href: "/tenders?search=defence%20and%20military" },
      { label: "Irrigation", href: "/tenders?search=irrigation%20and%20water%20resources" },
      { label: "Smart City", href: "/tenders?search=smart%20city%20projects" },
      { label: "Telecom", href: "/tenders?search=telecom%20and%20networking" },
    ],
  },
] as const;

/* ── Navigation ───────────────────────────────────────────────────────────── */

export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Businesses", href: "#for-businesses" },
  { label: "FAQ", href: "#faq" },
];

/** Shown in the nav's Browse menu and in the footer. */
export const BROWSE_LINKS = [
  { label: "By State", href: "/browse/states", hint: "37 states & UTs" },
  { label: "By Category", href: "/browse/categories", hint: "16 categories" },
  { label: "By Sector", href: "/browse/sectors", hint: "60+ sectors" },
];

export const FAQS = [
  {
    q: "Where do the tenders come from?",
    a: "tenderkhoj continuously monitors government e-procurement portals and aggregates live opportunities into a single workspace, so your team stops checking portals one by one.",
  },
  {
    q: "How is the Fit Score calculated?",
    a: "Every recommendation receives a personalized Fit Score from 0–100. It combines semantic relevance between the tender scope and your firm's capabilities with geography, project history and financial profile — then adapts as your team marks opportunities interested or not relevant.",
  },
  {
    q: "What does Document Intelligence actually extract?",
    a: "Eligibility criteria, required documents and submission requirements such as EMD, tender fee and closing date — pulled straight out of the tender document and compared against your firm profile and document repository.",
  },
  {
    q: "Do I need to change how my team works?",
    a: "No. Opportunities move through a simple pipeline — Matched, Interested, Applied, Won — that mirrors how bid teams already track work, replacing the spreadsheet rather than adding another tool on top of it.",
  },
];
