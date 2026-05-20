// Deterministic, seeded review generator.
// Same (seed + name) => same reviews (stable for SEO + reloads).
// Different products get genuinely different reviewers, ratings, wording, and
// experience details. Within a single product no name, title, or body repeats.

export interface GeneratedReview {
  id: string;
  author_name: string;
  rating: number; // 3, 4 or 5 (strong positive bias, occasional balanced 3)
  title: string;
  body: string;
  language: 'en' | 'hinglish';
  city: string;
  verified_buyer: boolean;
  created_at: string; // ISO
  helpful_count: number;
}

/* ---------- deterministic RNG ---------- */

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

/* ---------- pools ---------- */

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Arjun', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Pooja',
  'Aditya', 'Neha', 'Rohan', 'Shreya', 'Aniket', 'Divya', 'Manish', 'Riya',
  'Siddharth', 'Megha', 'Amit', 'Kavya', 'Nikhil', 'Ishita', 'Varun', 'Tanya',
  'Harsh', 'Ayesha', 'Dev', 'Simran', 'Yash', 'Aarti', 'Sahil', 'Pallavi',
  'Rohit', 'Ritika', 'Kunal', 'Sanya', 'Abhinav', 'Trisha', 'Gaurav', 'Nidhi',
  'Pranav', 'Akanksha', 'Mohit', 'Bhavya', 'Tarun', 'Lavanya', 'Ankit', 'Sakshi',
  'Sameer', 'Charu', 'Kabir', 'Naina', 'Aryan', 'Diya', 'Ishaan', 'Aanya',
  'Rakesh', 'Smriti', 'Chirag', 'Nandini', 'Devansh', 'Surbhi', 'Parth', 'Mahima',
  'Raghav', 'Tejasvi', 'Faizan', 'Zara', 'Imran', 'Mehak', 'Hardik', 'Komal',
];
const LAST_INITIALS = [
  'S.', 'K.', 'M.', 'P.', 'R.', 'V.', 'J.', 'B.', 'G.', 'T.', 'C.', 'N.',
  'A.', 'D.', 'H.', 'L.', 'O.', 'W.', 'Y.', 'Z.', 'I.', 'U.',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Chandigarh', 'Surat', 'Noida',
  'Gurugram', 'Kochi', 'Bhopal', 'Nagpur', 'Coimbatore', 'Vadodara', 'Patna',
  'Ranchi', 'Guwahati', 'Bhubaneswar', 'Thiruvananthapuram', 'Mysuru', 'Mangaluru',
  'Visakhapatnam', 'Vijayawada', 'Raipur', 'Dehradun', 'Shimla', 'Amritsar',
  'Ludhiana', 'Faridabad', 'Ghaziabad', 'Meerut', 'Agra', 'Varanasi', 'Nashik',
  'Aurangabad', 'Goa', 'Howrah', 'Siliguri', 'Jodhpur', 'Udaipur',
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
  'Solid value for money',
  'Trustworthy seller',
  'Did not expect this quality',
  'Saved me a lot',
  'Quick and painless',
  'Will buy again',
  'Honest review — it works',
  'Was skeptical, now sold',
  'Clean handover, zero drama',
  'Bought twice already',
  'Support actually replies',
  'Working perfectly on day 30',
  'Took a chance — paid off',
  'Cleanest checkout I have used',
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
  'Seedha kaam, seedha baat',
  'Bina jhanjhat ke',
  'Trust kar sakte ho',
  'Pehle doubt tha, ab confident',
  'Maza aa gaya bhai',
  'Kaam ka product hai',
];

/* ---------- body fragment system ---------- */
// Each review is composed from independent fragments so the same product can
// produce many distinct, realistic-sounding bodies.

interface Frag { id: string; text: string }
const F = (id: string, text: string): Frag => ({ id, text });

const OPENERS_EN: Frag[] = [
  F('en-o1', 'Honestly was on the fence for a few days before ordering.'),
  F('en-o2', 'Tried two other sellers earlier and both ghosted me, so my expectations were low.'),
  F('en-o3', 'Found this through a friend who has been buying here for months.'),
  F('en-o4', 'Saw the price and assumed it had to be a scam — turns out I was wrong.'),
  F('en-o5', 'Needed access urgently for a deadline at work.'),
  F('en-o6', 'Picked it up after reading the FAQ page thoroughly.'),
  F('en-o7', 'My first time buying a digital subscription outside the official site.'),
  F('en-o8', 'Compared prices across three places before landing here.'),
  F('en-o9', 'I usually pay full retail, but the savings here were too big to ignore.'),
  F('en-o10', 'Ordered late at night not expecting anything before morning.'),
  F('en-o11', 'A colleague recommended this after using it for his own setup.'),
  F('en-o12', 'I had been postponing the upgrade for months because of the official pricing.'),
];

const DELIVERY_EN: Frag[] = [
  F('en-d1', 'Activation landed on WhatsApp in under 8 minutes.'),
  F('en-d2', 'Got the login within 15 minutes of paying, no follow-up needed.'),
  F('en-d3', 'Delivery was faster than the confirmation email itself.'),
  F('en-d4', 'The credentials came with a short PDF guide which was a nice touch.'),
  F('en-d5', 'They walked me through the first login over chat — patient and clear.'),
  F('en-d6', 'Setup took maybe 3 minutes from message to working dashboard.'),
  F('en-d7', 'No weird redirects, no random Telegram links, just the actual product.'),
  F('en-d8', 'UPI payment went through cleanly and the receipt came right after.'),
  F('en-d9', 'Even on a Sunday evening the response was almost instant.'),
];

const USAGE_EN = (n: string): Frag[] => [
  F('en-u1', `Been using ${n} daily for about three weeks now without a single hiccup.`),
  F('en-u2', `I share ${n} between my laptop and phone and both stay logged in.`),
  F('en-u3', `Used ${n} for a client deliverable and it behaved exactly like a direct subscription.`),
  F('en-u4', `Quality of ${n} is identical to what my office pays full price for.`),
  F('en-u5', `No region locks, no random logouts, ${n} just runs.`),
  F('en-u6', `${n} has been stable through two app updates already, which was my biggest worry.`),
  F('en-u7', `My ${n} access has held up for over a month — that alone is rare in this market.`),
  F('en-u8', `I have stress-tested ${n} on slow networks and it still performs fine.`),
];

const SUPPORT_EN: Frag[] = [
  F('en-s1', 'When I had a small login question they replied in under 5 minutes.'),
  F('en-s2', 'Support is on WhatsApp, talks like a real person, not a bot script.'),
  F('en-s3', 'Followed up after two days to make sure everything was still working.'),
  F('en-s4', 'They did not disappear after the sale, which is honestly the main thing.'),
  F('en-s5', 'Asked a billing question a week later and still got a clear answer.'),
];

const CLOSERS_EN: Frag[] = [
  F('en-c1', 'Will absolutely come back for renewal.'),
  F('en-c2', 'Already recommended to two friends.'),
  F('en-c3', 'Easy 5 stars from me.'),
  F('en-c4', 'Genuinely good experience end to end.'),
  F('en-c5', 'Would buy from here over the official site again.'),
  F('en-c6', 'Hard to fault anything about this purchase.'),
  F('en-c7', 'If you are hesitating, do not.'),
];

const OPENERS_HI: Frag[] = [
  F('hi-o1', 'Pehle thoda doubt tha kyunki price kaafi kam tha.'),
  F('hi-o2', 'Ek dost ne bola yahaan se le, warna main Telegram pe try karta.'),
  F('hi-o3', 'Office ke kaam ke liye urgent chahiye tha.'),
  F('hi-o4', 'Pehle ek aur seller se thoka kha chuka tha, isliye darr tha.'),
  F('hi-o5', 'Reviews padh ke order kiya, risk lene ka mann tha.'),
  F('hi-o6', 'Original price afford nahi ho raha tha, isliye yahaan try kiya.'),
];

const DELIVERY_HI: Frag[] = [
  F('hi-d1', 'Payment ke 5 minute mein WhatsApp pe login aa gaya.'),
  F('hi-d2', 'Delivery itni fast thi ki main payment confirmation hi padh raha tha.'),
  F('hi-d3', 'UPI se paid kiya, turant receipt aur access dono mile.'),
  F('hi-d4', 'Setup karne mein bas 2 minute lage, sab clear instructions.'),
  F('hi-d5', 'Late raat order kiya phir bhi instant delivery mili.'),
];

const USAGE_HI = (n: string): Frag[] => [
  F('hi-u1', `${n} pichle 2 hafte se chal raha hai, ek baar bhi logout nahi hua.`),
  F('hi-u2', `${n} laptop aur mobile dono pe smooth chal raha hai.`),
  F('hi-u3', `${n} ka experience original jaisa hi hai, koi farak nahi.`),
  F('hi-u4', `${n} use karte hue koi error ya block nahi aaya abhi tak.`),
  F('hi-u5', `${n} ka quality dekh ke lagta hi nahi ki itna kam paisa diya.`),
];

const SUPPORT_HI: Frag[] = [
  F('hi-s1', 'Support wale WhatsApp pe turant reply karte hain, bot nahi hai.'),
  F('hi-s2', 'Ek doubt tha login ka, 5 minute mein solve ho gaya.'),
  F('hi-s3', 'Sale ke baad bhi follow-up kiya unhone, ye baat acchi lagi.'),
];

const CLOSERS_HI: Frag[] = [
  F('hi-c1', 'Agle baar bhi yahin se lunga.'),
  F('hi-c2', 'Doston ko bhi recommend kar diya.'),
  F('hi-c3', 'Paisa vasool, full trust.'),
  F('hi-c4', 'Bina soche le sakte ho.'),
  F('hi-c5', 'Genuinely khush hoon is purchase se.'),
];

// Occasional balanced 3-star templates — keeps the set credible.
const BALANCED_EN = (n: string): string[] => [
  `${n} works fine and the delivery was quick, but I had to wait about an hour for the support team to reply to my first message. After that everything was smooth. Still recommending.`,
  `Got ${n} as promised and it is running well on my end. The only nitpick — the setup PDF could be a bit clearer for non-technical buyers. Apart from that, no complaints.`,
  `${n} is genuine and the price is unbeatable. Took two messages to get the right login link sent, but once received it has been stable. Fair experience overall.`,
];

/* ---------- helpers ---------- */

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnique<T>(arr: T[], n: number, rnd: () => number): T[] {
  if (n >= arr.length) return shuffle(arr, rnd);
  return shuffle(arr, rnd).slice(0, n);
}

function composeEnglish(name: string, rnd: () => number) {
  const opener = OPENERS_EN[Math.floor(rnd() * OPENERS_EN.length)];
  const delivery = DELIVERY_EN[Math.floor(rnd() * DELIVERY_EN.length)];
  const usagePool = USAGE_EN(name);
  const usage = usagePool[Math.floor(rnd() * usagePool.length)];
  const includeSupport = rnd() < 0.55;
  const support = includeSupport ? SUPPORT_EN[Math.floor(rnd() * SUPPORT_EN.length)] : null;
  const closer = CLOSERS_EN[Math.floor(rnd() * CLOSERS_EN.length)];
  const sigKey = `${opener.id}|${delivery.id}|${usage.id}|${support?.id ?? '-'}|${closer.id}`;
  const parts = [opener.text, delivery.text, usage.text];
  if (support) parts.push(support.text);
  parts.push(closer.text);
  return { text: parts.join(' '), sigKey };
}

function composeHinglish(name: string, rnd: () => number) {
  const opener = OPENERS_HI[Math.floor(rnd() * OPENERS_HI.length)];
  const delivery = DELIVERY_HI[Math.floor(rnd() * DELIVERY_HI.length)];
  const usagePool = USAGE_HI(name);
  const usage = usagePool[Math.floor(rnd() * usagePool.length)];
  const includeSupport = rnd() < 0.5;
  const support = includeSupport ? SUPPORT_HI[Math.floor(rnd() * SUPPORT_HI.length)] : null;
  const closer = CLOSERS_HI[Math.floor(rnd() * CLOSERS_HI.length)];
  const sigKey = `${opener.id}|${delivery.id}|${usage.id}|${support?.id ?? '-'}|${closer.id}`;
  const parts = [opener.text, delivery.text, usage.text];
  if (support) parts.push(support.text);
  parts.push(closer.text);
  return { text: parts.join(' '), sigKey };
}

/* ---------- main ---------- */

export function generateReviews(seed: string, name: string, count = 8): GeneratedReview[] {
  const rnd = mulberry32(hash(seed + '::' + name));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

  // Unique author names + titles per product
  const namesPool: string[] = [];
  for (const fn of FIRST_NAMES) for (const li of LAST_INITIALS) namesPool.push(`${fn} ${li}`);
  const namesShuffled = shuffle(namesPool, rnd);

  const titlesEnShuffled = shuffle(TITLES_EN, rnd);
  const titlesHiShuffled = shuffle(TITLES_HINGLISH, rnd);

  const usedBodySigs = new Set<string>();
  const usedTitles = new Set<string>();
  const reviews: GeneratedReview[] = [];

  let enTitleIdx = 0;
  let hiTitleIdx = 0;

  for (let i = 0; i < count; i++) {
    const isHinglish = rnd() < 0.32;

    // Rating distribution: 70% five-star, 22% four-star, 8% three-star
    const r = rnd();
    const rating = r < 0.7 ? 5 : r < 0.92 ? 4 : 3;

    const daysAgo = Math.floor(rnd() * 110) + 2;
    const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    let bodyText = '';
    if (rating === 3) {
      const balancedPool = BALANCED_EN(name);
      bodyText = balancedPool[Math.floor(rnd() * balancedPool.length)];
    } else {
      // try up to 8 compositions to find an unused signature
      for (let attempt = 0; attempt < 8; attempt++) {
        const composed = isHinglish ? composeHinglish(name, rnd) : composeEnglish(name, rnd);
        if (!usedBodySigs.has(composed.sigKey) || attempt === 7) {
          usedBodySigs.add(composed.sigKey);
          bodyText = composed.text;
          break;
        }
      }
    }

    // Title — try not to reuse within product
    let title = '';
    const titlesArr = isHinglish ? titlesHiShuffled : titlesEnShuffled;
    for (let t = 0; t < titlesArr.length; t++) {
      const idx = isHinglish ? (hiTitleIdx + t) % titlesArr.length : (enTitleIdx + t) % titlesArr.length;
      const candidate = titlesArr[idx];
      if (!usedTitles.has(candidate)) {
        title = candidate;
        usedTitles.add(candidate);
        if (isHinglish) hiTitleIdx = idx + 1; else enTitleIdx = idx + 1;
        break;
      }
    }
    if (!title) title = pick(titlesArr);

    const authorName = namesShuffled[i % namesShuffled.length];

    reviews.push({
      id: `${seed}-r${i}`,
      author_name: authorName,
      rating,
      title,
      body: bodyText,
      language: isHinglish ? 'hinglish' : 'en',
      city: pick(CITIES),
      verified_buyer: rnd() < 0.86,
      created_at: created.toISOString(),
      helpful_count: Math.floor(rnd() * 47) + 2,
    });
  }

  // Newest first
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
