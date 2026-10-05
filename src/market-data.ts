export interface Listing {
  id: string;
  name: string;
  handle: string;
  platform: string;
  niche: string;
  followers: number;
  engagement: number;
  revenue: number;
  ageMonths: number;
  price: number;
  hue: number;
  pitch: string;
  description: string;
  includes: string[];
  audience: { gender: string; top: string; age: string };
  revenueSources: string[];
  verified: boolean;
  featured: boolean;
  views: number;
  mine?: boolean;
}

/* Seed listings. Metrics are fictional demo data. */
export const SEED_LISTINGS: Listing[] = [
  {
    id: "l1", name: "Dumbbell Daily", handle: "@dumbbell.daily", platform: "Instagram", niche: "Fitness",
    followers: 184000, engagement: 5.8, revenue: 3200, ageMonths: 31, price: 38500, hue: 262,
    pitch: "Home-workout brand with a loyal, mostly 22–34 audience and a proven affiliate engine.",
    description: "Dumbbell Daily publishes short workout demos and programming tips. The brand has run steady affiliate and sponsorship income for 2+ years, and the content library is organized by muscle group so a new owner can keep posting from day one.",
    includes: ["Brand name, logo and full brand kit", "1,100+ original reels and graphics (raw files)", "Email list: 9,400 subscribers", "Domain dumbbelldaily.co", "Affiliate and sponsor contact list", "30 days of handover support"],
    audience: { gender: "58% male / 42% female", top: "US 61%, UK 14%, CA 8%", age: "25–34 (47%)" },
    revenueSources: ["Affiliate", "Sponsorships", "Digital program"], verified: true, featured: true, views: 0
  },
  {
    id: "l2", name: "Meal Prep Lab", handle: "@mealpreplab", platform: "TikTok", niche: "Food",
    followers: 412000, engagement: 7.4, revenue: 5100, ageMonths: 22, price: 62000, hue: 24,
    pitch: "Fast-growing meal-prep brand with two viral formats and a recipe archive.",
    description: "High-retention budget meal-prep videos. Two signature formats account for most views. Includes the editing templates and the full recipe database so production can continue immediately.",
    includes: ["Brand name, logo and templates", "640 recipe videos (raw + edited)", "Recipe database (Notion)", "Email list: 21,000 subscribers", "Brand-deal history and rate card", "45 days of handover support"],
    audience: { gender: "71% female / 29% male", top: "US 68%, CA 9%, AU 6%", age: "18–24 (41%)" },
    revenueSources: ["Creator fund", "Sponsorships", "Cookbook sales"], verified: true, featured: true, views: 0
  },
  {
    id: "l3", name: "Quiet Money", handle: "@quietmoney", platform: "Instagram", niche: "Finance",
    followers: 96000, engagement: 4.2, revenue: 2400, ageMonths: 40, price: 21000, hue: 152,
    pitch: "Carousel-led personal finance brand with a high-intent newsletter.",
    description: "Educational carousels on budgeting and investing basics. The audience converts well to newsletter and course offers. Compliance disclaimers and a content calendar are included.",
    includes: ["Brand name, identity and carousel templates", "800 carousel designs (Canva + PDF)", "Newsletter: 14,000 subscribers", "Domain quietmoney.io", "Compliance checklist", "30 days of handover support"],
    audience: { gender: "52% male / 48% female", top: "US 55%, UK 20%, IN 7%", age: "25–34 (52%)" },
    revenueSources: ["Newsletter sponsors", "Course", "Affiliate"], verified: true, featured: false, views: 0
  },
  {
    id: "l4", name: "Pixel Pets", handle: "@pixelpets", platform: "YouTube", niche: "Gaming",
    followers: 258000, engagement: 3.9, revenue: 4300, ageMonths: 52, price: 54000, hue: 190,
    pitch: "Cozy-game channel with a 4-year back catalogue and steady AdSense.",
    description: "A cozy and farming-sim gaming brand. Revenue is largely AdSense plus a few recurring sponsors. The back catalogue keeps earning evergreen views.",
    includes: ["Brand name, logo and channel art", "420 long-form videos and project files", "Discord server (7,800 members, admin handover)", "Sponsor contacts", "Thumbnail templates", "60 days of handover support"],
    audience: { gender: "64% female / 36% male", top: "US 44%, UK 12%, DE 7%", age: "18–24 (38%)" },
    revenueSources: ["AdSense", "Sponsorships", "Merch"], verified: true, featured: true, views: 0
  },
  {
    id: "l5", name: "Carry On Co.", handle: "@carryonco", platform: "TikTok", niche: "Travel",
    followers: 143000, engagement: 6.1, revenue: 1500, ageMonths: 14, price: 14500, hue: 210,
    pitch: "Budget travel hacks brand, strong saves and shares.",
    description: "Packing tips, airline hacks and city guides in short vertical video. Younger brand with excellent engagement and room to monetize more heavily.",
    includes: ["Brand name and logo", "310 short videos (raw)", "City-guide spreadsheet library", "Email list: 3,200", "20 days of handover support"],
    audience: { gender: "60% female / 40% male", top: "US 49%, UK 17%, AU 9%", age: "18–24 (44%)" },
    revenueSources: ["Affiliate", "Creator fund"], verified: false, featured: false, views: 0
  },
  {
    id: "l6", name: "Stitch & Sole", handle: "@stitchandsole", platform: "Instagram", niche: "Fashion",
    followers: 71000, engagement: 6.9, revenue: 1900, ageMonths: 27, price: 16500, hue: 330,
    pitch: "Thrift-flip and styling brand with a shoppable audience.",
    description: "Styling reels and thrift hauls with a highly engaged, mostly female audience. Existing relationships with resale platforms and two clothing brands.",
    includes: ["Brand name, logo and presets", "520 reels and photos", "Lightroom preset pack (sold, 1,900 units)", "Email list: 5,100", "Brand contacts", "30 days of handover support"],
    audience: { gender: "88% female / 12% male", top: "US 58%, UK 18%, CA 7%", age: "18–24 (46%)" },
    revenueSources: ["Preset sales", "Affiliate", "Sponsorships"], verified: true, featured: false, views: 0
  },
  {
    id: "l7", name: "Founder Notes", handle: "@foundernotes", platform: "X", niche: "Business",
    followers: 126000, engagement: 2.7, revenue: 6800, ageMonths: 36, price: 89000, hue: 245,
    pitch: "Startup-advice brand with a premium newsletter and sponsor waitlist.",
    description: "Threads and short-form posts on building startups. The newsletter is the monetization engine, with sponsor slots sold out months ahead.",
    includes: ["Brand name, logo and voice guide", "1,500 posts and 90 long threads", "Newsletter: 32,000 subscribers", "Domain foundernotes.com", "Sponsor roster and rate card", "90 days of handover support"],
    audience: { gender: "69% male / 31% female", top: "US 52%, UK 11%, IN 9%", age: "25–34 (49%)" },
    revenueSources: ["Newsletter sponsors", "Paid tier", "Consulting leads"], verified: true, featured: true, views: 0
  },
  {
    id: "l8", name: "Skin Simple", handle: "@skinsimple", platform: "Instagram", niche: "Beauty",
    followers: 205000, engagement: 4.8, revenue: 2800, ageMonths: 19, price: 29500, hue: 345,
    pitch: "Minimalist skincare education brand, brand-safe and affiliate-rich.",
    description: "Ingredient breakdowns and routine guides. Brand-safe, with consistent affiliate income and relationships with several indie skincare labels.",
    includes: ["Brand name, identity and templates", "700 reels and carousels", "Ingredient database", "Email list: 8,800", "Brand contacts", "30 days of handover support"],
    audience: { gender: "91% female / 9% male", top: "US 47%, UK 15%, AU 8%", age: "25–34 (43%)" },
    revenueSources: ["Affiliate", "Sponsorships"], verified: false, featured: false, views: 0
  },
  {
    id: "l9", name: "Code in 60", handle: "@codein60", platform: "YouTube", niche: "Tech",
    followers: 88000, engagement: 5.2, revenue: 1700, ageMonths: 18, price: 17000, hue: 220,
    pitch: "60-second programming tutorials with strong Shorts reach.",
    description: "Bite-size tutorials for beginner developers. Shorts drive discovery; a small course and affiliate links monetize it.",
    includes: ["Brand name and logo", "380 Shorts and 40 long videos", "Course (self-paced, 600 students)", "Email list: 4,400", "25 days of handover support"],
    audience: { gender: "76% male / 24% female", top: "US 31%, IN 24%, UK 8%", age: "18–24 (50%)" },
    revenueSources: ["Course", "Affiliate", "AdSense"], verified: true, featured: false, views: 0
  },
  {
    id: "l10", name: "Paws & Plot", handle: "@pawsandplot", platform: "TikTok", niche: "Pets",
    followers: 530000, engagement: 8.3, revenue: 3900, ageMonths: 26, price: 47000, hue: 36,
    pitch: "Funny pet storytelling with huge reach and clear sponsor demand.",
    description: "Story-driven pet content with unusually high share rates. Inbound sponsor requests arrive weekly, and a merch line is already set up.",
    includes: ["Brand name, characters and logo", "900 videos (raw)", "Merch store (Shopify) and supplier contacts", "Sponsor inbox history", "Email list: 6,000", "60 days of handover support"],
    audience: { gender: "66% female / 34% male", top: "US 63%, UK 10%, CA 7%", age: "18–24 (39%)" },
    revenueSources: ["Sponsorships", "Merch", "Creator fund"], verified: true, featured: true, views: 0
  },
  {
    id: "l11", name: "Plant Parent HQ", handle: "@plantparenthq", platform: "Instagram", niche: "Lifestyle",
    followers: 52000, engagement: 7.6, revenue: 800, ageMonths: 11, price: 6800, hue: 128,
    pitch: "Houseplant care brand: small, engaged, easy to grow.",
    description: "Plant care guides and styling. A young brand with an engaged niche audience and a clean content system.",
    includes: ["Brand name and logo", "260 reels and carousels", "Care-guide library", "Email list: 1,700", "15 days of handover support"],
    audience: { gender: "79% female / 21% male", top: "US 54%, UK 19%, CA 9%", age: "25–34 (45%)" },
    revenueSources: ["Affiliate"], verified: false, featured: false, views: 0
  },
  {
    id: "l12", name: "Drive Theory", handle: "@drivetheory", platform: "YouTube", niche: "Cars",
    followers: 310000, engagement: 3.4, revenue: 7400, ageMonths: 61, price: 118000, hue: 8,
    pitch: "Five-year car-review channel with premium sponsors and a deep archive.",
    description: "Long-form car reviews and buying guides. Evergreen search traffic and automotive sponsors produce reliable monthly revenue.",
    includes: ["Brand name, logo and channel identity", "560 videos and project files", "Sponsor contracts (transferable)", "Email list: 11,000", "Domain drivetheory.com", "90 days of handover support"],
    audience: { gender: "88% male / 12% female", top: "US 49%, UK 13%, CA 8%", age: "35–44 (36%)" },
    revenueSources: ["AdSense", "Sponsorships", "Affiliate"], verified: true, featured: false, views: 0
  }
];

export const FAQS: [string, string][] = [
  ["Do you sell Instagram or TikTok accounts?", "No. This marketplace sells the brand behind a page: the name, identity, content library, email list, domain, contacts and a documented plan to move the audience. Account logins are never sold or transferred through the platform, because that breaks the terms of Instagram, TikTok, YouTube and X."],
  ["How does the audience move over?", "Each listing states a handover method. The common ones are a coordinated announcement and migration to a new page run by the buyer, or an official platform tool such as a Business Manager or Brand Account admin change where the platform allows it. The seller supports the migration for the period listed."],
  ["How does escrow work?", "The buyer pays us, not the seller. Funds stay in escrow until the assets are delivered and the buyer confirms them, or until the inspection window ends with no dispute. Then the seller is paid, less our fee."],
  ["What does it cost?", "Listing is free. We charge the seller 8% of the sale price (6% above $50,000), taken from escrow on release. Buyers pay no fee."],
  ["How are listings verified?", "Verified listings have passed a check that the seller controls the page, that follower and revenue claims match platform analytics and payout statements, and that the content is original. Unverified listings show a clear badge and should be checked more carefully."],
  ["What is not allowed?", "Hacked or stolen pages, impersonation, trademark infringement, bought followers or engagement presented as real, and anything that moves personal data without a lawful basis."],
  ["What if the deal goes wrong?", "Raise a dispute during the inspection window. Funds stay frozen while we review the delivery log and evidence from both sides, and we refund or release accordingly."]
];
