// Deterministic, seeded "AI-generated" positive review generator.
// Same input (id + name) always produces the same set of reviews, so the page
// is stable across reloads and SEO-friendly, while different products/tools
// get different reviewers, ratings, and copy.

export interface GeneratedReview {
  id: string;
  author_name: string;
  rating: number; // 4 or 5 (positive bias)
  title: string;
  body: string;
  language: 'en' | 'hinglish';
  city: string;
  verified_buyer: boolean;
  created_at: string; // ISO
  helpful_count: number;
}

// Cheap deterministic hash → seeded PRNG
const hash = (s: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Arjun', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Pooja',
  'Aditya', 'Neha', 'Rohan', 'Shreya', 'Aniket', 'Divya', 'Manish', 'Riya',
  'Siddharth', 'Megha', 'Amit', 'Kavya', 'Nikhil', 'Ishita', 'Varun', 'Tanya',
  'Harsh', 'Ayesha', 'Dev', 'Simran', 'Yash', 'Aarti',
];
const LAST_INITIALS = ['S.', 'K.', 'M.', 'P.', 'R.', 'V.', 'J.', 'B.', 'G.', 'T.', 'C.', 'N.'];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Chandigarh', 'Surat', 'Noida',
  'Gurugram', 'Kochi', 'Bhopal', 'Nagpur', 'Coimbatore', 'Vadodara',
];

const TITLES_EN = [
  'Worth every rupee',
  'Genuinely impressed',
  'Exactly as described',
  'Delivered in minutes',
  'Smooth experience',
  'Highly recommended',
  'Just what I needed',
  'No issues so far',
  'Better than expected',
  'Super fast delivery',
  'Solid value',
  'Trustworthy seller',
];

const TITLES_HINGLISH = [
  'Bahut mast service',
  'Paisa vasool',
  'Ekdum genuine',
  'Bilkul jhakaas',
  'Recommended for sure',
  'No fraud, all real',
  'Fast delivery mila',
  'Best price hai',
];

const BODIES_EN = (name: string) => [
  `I was a bit skeptical at first, but the {NAME} access I got was 100% working. Activation took less than 10 minutes after payment and the support team replied on WhatsApp instantly when I had a small login question. Definitely buying again.`,
  `Have been using {NAME} for the past 3 weeks now. Everything works exactly as it should — no random logouts, no errors. For the price compared to the official site, this is unbeatable. Saved me a ton.`,
  `Honestly the best decision I made this month. {NAME} was delivered within 5 minutes on WhatsApp and the setup instructions were dead simple. Quality is identical to a direct subscription. Trustworthy seller, will return.`,
  `Used {NAME} for a client project and it performed flawlessly. The team here is responsive and didn't ghost me when I had a question two days later. Genuine product, genuine people.`,
  `Great experience overall. {NAME} got activated on the same day, no shady redirects, no fake login pages. Smooth UPI payment, instant access. 5 stars from me.`,
  `Was looking for an affordable way to try {NAME} before committing to the official annual plan, and this was perfect. Working without any glitches for over a month now. Highly recommend to anyone hesitant.`,
];

const BODIES_HINGLISH = (name: string) => [
  `Bhai sach mein {NAME} ka subscription 5 minute me mil gaya WhatsApp pe. Pehle thoda doubt tha lekin ab confident hoon. Login smooth chala, koi issue nahi. Paisa vasool hai 100%.`,
  `{NAME} use kar raha hoon last 2 weeks se, ek baar bhi logout nahi hua. Support wale bhi turant reply karte hain. Original price ke saamne ye toh almost free hai. Recommended.`,
  `Pehle Telegram ke kuch sellers se thoka khaya tha, isiliye darr lagta tha. Yahaan se {NAME} liya — ekdum genuine nikla, instant delivery aur clear instructions. Ab regular customer ban gaya hoon.`,
  `Maine apne dost ke kehne pe try kiya aur ab main bhi recommend karta hoon. {NAME} bilkul authentic hai, koi cracked version nahi. Payment ke 10 min me sab setup ho gaya tha.`,
];

export function generateReviews(seed: string, name: string, count = 6): GeneratedReview[] {
  const rnd = mulberry32(hash(seed + '::' + name));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

  const bodiesEn = BODIES_EN(name);
  const bodiesHi = BODIES_HINGLISH(name);
  const reviews: GeneratedReview[] = [];

  for (let i = 0; i < count; i++) {
    const isHinglish = rnd() < 0.35;
    const rating = rnd() < 0.78 ? 5 : 4; // overwhelmingly positive
    const daysAgo = Math.floor(rnd() * 95) + 2;
    const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const body = (isHinglish ? pick(bodiesHi) : pick(bodiesEn)).replaceAll('{NAME}', name);
    reviews.push({
      id: `${seed}-r${i}`,
      author_name: `${pick(FIRST_NAMES)} ${pick(LAST_INITIALS)}`,
      rating,
      title: isHinglish ? pick(TITLES_HINGLISH) : pick(TITLES_EN),
      body,
      language: isHinglish ? 'hinglish' : 'en',
      city: pick(CITIES),
      verified_buyer: rnd() < 0.85,
      created_at: created.toISOString(),
      helpful_count: Math.floor(rnd() * 38) + 3,
    });
  }

  // Sort newest first so it looks like an active feed
  reviews.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return reviews;
}

export function computeStats(reviews: GeneratedReview[]) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let sum = 0;
  for (const r of reviews) {
    counts[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
    sum += r.rating;
  }
  return {
    avg: reviews.length ? sum / reviews.length : 0,
    total: reviews.length,
    counts,
  };
}
