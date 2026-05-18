// Curated metadata for AI tools sold via the AI Tools page.
// Each entry provides a clean brand logo (via Clearbit), a brand color used
// as a tile background, a short marketing tagline, and longer product info
// that we surface in the card and the WhatsApp pre-fill.
import merlinLogo from '@/assets/merlin-logo.svg';
import { userLogoFor } from '@/data/userLogos';

export type ToolMeta = {
  /** keyword matched (case-insensitive substring) against the sheet "Tool Name" */
  match: string;
  /** Display category badge */
  category: string;
  /** Domain for Clearbit logo (https://logo.clearbit.com/<domain>) */
  domain: string;
  /** Brand color (hex) used for the tile background gradient */
  color: string;
  /** Short one-liner shown on the card */
  tagline: string;
  /** Longer description shown in the modal/expanded view + WhatsApp message */
  description: string;
  /** Bullet feature highlights */
  features: string[];
  /** Optional explicit logo URL (SVG preferred). Tried before the Clearbit fallback. */
  logo?: string;
};

// Crisp SVG-first logo overrides for brands that come out blurry from Clearbit/favicon fallbacks.
// SimpleIcons CDN serves brand-coloured SVGs that stay sharp at any size.
const LOGO_OVERRIDES: Record<string, string> = {
  'adobe.com': 'https://api.iconify.design/simple-icons/adobecreativecloud.svg?color=%23DA1F26',
  'airtable.com': 'https://cdn.simpleicons.org/airtable/18BFFF',
  'autodesk.com': 'https://cdn.simpleicons.org/autodesk/0696D7',
  'grammarly.com': 'https://cdn.simpleicons.org/grammarly/15C39A',
  'intercom.com': 'https://cdn.simpleicons.org/intercom/1F8DED',
  'linkedin.com': 'https://api.iconify.design/simple-icons/linkedin.svg?color=%230A66C2',
  'mongodb.com': 'https://cdn.simpleicons.org/mongodb/47A248',
  'n8n.io': 'https://api.iconify.design/simple-icons/n8n.svg?color=%23EA4B71',
  'render.com': 'https://api.iconify.design/simple-icons/render.svg?color=%2346E3B7',
  'roboform.com': 'https://cdn.roboform.com/images/logos/rf-logo.svg',
  'sentry.io': 'https://api.iconify.design/simple-icons/sentry.svg?color=%23362D59',
  'tilda.cc': 'https://cdn.simpleicons.org/tildapublishing/FFB81C',
  'firecrawl.dev': 'https://avatars.githubusercontent.com/u/135057108?s=400',
  'questionpro.com': 'https://www.questionpro.com/images/logo/questionpro-logo.svg',
  'merlin.foyer.work': merlinLogo,
  'magicpatterns.com': 'https://www.magicpatterns.com/magicpatterns_logo_dark.svg',
  'leads.cm': 'https://leads.cm/favicon.svg',
  'gumloop.com': 'https://www.gumloop.com/images/gumloop_icon.svg',
  'chatprd.ai': 'https://www.chatprd.ai/_next/static/media/logo-text-black.8e455f3e.svg',
  'vibeflow.ai': 'https://vibeflow.ai/favicon.svg',
};

// Order matters — more specific names first (e.g. "Linkedin Sales Navigator" before "Linkedin")
export const TOOL_META: ToolMeta[] = [
  {
    match: 'eleven labs',
    category: 'Voice AI',
    domain: 'elevenlabs.io',
    color: '#0D0D0D',
    tagline: 'Hyper-realistic AI voice generation & cloning',
    description:
      'ElevenLabs Creator plan unlocks 100,000 characters/month, professional voice cloning, dubbing in 29 languages and commercial usage rights — ideal for creators, podcasters and YouTubers.',
    features: ['100K characters/month', 'Voice cloning', '29 languages dubbing', 'Commercial license'],
  },
  {
    match: 'replit',
    category: 'AI Coding',
    domain: 'replit.com',
    color: '#F26207',
    tagline: 'Cloud IDE with Replit Agent & AI assistant',
    description:
      'Replit Core gives you unlimited public & private Repls, Replit Agent (AI that builds apps for you), Ghostwriter AI completions and $25/month in compute credits for deployments.',
    features: ['Replit Agent AI', 'Ghostwriter AI', '$25 compute credits', 'Unlimited private Repls'],
  },
  {
    match: 'figma',
    category: 'Design',
    domain: 'figma.com',
    color: '#A259FF',
    tagline: 'The collaborative design platform',
    description:
      'Figma Professional unlocks unlimited Figma & FigJam files, version history, team libraries, dev mode and advanced prototyping — the industry standard for product design teams.',
    features: ['Unlimited files', 'Dev Mode', 'Team libraries', 'Advanced prototyping'],
  },
  {
    match: 'lovable',
    category: 'AI Coding',
    domain: 'lovable.dev',
    color: '#FF4D4D',
    tagline: 'Build full-stack apps with AI in minutes',
    description:
      'Lovable Pro plan with 100 monthly credits — generate complete React + Supabase apps from prompts, with version control, custom domains and one-click publishing.',
    features: ['100 credits/month', 'Full-stack apps', 'Supabase backend', 'Custom domains'],
  },
  {
    match: 'manus',
    category: 'AI Agent',
    domain: 'manus.im',
    color: '#000000',
    tagline: 'Autonomous AI agent for research & tasks',
    description:
      'Manus AI Pro is a general-purpose autonomous agent that browses the web, writes code, files reports and executes multi-step workflows on your behalf.',
    features: ['Autonomous browsing', 'Multi-step tasks', 'Code execution', 'Report generation'],
  },
  {
    match: 'gamma',
    category: 'Presentations',
    domain: 'gamma.app',
    color: '#9333EA',
    tagline: 'AI-generated presentations, docs & websites',
    description:
      'Gamma Pro creates beautiful presentations, documents and one-page websites from a single prompt — with unlimited AI generations and custom branding.',
    features: ['Unlimited AI decks', 'Custom branding', 'Export to PPT/PDF', 'AI image generation'],
  },
  {
    match: 'grammarly',
    category: 'Writing',
    domain: 'grammarly.com',
    color: '#15C39A',
    tagline: 'AI writing assistant for grammar & tone',
    description:
      'Grammarly Premium catches advanced grammar issues, suggests clarity rewrites, tone adjustments and plagiarism detection across every app you write in.',
    features: ['Advanced grammar', 'Tone detection', 'Plagiarism check', 'Generative AI assist'],
  },
  {
    match: 'chatgpt',
    category: 'LLM Chat',
    domain: 'openai.com',
    color: '#10A37F',
    tagline: 'GPT-4o, advanced voice & DALL·E image gen',
    description:
      'ChatGPT Plus gives you GPT-4o, GPT-4.1, advanced voice mode, DALL·E 3 image generation, code interpreter, custom GPTs and 5x higher rate limits.',
    features: ['GPT-4o & 4.1', 'DALL·E 3 images', 'Advanced voice', 'Custom GPTs'],
  },
  {
    match: 'linkedin sales navigator',
    category: 'Sales',
    domain: 'linkedin.com',
    color: '#0A66C2',
    tagline: 'Advanced lead search & CRM sync',
    description:
      'Sales Navigator Advanced — 50 InMails/month, advanced lead & account filters, CRM sync, buyer intent signals and TeamLink for warm intros.',
    features: ['50 InMails/month', 'Advanced filters', 'CRM sync', 'Buyer intent data'],
  },
  {
    match: 'linkedin career',
    category: 'Career',
    domain: 'linkedin.com',
    color: '#0A66C2',
    tagline: 'Stand out to recruiters with Premium',
    description:
      'LinkedIn Premium Career — see who viewed your profile, 5 InMails/month, AI-powered resume help, LinkedIn Learning and applicant insights.',
    features: ['Who viewed you', '5 InMails/month', 'LinkedIn Learning', 'Applicant insights'],
  },
  {
    match: 'linkedin business',
    category: 'Networking',
    domain: 'linkedin.com',
    color: '#0A66C2',
    tagline: 'Grow your network & business presence',
    description:
      'LinkedIn Premium Business — 15 InMails/month, unlimited people search, business insights and full LinkedIn Learning access for professionals.',
    features: ['15 InMails/month', 'Unlimited search', 'Business insights', 'LinkedIn Learning'],
  },
  {
    match: 'notion',
    category: 'Productivity',
    domain: 'notion.so',
    color: '#000000',
    tagline: 'All-in-one workspace with Notion AI',
    description:
      'Notion Business + AI — unlimited blocks, private teamspaces, SAML SSO, advanced page analytics and full Notion AI (summaries, autofill, Q&A across your workspace).',
    features: ['Notion AI included', 'Private teamspaces', 'Unlimited blocks', 'Advanced permissions'],
  },
  {
    match: 'canva',
    category: 'Design',
    domain: 'canva.com',
    color: '#00C4CC',
    tagline: '100M+ premium assets & Magic Studio AI',
    description:
      'Canva Pro unlocks 100M+ premium photos, videos & templates, background remover, brand kits, Magic Studio AI (Magic Write, Edit & Resize) and 1TB storage.',
    features: ['Magic Studio AI', '100M+ assets', 'Background remover', 'Brand kits + 1TB storage'],
  },
  {
    match: 'coursera',
    category: 'Learning',
    domain: 'coursera.org',
    color: '#0056D2',
    tagline: '7,000+ courses with verified certificates',
    description:
      'Coursera Plus — unlimited access to 7,000+ courses, Professional Certificates and Specializations from Google, Meta, IBM, Stanford and more, with shareable certificates.',
    features: ['7,000+ courses', 'Verified certificates', 'Professional Programs', 'Hands-on projects'],
  },
  {
    match: 'perplexity',
    category: 'AI Search',
    domain: 'perplexity.ai',
    color: '#20B8CD',
    tagline: 'AI answer engine with live citations',
    description:
      'Perplexity Pro — unlimited Pro searches with GPT-4o, Claude 3.5 Sonnet, Grok 2 and Sonar Huge, file uploads, image generation and Perplexity Spaces.',
    features: ['Choice of GPT-4o/Claude', 'Unlimited Pro search', 'File uploads', 'Image generation'],
  },
  {
    match: 'microsoft 365 with copilot',
    category: 'Office Suite',
    domain: 'microsoft.com',
    color: '#0067B8',
    tagline: 'Office apps + Copilot AI in every app',
    description:
      'Microsoft 365 with Copilot — Word, Excel, PowerPoint, Outlook and Teams with Copilot AI built in: draft emails, summarise meetings, build slides and analyse spreadsheets.',
    features: ['Copilot in every app', 'Word/Excel/PPT/Outlook', '1TB OneDrive', 'Teams included'],
  },
  {
    match: 'microsoft 365',
    category: 'Office Suite',
    domain: 'microsoft.com',
    color: '#0067B8',
    tagline: 'Office desktop apps + 1TB OneDrive',
    description:
      'Microsoft 365 with 1TB OneDrive — full desktop & web versions of Word, Excel, PowerPoint, Outlook on up to 5 devices with 1TB of secure cloud storage.',
    features: ['Word/Excel/PPT/Outlook', '1TB OneDrive', '5 devices', 'Premium support'],
  },
  {
    match: 'google gemini',
    category: 'LLM Chat',
    domain: 'google.com',
    color: '#4285F4',
    tagline: 'Gemini 2.5 Pro + 5TB Google One storage',
    description:
      'Google Gemini Pro (Google One AI Premium) — Gemini 2.5 Pro with Deep Research, Gemini in Gmail/Docs/Sheets, NotebookLM Plus and 5TB of cloud storage.',
    features: ['Gemini 2.5 Pro', 'Deep Research', 'Gemini in Workspace', '5TB Google One'],
  },
  {
    match: 'descript',
    category: 'Video Editing',
    domain: 'descript.com',
    color: '#000000',
    tagline: 'Edit video & podcasts by editing text',
    description:
      'Descript Creator — record, transcribe and edit audio/video as easily as a doc. Includes Overdub voice cloning, studio sound, eye contact AI and 10 hours/month transcription.',
    features: ['Edit video like text', 'Overdub voice clone', 'Studio sound AI', '10 hrs transcription'],
  },
  {
    match: 'fireflies',
    category: 'Meetings',
    domain: 'fireflies.ai',
    color: '#7E4FFF',
    tagline: 'AI notetaker for Zoom, Meet & Teams',
    description:
      'Fireflies AI — automatically joins your meetings, transcribes, summarises and extracts action items. Search across all conversations and sync to Notion, Slack, CRM.',
    features: ['Auto meeting notes', 'AI summaries', 'CRM integrations', 'Conversation search'],
  },
  {
    match: 'nord vpn',
    category: 'Security',
    domain: 'nordvpn.com',
    color: '#4687FF',
    tagline: '6,000+ servers, military-grade encryption',
    description:
      'NordVPN — 6,000+ ultra-fast servers in 111 countries, NordLynx protocol, Threat Protection malware blocker, dedicated IP option and protection on 10 devices.',
    features: ['6,000+ servers', 'NordLynx speed', 'Threat Protection', '10 devices'],
  },
  {
    match: 'merlin',
    category: 'AI Assistant',
    domain: 'merlin.foyer.work',
    color: '#7C3AED',
    tagline: 'GPT-4, Claude & Gemini in your browser',
    description:
      'Merlin Pro — one-click access to GPT-4o, Claude 3.5 Sonnet and Gemini Pro inside any website. Summarise pages, chat with PDFs/YouTube and write anywhere.',
    features: ['GPT-4 + Claude + Gemini', 'Chat with any webpage', 'YouTube/PDF summariser', 'Unlimited queries'],
  },
  {
    match: 'leads',
    category: 'Sales',
    domain: 'leads.cm',
    color: '#0EA5E9',
    tagline: 'B2B lead database & email finder',
    description:
      'Leads.cm — premium B2B contact database with verified emails, phone numbers and company data. Built for outbound sales & lead generation at scale.',
    features: ['Verified emails', 'Phone numbers', 'Company filters', 'CSV exports'],
  },
  {
    match: 'adobe',
    category: 'Creative',
    domain: 'adobe.com',
    color: '#FA0F00',
    tagline: 'All 20+ Adobe apps + Firefly AI',
    description:
      'Adobe Creative Cloud All Apps — Photoshop, Illustrator, Premiere Pro, After Effects, Lightroom, InDesign and 20+ apps, plus Firefly generative AI and 100GB cloud storage.',
    features: ['20+ Adobe apps', 'Firefly AI', '100GB storage', 'Adobe Fonts'],
  },
  {
    match: 'n8n',
    category: 'Automation',
    domain: 'n8n.io',
    color: '#EA4B71',
    tagline: 'Workflow automation with 400+ integrations',
    description:
      'n8n Starter — visual workflow automation with 400+ integrations, self-hosted or cloud, with native AI agent nodes for LangChain-style automations.',
    features: ['400+ integrations', 'AI agent nodes', 'Visual builder', 'Self-host or cloud'],
  },
  {
    match: 'bolt',
    category: 'AI Coding',
    domain: 'bolt.new',
    color: '#0EA5E9',
    tagline: 'Prompt-to-app full-stack builder',
    description:
      'Bolt Pro — generate full-stack apps from prompts with live preview, npm packages, GitHub sync and one-click deploys to Netlify. 10M tokens/month.',
    features: ['Prompt-to-app', 'Full npm support', 'GitHub sync', 'One-click deploy'],
  },
  {
    match: 'warp',
    category: 'Dev Tools',
    domain: 'warp.dev',
    color: '#01A4FF',
    tagline: 'AI-powered terminal for developers',
    description:
      'Warp — modern terminal with AI command suggestions, natural-language to shell, shared workflows, blocks-based output and seamless team collaboration.',
    features: ['AI command suggestions', 'Natural language → shell', 'Shared workflows', 'Blocks UI'],
  },
  {
    match: 'make',
    category: 'Automation',
    domain: 'make.com',
    color: '#6D00CC',
    tagline: 'Visual automation for 2,000+ apps',
    description:
      'Make.com Pro — design powerful workflows visually across 2,000+ apps with 10,000 ops/month, scheduled runs, priority execution and full webhook support.',
    features: ['2,000+ apps', '10K operations', 'Visual scenarios', 'Priority execution'],
  },
  {
    match: 'chatprd',
    category: 'Product',
    domain: 'chatprd.ai',
    color: '#4F46E5',
    tagline: 'AI product manager for PRDs & specs',
    description:
      'ChatPRD Pro — generate complete PRDs, user stories, roadmaps and tickets with AI trained on PM best practices. Templates for every product workflow.',
    features: ['AI PRD generator', 'User story templates', 'Roadmap builder', 'Jira/Linear export'],
  },
  {
    match: 'chatprf',
    category: 'Product',
    domain: 'chatprd.ai',
    color: '#4F46E5',
    tagline: 'AI product manager for PRDs & specs',
    description:
      'ChatPRD Pro — generate complete PRDs, user stories, roadmaps and tickets with AI trained on PM best practices. Templates for every product workflow.',
    features: ['AI PRD generator', 'User story templates', 'Roadmap builder', 'Jira/Linear export'],
  },
  {
    match: 'rezi',
    category: 'Career',
    domain: 'rezi.ai',
    color: '#16A34A',
    tagline: 'AI resume builder, ATS-optimised',
    description:
      'Rezi AI Lifetime — unlimited AI-generated, ATS-optimised resumes & cover letters, real-time content analyzer, keyword targeting and 80+ templates. Lifetime access.',
    features: ['ATS-optimised', 'AI writer', '80+ templates', 'Lifetime access'],
  },
  {
    match: 'retool',
    category: 'Internal Tools',
    domain: 'retool.com',
    color: '#3D3D3D',
    tagline: 'Build internal tools, fast',
    description:
      'Retool — drag-and-drop builder for internal apps, admin panels and dashboards. Connect to any database/API, write SQL/JS, deploy in minutes.',
    features: ['Drag-and-drop builder', 'Any DB/API connector', 'SQL + JS', 'Granular permissions'],
  },
  {
    match: 'intercom',
    category: 'Support',
    domain: 'intercom.com',
    color: '#1F8DED',
    tagline: 'Customer support with FIN AI agent',
    description:
      'Intercom Advanced + FIN AI — full customer messaging suite with the FIN AI agent that auto-resolves up to 50% of support tickets using your help docs.',
    features: ['FIN AI agent', 'Auto-resolves tickets', 'Help center', 'Omnichannel inbox'],
  },
  {
    match: 'framer',
    category: 'Web Builder',
    domain: 'framer.com',
    color: '#0099FF',
    tagline: 'Design & ship websites visually',
    description:
      'Framer Basic — design and publish responsive websites with CMS, animations, custom code components and free SSL hosting on a custom domain.',
    features: ['Visual website builder', 'CMS included', 'Custom domains', 'Smart animations'],
  },
  {
    match: 'wispr',
    category: 'Voice AI',
    domain: 'wisprflow.ai',
    color: '#9333EA',
    tagline: 'Voice dictation that beats typing',
    description:
      'Wispr Flow — 3x faster than typing. AI-powered voice dictation that works in any app, autocorrects, formats and adapts to your style.',
    features: ['3x faster than typing', 'Works in any app', 'Auto-format & correct', 'Style learning'],
  },
  {
    match: 'supabase',
    category: 'Backend',
    domain: 'supabase.com',
    color: '#3ECF8E',
    tagline: 'Open-source Postgres backend',
    description:
      'Supabase Pro — managed Postgres, Auth, Edge Functions, Storage and Realtime with daily backups, 8GB DB, 100GB bandwidth and no project pausing.',
    features: ['Managed Postgres', 'Auth + Storage', 'Edge Functions', 'Daily backups'],
  },
  {
    match: 'vapi',
    category: 'Voice AI',
    domain: 'vapi.ai',
    color: '#22C55E',
    tagline: 'Build voice AI agents for phone calls',
    description:
      'Vapi.ai — $200 in credits to build production-grade voice AI agents. Handle inbound/outbound calls with low-latency LLM + TTS pipelines.',
    features: ['$200 free credits', 'Low-latency voice', 'Inbound + outbound', 'Any LLM provider'],
  },
  {
    match: 'granola',
    category: 'Meetings',
    domain: 'granola.ai',
    color: '#F97316',
    tagline: 'AI notepad for back-to-back meetings',
    description:
      'Granola — runs locally on your Mac, transcribes meetings without bots and enhances your own notes with AI summaries. Privacy-first meeting assistant.',
    features: ['No meeting bots', 'Local transcription', 'AI-enhanced notes', 'Mac-native'],
  },
  {
    match: 'linear',
    category: 'Project Mgmt',
    domain: 'linear.app',
    color: '#5E6AD2',
    tagline: 'The issue tracker built for speed',
    description:
      'Linear — modern issue tracking and project planning for software teams. Lightning-fast UI, cycles, roadmaps, GitHub/Slack sync and AI triage.',
    features: ['Blazing-fast UI', 'Cycles & roadmaps', 'GitHub/Slack sync', 'AI triage'],
  },
  {
    match: 'magic patterns',
    category: 'AI Design',
    domain: 'magicpatterns.com',
    color: '#000000',
    tagline: 'AI UI generator for React + Tailwind',
    description:
      'Magic Patterns — generate production-ready React components and full pages from prompts or screenshots. Tailwind-native, ships clean JSX you own.',
    features: ['Prompt → React UI', 'Screenshot → code', 'Tailwind native', 'Clean exportable JSX'],
  },
  {
    match: 'posthog',
    category: 'Analytics',
    domain: 'posthog.com',
    color: '#F54E00',
    tagline: 'Product analytics, session replay & feature flags',
    description:
      'PostHog — all-in-one product analytics, session replays, A/B testing, feature flags and surveys. The open-source alternative to Mixpanel/Amplitude.',
    features: ['Product analytics', 'Session replay', 'Feature flags', 'A/B testing'],
  },
  {
    match: 'loom',
    category: 'Video',
    domain: 'loom.com',
    color: '#625DF5',
    tagline: 'Async video messaging with AI',
    description:
      'Loom Business + AI — unlimited videos, AI titles/summaries/chapters, auto-transcripts in 50+ languages, custom branding and engagement insights.',
    features: ['Unlimited videos', 'AI summaries', '50+ language transcripts', 'Custom branding'],
  },
  {
    match: 'mobbin',
    category: 'Design Inspo',
    domain: 'mobbin.com',
    color: '#000000',
    tagline: '300,000+ UI screens from top apps',
    description:
      'Mobbin Pro — searchable library of 300,000+ mobile & web UI screens from the world\'s best apps. Filter by element, pattern, industry and flow.',
    features: ['300K+ UI screens', 'iOS + Android + Web', 'Flow-based browsing', 'Element filters'],
  },
  {
    match: 'firecrawl',
    category: 'Dev Tools',
    domain: 'firecrawl.dev',
    color: '#F97316',
    tagline: 'Turn any website into clean LLM data',
    description:
      'Firecrawl — 100,000 credits to scrape, crawl and convert any website into clean markdown/JSON for LLMs. Handles JS rendering, anti-bot and PDFs.',
    features: ['100K credits', 'JS rendering', 'Markdown/JSON output', 'Crawl whole sites'],
  },
  {
    match: 'sentry',
    category: 'Monitoring',
    domain: 'sentry.io',
    color: '#362D59',
    tagline: 'Error tracking & performance monitoring',
    description:
      'Sentry — $5,000 in credits for application monitoring, error tracking, performance profiling, session replay and AI-powered issue triage.',
    features: ['$5,000 credits', 'Error tracking', 'Performance monitoring', 'Session replay'],
  },
  {
    match: 'miro',
    category: 'Whiteboard',
    domain: 'miro.com',
    color: '#FFD02F',
    tagline: 'Visual collaboration & AI whiteboard',
    description:
      'Miro Business — unlimited boards with $1,000 credits, Miro AI (mind maps, summaries, image gen), Smart Frames and integrations with Jira, Asana, Slack.',
    features: ['Unlimited boards', 'Miro AI included', 'Smart Frames', 'Jira/Asana sync'],
  },
  {
    match: '1password',
    category: 'Security',
    domain: '1password.com',
    color: '#0572EC',
    tagline: 'Secure password manager for everyone',
    description:
      '1Password Individual — unlimited passwords, passkeys, 2FA codes and secure documents synced across all your devices with Watchtower breach alerts.',
    features: ['Unlimited passwords', 'Passkey support', 'Built-in 2FA', 'Watchtower alerts'],
  },
  {
    match: 'apify',
    category: 'Web Scraping',
    domain: 'apify.com',
    color: '#97CA00',
    tagline: 'Web scraping & automation platform',
    description:
      'Apify — credits to run 4,500+ pre-built scrapers (Actors) or build your own. Scrape Google, LinkedIn, Amazon, Instagram with proxies and scheduling.',
    features: ['4,500+ Actors', 'Residential proxies', 'Scheduled runs', 'API + Webhooks'],
  },
  {
    match: 'mongodb',
    category: 'Database',
    domain: 'mongodb.com',
    color: '#13AA52',
    tagline: '$500 credits for managed MongoDB Atlas',
    description:
      'MongoDB Atlas — $500 in cloud credits for fully-managed MongoDB across AWS/GCP/Azure with auto-scaling, search, vector search and serverless instances.',
    features: ['$500 cloud credits', 'Auto-scaling', 'Vector search', 'Multi-cloud'],
  },
  {
    match: 'railway',
    category: 'Hosting',
    domain: 'railway.app',
    color: '#0B0D0E',
    tagline: 'Deploy apps & databases with one click',
    description:
      'Railway Pro — deploy apps, Postgres, Redis, Mongo with one click. Includes $20/mo usage, priority support, team seats and unlimited projects.',
    features: ['One-click deploys', '$20/mo usage', 'Databases included', 'Team seats'],
  },
  {
    match: 'render',
    category: 'Hosting',
    domain: 'render.com',
    color: '#5469D4',
    tagline: '$5,000 credits for cloud hosting',
    description:
      'Render — $5,000 in credits to host web services, static sites, Postgres, Redis and cron jobs with free SSL, auto-deploys from Git and global CDN.',
    features: ['$5,000 credits', 'Auto-deploy from Git', 'Free SSL + CDN', 'Managed Postgres'],
  },
  {
    match: 'airtable business plan + extra',
    category: 'Database',
    domain: 'airtable.com',
    color: '#FCB400',
    tagline: 'Business plan + 10K bonus AI credits',
    description:
      'Airtable Business + 10K extra AI credits — spreadsheet-database hybrid with Airtable AI, sync integrations, advanced permissions and admin controls.',
    features: ['Business plan features', '+10K AI credits', 'Sync integrations', 'Admin controls'],
  },
  {
    match: 'airtable business',
    category: 'Database',
    domain: 'airtable.com',
    color: '#FCB400',
    tagline: 'Spreadsheet-database with Airtable AI',
    description:
      'Airtable Business — advanced sync, two-way Salesforce/Jira sync, verified data, AI-powered automations and SSO for growing teams.',
    features: ['Two-way sync', 'Verified data', 'Airtable AI', 'SSO + SAML'],
  },
  {
    match: 'airtable',
    category: 'Database',
    domain: 'airtable.com',
    color: '#FCB400',
    tagline: 'No-code database & app platform',
    description:
      'Airtable Team — unlimited bases, Gantt & timeline views, custom branded forms, extensions marketplace and 25K automation runs/month.',
    features: ['Unlimited bases', 'Gantt + timeline', 'Branded forms', '25K automations'],
  },
  {
    match: 'jasper',
    category: 'Writing',
    domain: 'jasper.ai',
    color: '#11A37F',
    tagline: 'AI marketing copy generator',
    description:
      'Jasper AI Pro — generate long-form blog posts, ad copy, emails and product descriptions with brand voice, SEO mode and 50+ templates.',
    features: ['Brand voice training', 'SEO mode', '50+ templates', 'Long-form editor'],
  },
  {
    match: 'vibeflow',
    category: 'AI Coding',
    domain: 'vibeflow.ai',
    color: '#A855F7',
    tagline: 'Vibe coding AI development platform',
    description:
      'Vibeflow Premium — AI-native development environment for building, refining and shipping apps with multi-model AI assistance.',
    features: ['Multi-model AI', 'Live preview', 'Component library', 'One-click deploy'],
  },
  {
    match: 'anything',
    category: 'AI Agent',
    domain: 'anythingllm.com',
    color: '#7C3AED',
    tagline: 'All-in-one AI workspace',
    description:
      'Anything AI — chat with documents, build agents and run any LLM (OpenAI, Anthropic, local) in one unified workspace with full RAG.',
    features: ['Chat with docs', 'Agent builder', 'Any LLM provider', 'Built-in RAG'],
  },
  {
    match: 'coderabbit',
    category: 'Dev Tools',
    domain: 'coderabbit.ai',
    color: '#FF6B35',
    tagline: 'AI code reviewer for pull requests',
    description:
      'CodeRabbit Pro — AI code reviews on every PR with line-by-line suggestions, security checks, test coverage analysis and learning from your codebase.',
    features: ['AI PR reviews', 'Security scanning', 'Test coverage', 'Learns your codebase'],
  },
  {
    match: 'codecrafters',
    category: 'Learning',
    domain: 'codecrafters.io',
    color: '#000000',
    tagline: 'Build Redis, Git, Docker from scratch',
    description:
      'CodeCrafters — learn by building real things. Implement your own Redis, Git, Docker, SQLite, BitTorrent and more in 20+ languages with automated grading.',
    features: ['Build from scratch', '20+ languages', 'Automated grading', 'Real-world systems'],
  },
  {
    match: 'prompt drive',
    category: 'AI Tools',
    domain: 'promptdrive.ai',
    color: '#6366F1',
    tagline: 'Prompt library & team collaboration',
    description:
      'PromptDrive — central library to organise, version, share and test prompts across GPT, Claude and Gemini. Built for AI-first teams.',
    features: ['Prompt versioning', 'Multi-model testing', 'Team workspaces', 'Variables & chains'],
  },
  {
    match: 'slite',
    category: 'Knowledge Base',
    domain: 'slite.com',
    color: '#3B5BFE',
    tagline: 'AI-powered company wiki',
    description:
      'Slite — simple, fast knowledge base with Ask (AI Q&A across your docs), templates, doc verification and easy team collaboration.',
    features: ['AI Q&A (Ask)', 'Doc verification', 'Templates', 'Fast & minimal'],
  },
  {
    match: 'sllite',
    category: 'Knowledge Base',
    domain: 'slite.com',
    color: '#3B5BFE',
    tagline: 'AI-powered company wiki (Premium)',
    description:
      'Slite Premium — advanced controls, analytics, integrations and priority support on top of the Standard knowledge base features.',
    features: ['Everything in Standard', 'Advanced analytics', 'Priority support', 'Premium integrations'],
  },
  {
    match: 'otter',
    category: 'Meetings',
    domain: 'otter.ai',
    color: '#1A87FB',
    tagline: 'AI meeting transcription & notes',
    description:
      'Otter Pro — live meeting transcripts on Zoom/Meet/Teams, AI summaries, action items, custom vocabulary and 1,200 transcription minutes/month.',
    features: ['Live transcription', 'AI summaries', 'Action items', '1,200 mins/month'],
  },
  {
    match: 'headliner',
    category: 'Video',
    domain: 'headliner.app',
    color: '#FF6B35',
    tagline: 'Turn audio into shareable videos',
    description:
      'Headliner Pro — automatically turn podcasts and audio into animated videos with waveforms, captions and transitions for social media.',
    features: ['Audiogram videos', 'Auto captions', 'Animated waveforms', 'Social-ready exports'],
  },
  {
    match: 'raycast',
    category: 'Productivity',
    domain: 'raycast.com',
    color: '#FF6363',
    tagline: 'Spotlight replacement with AI & extensions',
    description:
      'Raycast Pro — supercharged launcher for Mac with AI chat (GPT-4o, Claude), 1,500+ extensions, custom AI commands, cloud sync and themes.',
    features: ['Raycast AI built-in', '1,500+ extensions', 'Cloud sync', 'Custom AI commands'],
  },
  {
    match: 'windsurf',
    category: 'AI Coding',
    domain: 'windsurf.com',
    color: '#06B6D4',
    tagline: 'Agentic AI code editor by Codeium',
    description:
      'Windsurf Pro — first agentic IDE with Cascade (multi-file AI edits), Supercomplete autocomplete, context awareness and Claude/GPT-4o models.',
    features: ['Cascade AI agent', 'Multi-file edits', 'Supercomplete', 'Claude + GPT-4o'],
  },
  {
    match: 'webflow',
    category: 'Web Builder',
    domain: 'webflow.com',
    color: '#146EF5',
    tagline: 'Visual web design & CMS',
    description:
      'Webflow Business — visual web design platform with CMS (10K items), 1M monthly visits, advanced SEO controls and team collaboration.',
    features: ['Visual designer', 'CMS (10K items)', '1M visits/mo', 'Advanced SEO'],
  },
  { match: 'gumloop', category: 'Automation', domain: 'gumloop.com', color: '#000000',
    tagline: 'No-code AI workflow automation',
    description: 'Gumloop Starter — visual drag-and-drop builder for AI workflows. Automate data extraction, scraping, content generation and multi-step LLM pipelines.',
    features: ['Drag-and-drop AI flows', '100+ integrations', 'Scheduled runs', 'Team workspaces'] },
  { match: 'tilda', category: 'Web Builder', domain: 'tilda.cc', color: '#FFB81C',
    tagline: 'Visual website & landing page builder',
    description: 'Tilda Personal — block-based website builder with 550+ pre-designed blocks, custom domain, Zero Block designer and built-in SEO.',
    features: ['550+ design blocks', 'Custom domain', 'Built-in SEO', 'Zero Block designer'] },
  { match: 'slidebean', category: 'Presentations', domain: 'slidebean.com', color: '#00B8D9',
    tagline: 'AI-powered pitch deck builder',
    description: 'Slidebean Starter — AI generates investor-ready pitch decks, business plans and financial models from your content. Used by 500K+ startups.',
    features: ['AI deck generation', 'Pitch templates', 'Financial models', 'Brand themes'] },
  { match: 'dreamlit', category: 'AI Tools', domain: 'dreamlit.ai', color: '#A855F7',
    tagline: 'AI app builder for makers',
    description: 'Dreamlit Pro — build and deploy AI-powered web apps without code. Combine LLMs, custom UI and data sources in minutes.',
    features: ['AI app builder', 'Multi-model LLMs', 'Instant deploy', 'Custom UI'] },
  { match: 'speechify', category: 'Voice AI', domain: 'speechify.com', color: '#1F8FFA',
    tagline: 'AI text-to-speech & speed reader',
    description: 'Speechify Premium — listen to any text in 200+ ultra-realistic AI voices, 30+ languages, with HD voices, OCR for images and speed up to 4.5x.',
    features: ['200+ HD AI voices', '30+ languages', 'OCR scanning', 'Up to 4.5x speed'] },
  { match: 'murf', category: 'Voice AI', domain: 'murf.ai', color: '#7C3AED',
    tagline: 'Studio-quality AI voiceovers',
    description: 'Murf AI — generate professional voiceovers in 120+ voices across 20+ languages with voice cloning, time-sync to video and full studio editor.',
    features: ['120+ AI voices', '20+ languages', 'Voice cloning', 'Video sync'] },
  { match: 'autodesk', category: 'Creative', domain: 'autodesk.com', color: '#0696D7',
    tagline: 'All Autodesk apps (AutoCAD, Maya, Revit...)',
    description: 'Autodesk All Apps — full access to 30+ design & engineering apps including AutoCAD, Revit, Maya, 3ds Max, Fusion 360, Civil 3D and more.',
    features: ['AutoCAD + Revit', 'Maya + 3ds Max', 'Fusion 360', '30+ pro apps'] },
  { match: 'guideless', category: 'AI Tools', domain: 'guideless.com', color: '#0EA5E9',
    tagline: 'AI software video guide creator',
    description: 'Guideless AI — automatically generate step-by-step software video guides and tutorials from screen recordings, complete with AI voiceover.',
    features: ['Auto video guides', 'AI voiceover', 'Screen capture', 'Multi-language'] },
  { match: 'clickup', category: 'Project Mgmt', domain: 'clickup.com', color: '#7B68EE',
    tagline: 'One app for tasks, docs, goals & chat',
    description: 'ClickUp Enterprise — unlimited projects, dashboards, AI assistant, SSO, advanced permissions and white-labeling for large organisations.',
    features: ['ClickUp AI', 'Unlimited everything', 'SSO + advanced security', 'White-label'] },
  { match: 'questionpro', category: 'Research', domain: 'questionpro.com', color: '#00B8D9',
    tagline: 'Enterprise survey & research platform',
    description: 'QuestionPro Research Suite — advanced survey logic, conjoint analysis, MaxDiff, Van Westendorp pricing and full reporting for market research teams.',
    features: ['Conjoint + MaxDiff', 'Advanced logic', 'Unlimited responses', 'White-label surveys'] },
  { match: 'deepgram', category: 'Voice AI', domain: 'deepgram.com', color: '#13EF93',
    tagline: '$1,200 credits for speech-to-text API',
    description: 'Deepgram — $1,200 in credits for industry-leading speech-to-text, text-to-speech and voice AI APIs with Nova-3 model accuracy and ultra-low latency.',
    features: ['$1,200 credits', 'Nova-3 model', 'Real-time STT', 'Text-to-speech'] },
  { match: 'momen', category: 'No-Code', domain: 'momen.app', color: '#6366F1',
    tagline: 'Build full-stack apps without code',
    description: 'Momen Pro — no-code platform to build production web apps with custom databases, workflows, auth and APIs. Ship in days, not months.',
    features: ['Full-stack no-code', 'Custom database', 'Auth + workflows', 'Custom domain'] },
  { match: 'relay', category: 'Automation', domain: 'relay.app', color: '#FF6B35',
    tagline: 'AI workflow automation with human-in-the-loop',
    description: 'Relay Professional — modern automation platform combining AI agents with human approvals. 100+ integrations, multi-step workflows, team collaboration.',
    features: ['AI + human approvals', '100+ integrations', 'Multi-step flows', 'Team workspaces'] },
  { match: 'full enrich', category: 'Sales', domain: 'fullenrich.com', color: '#22C55E',
    tagline: '1,500 credits for B2B contact enrichment',
    description: 'Full Enrich — 1,500 credits ($80 value) to enrich B2B leads with verified emails, phone numbers and full company data via waterfall providers.',
    features: ['1,500 credits', 'Verified emails', 'Mobile numbers', 'Waterfall enrichment'] },
  { match: 'confluent', category: 'Data', domain: 'confluent.io', color: '#0074A2',
    tagline: '$500 credits for managed Kafka cloud',
    description: 'Confluent Cloud — $500 in credits for fully-managed Apache Kafka with Schema Registry, ksqlDB, connectors and global availability on AWS/GCP/Azure.',
    features: ['$500 cloud credits', 'Managed Kafka', '120+ connectors', 'Multi-cloud'] },
  { match: 'edx', category: 'Learning', domain: 'edx.org', color: '#02262B',
    tagline: 'University courses from Harvard, MIT & more',
    description: 'edX Premium — unlimited access to thousands of university-level courses from Harvard, MIT, Berkeley and 250+ top institutions with verified certificates.',
    features: ['Harvard + MIT courses', 'Verified certificates', 'Professional programs', 'MicroMasters'] },
  { match: 'flutter flow', category: 'No-Code', domain: 'flutterflow.io', color: '#4B39EF',
    tagline: 'Visual Flutter app builder',
    description: 'FlutterFlow — build native iOS & Android apps visually with full Flutter code export, Firebase/Supabase backends and one-click app store deploy.',
    features: ['Native iOS + Android', 'Flutter code export', 'Firebase + Supabase', 'App store deploy'] },
  { match: 'flutterflow', category: 'No-Code', domain: 'flutterflow.io', color: '#4B39EF',
    tagline: 'Visual Flutter app builder',
    description: 'FlutterFlow — build native iOS & Android apps visually with full Flutter code export, Firebase/Supabase backends and one-click app store deploy.',
    features: ['Native iOS + Android', 'Flutter code export', 'Firebase + Supabase', 'App store deploy'] },
  { match: 'pycharm', category: 'Dev Tools', domain: 'jetbrains.com', color: '#21D789',
    tagline: 'JetBrains Python IDE',
    description: 'PyCharm Professional — full-featured Python IDE with smart code completion, web framework support (Django, Flask, FastAPI), database tools and remote dev.',
    features: ['Smart completion', 'Django + Flask + FastAPI', 'Database tools', 'Remote development'] },
  { match: 'datacamp', category: 'Learning', domain: 'datacamp.com', color: '#03EF62',
    tagline: 'Learn data science & AI by doing',
    description: 'DataCamp Premium — 400+ interactive courses, hands-on projects and skill assessments in Python, R, SQL, AI/ML and data engineering.',
    features: ['400+ courses', 'Hands-on projects', 'Skill assessments', 'Career tracks'] },
  { match: 'roboform', category: 'Security', domain: 'roboform.com', color: '#0079FF',
    tagline: 'Password manager & form filler',
    description: 'RoboForm Everywhere — unlimited passwords, secure form filling, multi-device sync, password sharing and emergency access.',
    features: ['Unlimited passwords', 'Form auto-fill', 'Multi-device sync', 'Emergency access'] },
  { match: 'pagemaker', category: 'Marketing', domain: 'pagemaker.io', color: '#A855F7',
    tagline: 'No-code landing page builder',
    description: 'PageMaker Pro — drag-and-drop landing page builder with 100+ templates, A/B testing, custom domains and CRM integrations for marketers.',
    features: ['Drag-and-drop builder', '100+ templates', 'A/B testing', 'CRM integrations'] },
];

// Normalise: lowercase, strip all non-alphanumerics (handles "FlutterFlow" vs
// "flutter flow", "SlLITE" typos, punctuation, multiple spaces, etc.)
function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function metaForTool(name: string): ToolMeta {
  const n = normalise(name);
  const hit = TOOL_META.find((m) => n.includes(normalise(m.match)));
  if (hit) {
    const logo = hit.logo ?? LOGO_OVERRIDES[hit.domain];
    return logo ? { ...hit, logo } : hit;
  }
  // Generic fallback
  return {
    match: '',
    category: 'Subscription',
    domain: '',
    color: '#F26207',
    tagline: 'Premium subscription delivered to your email',
    description:
      'A genuine premium subscription delivered as a private account to your registered email. Full warranty for the entire validity period.',
    features: ['Private account', 'Email delivery', 'Full warranty', 'Instant access'],
  };
}
