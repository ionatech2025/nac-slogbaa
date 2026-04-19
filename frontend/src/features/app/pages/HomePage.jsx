import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { Navbar } from '../../../shared/components/Navbar.jsx'
import { getHomepageContent, getImpactStats, recordVisit } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'
import { CtaSection } from '../../../shared/components/CtaSection.jsx'
import { Footer } from '../../../shared/components/Footer.jsx'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'



/* ─── Static data ─────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    eyebrow: 'Civic Education Platform',
    title: 'Empowering Active Citizens',
    highlight: 'Through Online Learning',
    subtitle: 'Build your civic leadership skills with structured courses, validated assessments, and recognised certificates.',
    accent: '#F58220',
  },
  {
    eyebrow: 'Learn Your Way',
    title: 'Train at Your Own Pace',
    highlight: 'From Any Device',
    subtitle: 'Access training modules, video content, and downloadable resources. Your progress saves automatically.',
    accent: '#34d399',
  },
  {
    eyebrow: 'Certificates & Recognition',
    title: 'Earn Credentials That',
    highlight: 'Open Doors',
    subtitle: 'Pass assessments, receive downloadable certificates, and have your achievements emailed directly to you.',
    accent: '#a78bfa',
  },
]

const STATS = [
  { value: '500+', label: 'Active Learners' },
  { value: '12', label: 'Courses Available' },
  { value: '95%', label: 'Completion Rate' },
  { value: '8', label: 'Districts Reached' },
]

const FEATURES = [
  {
    icon: '◈',
    title: 'Structured Learning Paths',
    text: 'Sequential modules, rich content blocks, and embedded quizzes that guide trainees from fundamentals to mastery.',
    tag: 'Courses',
  },
  {
    icon: '◉',
    title: 'Assessments & Certificates',
    text: 'Validated quizzes at every milestone. Earn downloadable certificates to showcase your civic leadership skills.',
    tag: 'Certification',
  },
  {
    icon: '◎',
    title: 'Real-time Progress Tracking',
    text: 'Live progress bars, resume-where-you-left-off functionality, and completion dashboards keep you on track.',
    tag: 'Analytics',
  },
  {
    icon: '◐',
    title: 'Resource Library',
    text: 'Policy documents, reading materials, and reference guides — all organised, searchable, and available offline.',
    tag: 'Library',
  },
]

const STEPS = [
  { num: '01', title: 'Register', text: 'Create your free account with your name, email, and district.' },
  { num: '02', title: 'Enroll', text: 'Browse courses and enroll in the ones relevant to your civic role.' },
  { num: '03', title: 'Learn', text: 'Study rich module content at your own pace — progress saves automatically.' },
  { num: '04', title: 'Earn', text: 'Pass module assessments and earn recognised certificates of completion.' },
]

const IMPACT_STORIES = [
  {
    id: 'sarah-namuli',
    name: 'Sarah Namuli',
    location: 'Kampala District',
    region: 'Central Uganda',
    role: 'Community Leader',
    title: 'Leading Accountability from the Frontline',
    preview: 'How one leader used digital tools to monitor local service delivery and improve community outcomes...',
    image: '/sarah_namuli_story_1776248245640.png',
  },
  {
    id: 'james-okello',
    name: 'James Okello',
    location: 'Gulu City',
    region: 'Northern Uganda',
    role: 'Civil Society Advocate',
    title: 'Digital Literacy for Local Governance',
    preview: 'James shares his journey of transitioning from traditional advocacy to data-driven civic engagement...',
    image: '/james_okello_story_1776248275273.png',
  },
  {
    id: 'grace-achieng',
    name: 'Grace Achieng',
    location: 'Mbarara District',
    region: 'Western Uganda',
    role: 'Civic Trainee',
    title: 'Breaking Barriers in Civic Education',
    preview: 'Grace explains how the SLOGBAA platform allowed her to pursue certification despite regional constraints...',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop', // Temporary until rerun
  },
]

const PUBLIC_LIBRARY_RESOURCES = [
  {
    id: 'gov-guide',
    title: 'District Governance Guide',
    tag: 'Report',
    desc: 'Guidelines for effective local administration and community-led district planning.',
    fullDesc: 'The District Governance Guide is a comprehensive manual designed for local council members and administrative staff. It outlines best practices for fiscal transparency, public consultation, and resource allocation to ensure that community needs are prioritized in every policy decision.',
    image: '/governance_guide_cover_1776252013759.png'
  },
  {
    id: 'leadership-101',
    title: 'Civic Leadership 101',
    tag: 'Manual',
    desc: 'Foundation principles for emerging community leaders and grassroots advocates.',
    fullDesc: 'Leadership 101 focuses on the core competencies required to organize and mobilize communities. From conflict resolution to public speaking and strategic planning, this manual serves as a roadmap for anyone looking to make a tangible impact at the local level.',
    image: '/leadership_manual_cover_1776252040723.png'
  },
  {
    id: 'acc-framework',
    title: 'Accountability Framework',
    tag: 'Policy',
    desc: 'Standardized procedures for monitoring and evaluating public service delivery.',
    fullDesc: 'This policy framework provides the technical tools needed to audit local service delivery. It includes standardized reporting templates, data verification protocols, and community monitoring checklists designed to hold local service providers accountable to the citizens.',
    image: '/accountability_framework_cover_1776252057156.png'
  }
]
const NEWS_ITEMS = [
  {
    date: 'April 15, 2024',
    title: 'New Courses on Civic Engagement',
    summary: 'NAC is preparing new courses on community-led governance, accountability, and citizen participation.',
    tag: 'News & Updates',
    slug: 'new-courses-2024',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'
  },
  {
    date: 'April 10, 2024',
    title: 'Regional Training Workshops',
    summary: 'Live training workshops will complement online courses, bringing trainers and trainees together across Uganda.',
    tag: 'Events',
    slug: 'regional-workshops-july',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop'
  },
  {
    date: 'March 28, 2024',
    title: 'Platform Updates & Improvements',
    summary: 'Ongoing enhancements including new content formats, mobile improvements, and expanded district coverage.',
    tag: 'News & Updates',
    slug: 'platform-upgrade-v2',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop'
  },
]

const PARTNER_LOGOS = [
  { name: 'Civil Connections', logoUrl: '/assets/images/logos/CivilConnectionsLogo.png', websiteUrl: 'https://civilconnections.org/' },
  { name: 'UYONET', logoUrl: '/assets/images/logos/uyonet-logo.png', websiteUrl: 'https://uyonet.wordpress.com/' },
  { name: 'ActionAid', logoUrl: '/assets/images/logos/Actionaid_logo.png', websiteUrl: 'https://uganda.actionaid.org/' },
  { name: 'Oxfam', logoUrl: '/assets/images/logos/nac_logo.png', websiteUrl: 'https://nacuganda.org/' },
]



const IN_PERSON_TRAININGS = [
  {
    id: '1',
    title: 'Three (3) Green Democratic Spaces in Yumbe, Mayuge, and Kampala',
    date: 'Monday, July 1, 2024 - 00:00',
    image: '/assets/images/homepage/banner_IMG.jpg',
    slug: 'three-green-democratic-spaces'
  },
  {
    id: '2',
    title: 'The Parish Development Model Monitoring',
    date: 'Monday, June 10, 2024 - 00:00',
    image: '/assets/images/homepage/banner_IMG.jpg',
    slug: 'parish-development-model-monitoring'
  },
  {
    id: '3',
    title: 'The Civil Society Strengthening Academy (CSSA)',
    date: 'Tuesday, June 4, 2024 - 00:00',
    image: '/assets/images/homepage/banner_IMG.jpg',
    slug: 'civil-society-strengthening-academy'
  }
]

/* ─── Global CSS injected once ────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  :root {
    --orange: #F58220;
    --orange-dim: rgba(245,130,32,0.06);
    --orange-glow: rgba(245,130,32,0.15);
    --green: #059669;
    --purple: #7c3aed;
  }

  .slg-page.light-theme {
    --bg: #ffffff;
    --bg-2: #fcfcfd;
    --bg-3: #f9fafb;
    --surface: #ffffff;
    --surface-2: #f3f4f6;
    --border: rgba(0,0,0,0.06);
    --border-hover: rgba(0,0,0,0.12);
    --text: #09090b;
    --text-2: #52525b;
    --text-3: #71717a;
    --nav-bg: #ffffff;
    --hero-overlay: linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.4) 65%, transparent 100%);
    --stats-bg: rgba(255,255,255,0.6);
  }

  .slg-page.dark-theme {
    --bg: #09090b;
    --bg-2: #111115;
    --bg-3: #18181e;
    --surface: #1e1e26;
    --surface-2: #26262f;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.14);
    --text: #f4f4f5;
    --text-2: #a1a1aa;
    --text-3: #52525b;
    --nav-bg: #09090b;
    --hero-overlay: linear-gradient(90deg, #09090b 0%, rgba(9,9,11,0.9) 35%, rgba(9,9,11,0.4) 65%, transparent 100%);
    --stats-bg: rgba(255,255,255,0.04);
  }

  .slg-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .slg-page { font-family: 'DM Sans', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; scroll-behavior: smooth; }
  
  /* Account for sticky nav when scrolling to IDs */
  [id] { scroll-margin-top: 100px; }

  .slg-serif { font-family: 'DM Serif Display', Georgia, serif; }

  /* Scrollbar */
  .slg-page ::-webkit-scrollbar { width: 6px; }
  .slg-page ::-webkit-scrollbar-track { background: var(--bg); }
  .slg-page ::-webkit-scrollbar-thumb { background: var(--surface-2); border-radius: 99px; }

  .slg-btn-ghost {
    padding: 0.45rem 1rem; border-radius: 10px; font-size: 0.875rem; font-weight: 500;
    color: var(--text-2); text-decoration: none; border: 1px solid var(--border);
    transition: all 0.2s ease;
  }
  .slg-btn-ghost:hover { color: var(--text); border-color: var(--border-hover); background: var(--bg-2); transform: translateY(-1px); }
  
  .slg-btn-orange {
    position: relative; overflow: hidden;
    padding: 0.45rem 1.125rem; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
    color: #fff; text-decoration: none; background: var(--orange);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 0 rgba(245,130,32,0);
  }
  .slg-btn-orange:hover {
    background: #FF933A; transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(245,130,32,0.3);
  }
  .slg-btn-orange::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.7s ease;
  }
  .slg-btn-orange:hover::before { left: 140%; }

  .slg-logo-wrap {
    text-decoration: none;
    transition: transform 0.2s ease-in-out;
  }
  .slg-logo-wrap:hover {
    transform: scale(1.03);
  }

  /* In-Person Training Grid */
  .slg-training-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;
  }
  .slg-training-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-training-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: var(--orange-glow); }
  .slg-training-img-wrap { aspect-ratio: 16/10; overflow: hidden; background: var(--bg-3); }
  .slg-training-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .slg-training-card:hover .slg-training-img-wrap img { transform: scale(1.05); }
  .slg-training-content { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
  .slg-training-title { font-size: 1.125rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.75rem; min-height: 3em; }
  .slg-training-title a { color: #0066cc; text-decoration: none; transition: color 0.2s ease; }
  .slg-training-title a:hover { color: var(--orange); }
  .slg-training-date { font-size: 0.875rem; font-style: italic; color: var(--text-2); margin-bottom: 1rem; }
  .slg-link-more { display: inline-flex; align-items: center; gap: 0.375rem; color: var(--orange); font-weight: 600; font-size: 0.875rem; text-decoration: none; }
  .slg-link-more:hover { gap: 0.6rem; }

  .slg-theme-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 9px;
    border: 1px solid var(--border); background: var(--bg-2);
    color: var(--text-2); cursor: pointer; transition: all 0.2s ease;
  }
  .slg-theme-toggle:hover {
    border-color: var(--border-hover); background: var(--surface-2); color: var(--text);
    transform: rotate(8deg);
  }

  /* Hero */
  .slg-hero {
    position: relative; min-height: clamp(660px, 95vh, 920px);
    display: flex; align-items: center; justify-content: flex-start;
    padding: 0 clamp(2rem, 10vw, 8rem); overflow: hidden;
    text-align: left;
  }
  .slg-background-image{
    position:absolute; inset: 0;
    background-image: url('/assets/images/homepage/banner_IMG.jpg');
    background-size: cover;
    background-position: 80% center; 
    background-repeat: no-repeat;
    z-index: 0;
  }
  /* Protecive overlay for text legibility */
  .slg-hero-overlay {
    position: absolute; inset: 0;
    background: var(--hero-overlay);
    z-index: 1;
  }
  .slg-hero-bg {
    position: absolute; inset: 0; pointer-events: none; z-index: 2;
    background: radial-gradient(ellipse 60% 50% at 20% 40%, rgba(245,130,32,0.08) 0%, transparent 100%);
  }
  .slg-hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.03; z-index: 2;
    background-image: linear-gradient(var(--border-hover) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-hover) 1px, transparent 1px);
    background-size: 54px 54px;
  }
  .slg-hero-content {
    position: relative; z-index: 10;
    max-width: 680px; width: 100%;
    display: flex; flex-direction: column; align-items: flex-start;
  }
  .slg-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.35rem 0.875rem; border-radius: 99px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--orange); border: 1px solid rgba(245,130,32,0.35);
    background: rgba(245,130,32,0.1); margin-bottom: 1.75rem;
    animation: slg-fade-up 0.6s ease both;
  }
  .slg-hero-title {
    font-size: clamp(2.75rem, 6.5vw, 4.5rem); font-weight: 300; line-height: 1;
    letter-spacing: -0.03em; color: var(--text); margin-bottom: 1.5rem;
    animation: slg-fade-up 0.6s 0.1s ease both;
  }
  .slg-hero-title em { font-style: normal; color: var(--orange); font-family: 'DM Serif Display', Georgia, serif; display: block; }
  .slg-hero-sub {
    max-width: 520px; font-size: 1.125rem; color: var(--text-2); line-height: 1.7;
    margin-bottom: 3rem;
    animation: slg-fade-up 0.6s 0.2s ease both;
  }
  .slg-hero-actions {
    display: flex; gap: 1rem; justify-content: flex-start; flex-wrap: wrap;
    animation: slg-fade-up 0.6s 0.3s ease both; margin-bottom: 4.5rem;
  }
  .slg-btn-hero-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600;
    color: #fff; background: var(--orange); text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(245,130,32,0.3);
    cursor: pointer;
  }
  .slg-btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,130,32,0.4); }
  .slg-btn-hero-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 500;
    color: var(--text); background: var(--surface); text-decoration: none;
    border: 1px solid var(--border); transition: border-color 0.15s, background 0.15s;
    cursor: pointer;
  }
  .slg-btn-hero-secondary:hover { border-color: var(--border-hover); background: var(--surface-2); }

  /* Stats bar */
  .slg-stats-bar {
    display: flex; gap: 0; flex-wrap: wrap;
    border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    animation: slg-fade-up 0.6s 0.4s ease both; max-width: 600px; width: 100%;
    background: var(--stats-bg); backdrop-filter: blur(12px);
  }
  .slg-stat-item {
    flex: 1; min-width: 120px; padding: 1.25rem 1.5rem; text-align: center;
    border-right: 1px solid var(--border); background: rgba(255,255,255,0.02);
  }
  .slg-stat-item:last-child { border-right: none; }
  .slg-stat-val { font-size: 1.625rem; font-weight: 700; color: var(--orange); display: block; line-height: 1.2; }
  .slg-stat-label { font-size: 0.75rem; color: var(--text-3); margin-top: 0.2rem; display: block; }

  /* Section */
  .slg-section { padding: clamp(3rem, 6vw, 5rem) 2rem; max-width: 1120px; margin: 0 auto; width: 100%; }
  .slg-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--orange); margin-bottom: 0.875rem;
  }
  .slg-eyebrow::before { content: ''; display: block; width: 18px; height: 1.5px; background: var(--orange); border-radius: 99px; }
  .slg-section-title {
    font-size: clamp(1.75rem, 3.5vw, 2.375rem); font-weight: 300; letter-spacing: -0.025em; line-height: 1.2;
    color: var(--text); margin-bottom: 1rem;
  }
  .slg-section-title em { font-style: normal; font-family: 'DM Serif Display', Georgia, serif; }
  .slg-section-desc { font-size: 0.9375rem; color: var(--text-2); line-height: 1.7; max-width: 520px; }

  /* Feature cards */
  .slg-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .slg-feature-card {
    padding: 2rem 1.75rem; background: var(--bg-2);
    transition: background 0.2s;
  }
  .slg-feature-card:hover { background: var(--surface); }
  .slg-feature-icon {
    width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; margin-bottom: 1.25rem;
    background: var(--orange-dim); border: 1px solid rgba(245,130,32,0.2);
    color: var(--orange);
  }
  .slg-feature-tag {
    display: inline-block; padding: 0.15rem 0.55rem; border-radius: 5px;
    font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--orange); background: var(--orange-dim); margin-bottom: 0.625rem;
  }
  .slg-feature-title { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; }
  .slg-feature-text { font-size: 0.875rem; color: var(--text-2); line-height: 1.65; }

  /* How it works */
  .slg-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; position: relative; }
  .slg-step { position: relative; padding-top: 0.5rem; }
  .slg-step-num {
    font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--orange); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .slg-step-num::before { content: ''; flex: 1; height: 1px; background: var(--border); max-width: 40px; }
  .slg-step-title { font-size: 1.125rem; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; }
  .slg-step-text { font-size: 0.875rem; color: var(--text-2); line-height: 1.65; }

  /* Stories Home (Compact) */
  .slg-stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .slg-story-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-story-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  .slg-story-img-wrap { aspect-ratio: 16/10; position: relative; overflow: hidden; background: var(--bg-3); border-bottom: 1px solid var(--border); }
  .slg-story-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .slg-story-card:hover .slg-story-img-wrap img { transform: scale(1.05); }
  
  .slg-story-tag {
    position: absolute; bottom: 1rem; left: 1rem; padding: 0.25rem 0.6rem;
    background: rgba(var(--bg), 0.8); backdrop-filter: blur(8px); border: 1px solid var(--border);
    border-radius: 6px; font-size: 0.65rem; font-weight: 700; color: var(--text);
  }
  .slg-story-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-story-meta { font-size: 0.75rem; font-weight: 700; color: var(--orange); text-transform: uppercase; margin-bottom: 0.5rem; }
  .slg-story-title { font-size: 1.125rem; font-weight: 600; line-height: 1.3; margin-bottom: 0.75rem; color: var(--text); }
  .slg-story-preview { font-size: 0.875rem; color: var(--text-2); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  /* News section cards (matching news listing) */
  .slg-news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
  .slg-news-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-news-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  .slg-news-img { aspect-ratio: 16/10; background: var(--bg-3); overflow: hidden; border-bottom: 1px solid var(--border); }
  .slg-news-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .slg-news-card:hover .slg-news-img img { transform: scale(1.05); }
  .slg-news-card-content { padding: 1.75rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-news-card-tag {
    display: inline-block; padding: 0.25rem 0.65rem; border-radius: 6px;
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--orange); background: var(--orange-dim); margin-bottom: 1rem;
    align-self: flex-start;
  }
  .slg-news-card-title { font-size: 1.125rem; font-weight: 600; line-height: 1.4; color: var(--text); margin-bottom: 0.75rem; }
  .slg-news-card-summary { font-size: 0.875rem; color: var(--text-2); line-height: 1.6; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .slg-news-card-footer { margin-top: auto; padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .slg-news-card-date { font-size: 0.8125rem; color: var(--text-3); display: flex; align-items: center; gap: 0.4rem; }

  /* Videos Home */
  .slg-videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .slg-video-card { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); background: var(--bg-2); transition: border-color 0.2s; }
  .slg-video-card:hover { border-color: var(--border-hover); }
  .slg-video-thumb { aspect-ratio: 16/9; position: relative; }
  .slg-video-thumb iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
  .slg-video-body { padding: 1rem 1.25rem; }
  .slg-video-title { font-size: 0.9375rem; font-weight: 600; color: var(--text); }

  /* Library Home (Compact) */
  .slg-lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
  .slg-lib-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px;
    padding: 1.25rem; display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-lib-card:hover { transform: translateY(-5px); border-color: var(--orange-glow); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  .slg-lib-img-box {
    aspect-ratio: 16/10; border-radius: 12px; overflow: hidden; margin-bottom: 1rem;
    background: var(--bg-3); border: 1px solid var(--border);
  }
  .slg-lib-img-box img { width: 100%; height: 100%; object-fit: cover; }
  .slg-lib-actions { display: flex; gap: 0.5rem; margin-top: auto; padding-top: 1rem; }
  .slg-btn-lib-main {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem;
    padding: 0.5rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700;
    background: var(--orange); color: #fff; text-decoration: none; border: none; cursor: pointer;
  }
  .slg-btn-lib-outline {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem;
    padding: 0.5rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600;
    background: transparent; color: var(--text); border: 1px solid var(--border);
    text-decoration: none; cursor: pointer; transition: all 0.2s;
  }
  .slg-btn-lib-outline:hover { background: var(--bg-2); border-color: var(--text-3); }

  /* Training Home (Compact) */
  .slg-training-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .slg-training-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column; transition: all 0.3s ease;
  }
  .slg-training-card:hover { border-color: var(--orange-glow); transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
  .slg-training-img-wrap { aspect-ratio: 16/9; position: relative; overflow: hidden; background: var(--bg-3); border-bottom: 1px solid var(--border); }
  .slg-training-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .slg-training-card:hover .slg-training-img-wrap img { transform: scale(1.05); }
  .slg-training-content { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
  .slg-training-title { font-size: 1rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.5rem; }
  .slg-training-date { font-size: 0.75rem; color: var(--text-3); font-weight: 500; margin-bottom: 1rem; }

  /* Modal */
  .slg-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .slg-modal-box {
    background: var(--bg); border-radius: 24px; padding: 3rem; max-width: 600px; width: 100%;
    position: relative; border: 1px solid var(--border);
  }
  .slg-modal-close {
    position: absolute; top: 1.5rem; right: 1.5rem; background: var(--bg-2); border: 1px solid var(--border);
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-2);
  }

  /* Footer */
  .slg-footer { background: var(--bg-2); border-top: 1px solid var(--border); padding: 3.5rem 2rem 1.75rem; }
  .slg-footer-inner { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3rem; }
  .slg-footer-title { font-size: 0.8125rem; font-weight: 600; color: var(--text); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .slg-footer-text { font-size: 0.8125rem; color: var(--text-2); line-height: 1.7; }
  .slg-footer-link { display: block; font-size: 0.8125rem; color: var(--text-2); text-decoration: none; padding: 0.25rem 0; transition: color 0.15s; }
  .slg-footer-link:hover { color: var(--text); }
  .slg-social-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface); color: var(--text-2); text-decoration: none;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .slg-social-btn:hover { border-color: var(--border-hover); color: var(--text); background: var(--surface-2); }
  .slg-footer-socials { display: flex; gap: 0.5rem; flex-wrap: wrap; }

  /* Partners Home Scrolling */
  .slg-partners-container {
    width: 100%; overflow: hidden; position: relative;
    padding: 2rem 0;
    mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  }
  .slg-partners-track {
    display: flex; gap: 5rem; width: max-content;
    animation: slg-marquee 40s linear infinite;
  }
  .slg-partners-track:hover { animation-play-state: paused; }

  @keyframes slg-marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 2.5rem)); }
  }

  .slg-partner-link {
    display: flex; align-items: center; justify-content: center;
    position: relative; width: 120px; height: 120px;
    opacity: 0.95; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1; flex-shrink: 0;
  }
  .slg-partner-link:hover {
    opacity: 1; transform: scale(1.15) translateY(-8px);
  }
  .slg-partner-link::before {
    content: ''; position: absolute; inset: 0;
    border: 2px solid var(--orange);
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%; opacity: 0; transform: rotate(-45deg) scale(0.8);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: -1;
  }
  .slg-partner-link:hover::before {
    opacity: 1; transform: rotate(15deg) scale(1);
  }
  .slg-partner-img { height: 54px; width: auto; max-width: 110px; object-fit: contain; }

  .slg-partner-tile {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    padding: 1.5rem; background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 12px; min-width: 140px;
  }
  .slg-partner-initials { font-size: 1.25rem; font-weight: 700; }
  .slg-partner-name { font-size: 0.75rem; color: var(--text-2); font-weight: 600; text-align: center; }

  .slg-footer-bottom {
    max-width: 1120px; margin: 2.5rem auto 0; padding-top: 1.5rem;
    border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
  }
  .slg-copyright { font-size: 0.75rem; color: var(--text-3); }

  /* Divider */
  .slg-divider { border: none; border-top: 1px solid var(--border); }

  /* Animations */
  @keyframes slg-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive nav */
  @media (max-width: 768px) {
    .slg-nav-links .slg-nav-link { display: none; }
    .slg-footer-inner { grid-template-columns: 1fr 1fr; }
    .slg-stats-bar { border-radius: 12px; }
  }

  /* Slide transitions */
  .slg-slide { transition: opacity 0.8s ease; }
  .slg-slide-inactive { opacity: 0; pointer-events: none; position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; }
  .slg-slide-active { opacity: 1; }

  /* About two-col */
  .slg-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  @media (max-width: 720px) { .slg-about-grid { grid-template-columns: 1fr; } }
  .slg-about-visual {
    aspect-ratio: 4/3; border-radius: 20px; border: 1px solid var(--border);
    background: var(--bg-2); display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .slg-about-visual::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,130,32,0.08) 0%, transparent 70%);
  }

  /* Horizontal rule */
  .slg-section-divider { width: 100%; height: 1px; background: var(--border); margin: 0; }

  /* Slide dots */
  .slg-dots { display: flex; gap: 0.5rem; justify-content: flex-start; margin-top: 1.5rem; }
  .slg-dot { width: 6px; height: 6px; border-radius: 99px; border: none; cursor: pointer; transition: all 0.3s ease; padding: 0; }
  .slg-dot-active { width: 24px; background: var(--orange); }
  .slg-dot-inactive { background: var(--bg-3); }
  .slg-dot-inactive:hover { background: var(--text-3); }

  /* Impact Section Styling */
  .slg-impact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    margin-top: 3.5rem;
  }
  @media (max-width: 960px) {
    .slg-impact-grid { grid-template-columns: 1fr; }
  }

  .slg-impact-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  .slg-impact-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 50%, var(--orange-glow) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .slg-impact-card:hover {
    transform: translateY(-8px);
    border-color: var(--orange-glow);
    box-shadow: 0 24px 48px rgba(0,0,0,0.08);
  }
  .slg-impact-card:hover::before { opacity: 1; }

  .slg-impact-icon {
    width: 64px; height: 64px; border-radius: 20px;
    background: var(--orange-dim); border: 1px solid rgba(245,130,32,0.25);
    color: var(--orange); display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; font-size: 1.75rem; position: relative; z-index: 1;
  }
  .slg-impact-val { font-size: 3rem; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 0.5rem; position: relative; z-index: 1; letter-spacing: -0.02em; }
  .slg-impact-label { font-size: 0.9375rem; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; position: relative; z-index: 1; }

  .slg-chart-container {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 2rem;
  }
  .slg-chart-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
  }
  .slg-chart-title { font-size: 1.125rem; font-weight: 700; color: var(--text); }
  .slg-chart-subtitle { font-size: 0.8125rem; color: var(--text-3); }
  
  .slg-rating-strip {
    display: flex; gap: 1rem; align-items: center; justify-content: center;
    padding: 0.75rem 1.25rem; background: var(--surface-2); border-radius: 99px;
    border: 1px solid var(--border); width: fit-content; margin: 0 auto;
  }
  .slg-rating-val { font-size: 1.5rem; font-weight: 800; color: var(--orange); }
  .slg-stars { display: flex; gap: 0.25rem; color: var(--orange); }
  .slg-rating-label { font-size: 0.75rem; font-weight: 600; color: var(--text-3); text-transform: uppercase; }

  .slg-impact-visual {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 2.5rem;
    margin-top: 2.5rem;
  }
  @media (max-width: 960px) {
    .slg-impact-visual { grid-template-columns: 1fr; }
  }

  .slg-pie-legend {
    display: flex; flex-direction: column; gap: 0.75rem; justify-content: center;
  }
  .slg-pie-legend-item {
    display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--text-2);
  }
  .slg-pie-dot { width: 10px; height: 10px; border-radius: 50%; }

  .slg-impact-btn-stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-top: 1.5rem;
  }
`

/* ─── Hero with Carousel ──────────────────────────────────────────────────── */
function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: queryKeys.homepage.impact(),
    queryFn: getImpactStats,
    staleTime: 5 * 60 * 1000,
  })

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = HERO_SLIDES.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(next, 3000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = HERO_SLIDES[current]

  // Dynamic stats
  const dynamicStats = [
    { value: stats ? `${(stats.traineeCount || 0).toLocaleString()}+` : '500+', label: 'Active Learners' },
    { value: stats ? (stats.coursesAvailable || 0) : '12', label: 'Courses Available' },
    { value: stats ? `${Math.round(((stats.coursesDone || 0) / (stats.traineeCount || 1)) * 100)}%` : '95%', label: 'Completion Rate' },
    { value: stats ? (stats.districtsCount || 0) : '8', label: 'Districts Reached' },
  ]

  return (
    <section
      className="slg-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slg-background-image" />
      <div className="slg-hero-overlay" />
      <div className="slg-hero-bg" />
      <div className="slg-hero-grid" />

      <div className="slg-hero-content">
        <div className="slg-hero-eyebrow" key={`eyebrow-${current}`}>
          {slide.eyebrow}
        </div>

        <h1 className="slg-hero-title slg-serif" key={`title-${current}`}>
          {slide.title}{' '}
          <em>{slide.highlight}</em>
        </h1>

        <h2 className="slg-hero-sub" key={`sub-${current}`} style={{ fontSize: '1.25rem', fontWeight: 400, opacity: 0.9 }}>
          {slide.subtitle}
        </h2>

        <div className="slg-hero-actions">
          <Link to="/auth/register" className="slg-btn-hero-primary">
            Get Started — It&apos;s Free
          </Link>
          <Link to="/auth/login" className="slg-btn-hero-secondary">
            Sign In
          </Link>
        </div>

        {/* Stats strip */}
        <div className="slg-stats-bar">
          {dynamicStats.map((s) => (
            <div key={s.label} className="slg-stat-item">
              <span className="slg-stat-val">{s.value}</span>
              <span className="slg-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Slide dots */}
        <div className="slg-dots" style={{ marginTop: '2.5rem' }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`slg-dot ${i === current ? 'slg-dot-active' : 'slg-dot-inactive'}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ImpactSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.homepage.impact(),
    queryFn: getImpactStats,
    staleTime: 5 * 60 * 1000,
  })

  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (isLoading) return null // Or a shimmer

  // Prepare chart data
  const genderData = [
    { name: 'Male', value: stats?.demographicsByGender?.MALE || 0, color: '#F58220' },
    { name: 'Female', value: stats?.demographicsByGender?.FEMALE || 0, color: '#34d399' },
  ]

  const districtData = Object.entries(stats?.demographicsByDistrict || {}).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value).slice(0, 5)

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
      <div className="slg-stars">
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            icon={i < full ? icons.star : (i === full && half ? icons.starHalf : icons.starOutline)}
            size={18}
            fill={i < full || (i === full && half) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="slg-section" id="impact">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="slg-eyebrow" style={{ justifyContent: 'center' }}>Our Global Reach</span>
        <h2 className="slg-section-title" style={{ textAlign: 'center' }}>
          Real Impact, <em>Quantified</em>
        </h2>
        <p className="slg-section-desc" style={{ margin: '0.875rem auto 0', textAlign: 'center' }}>
          Tracking our progress as we empower citizens through civic education and leadership training across the region.
        </p>
      </div>

      <div className="slg-impact-grid">
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◈</div>
          <div className="slg-impact-val">{(stats?.coursesDone || 0).toLocaleString()}+</div>
          <div className="slg-impact-label">Courses Completed</div>
        </div>
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◉</div>
          <div className="slg-impact-val">{(stats?.certificatesIssued || 0).toLocaleString()}</div>
          <div className="slg-impact-label">Certificates Issued</div>
        </div>
        <div className="slg-impact-card">
          <div className="slg-impact-icon">◎</div>
          <div className="slg-impact-val">{(stats?.traineeCount || 0).toLocaleString()}</div>
          <div className="slg-impact-label">Active Trainees</div>
        </div>
      </div>

      <div className="slg-impact-visual">
        {/* District Demographics */}
        <div className="slg-chart-container">
          <div className="slg-chart-header">
            <div>
              <h3 className="slg-chart-title">Trainee Distribution</h3>
              <p className="slg-chart-subtitle">Top 5 Districts by Enrollment</p>
            </div>
            <div className="slg-impact-icon" style={{ width: 40, height: 40, fontSize: '1rem', marginBottom: 0 }}>◓</div>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#a1a1aa' : '#52525b', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    background: isDark ? '#1e1e26' : '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#F58220" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Demographics */}
        <div className="slg-chart-container">
          <div className="slg-chart-header">
            <div>
              <h3 className="slg-chart-title">Gender Inclusivity</h3>
              <p className="slg-chart-subtitle">Commitment to Gender Balanced Learning</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: 300 }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#1e1e26' : '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="slg-pie-legend">
              {genderData.map((entry) => (
                <div key={entry.name} className="slg-pie-legend-item">
                  <div className="slg-pie-dot" style={{ background: entry.color }} />
                  <span style={{ fontWeight: 600 }}>{entry.name}:</span>
                  <span>{((entry.value / (stats?.traineeCount || 1)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="slg-impact-grid" style={{ marginTop: '2.5rem' }}>
        <div className="slg-chart-container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <span className="slg-impact-label" style={{ marginBottom: '1.5rem' }}>Trainee Satisfaction</span>
          <div className="slg-rating-strip">
            <span className="slg-rating-val">{(stats?.avgTraineeRating || 0).toFixed(1)}</span>
            {renderStars(stats?.avgTraineeRating || 0)}
          </div>
          <p className="slg-chart-subtitle" style={{ marginTop: '1rem' }}>Overall Course Rating from Trainees</p>
        </div>
        <div className="slg-chart-container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <span className="slg-impact-label" style={{ marginBottom: '1.5rem' }}>Admin Evaluation</span>
          <div className="slg-rating-strip">
            <span className="slg-rating-val">{(stats?.avgAdminRating || 0).toFixed(1)}</span>
            {renderStars(stats?.avgAdminRating || 0)}
          </div>
          <p className="slg-chart-subtitle" style={{ marginTop: '1rem' }}>Internal Academic Performance Quality</p>
        </div>
        <div className="slg-impact-card" style={{ background: 'var(--orange)', color: '#fff', border: 'none', justifyContent: 'flex-start' }}>
          <h3 className="slg-serif" style={{ fontSize: '1.625rem', marginBottom: '0.5rem', fontWeight: 800 }}>Join the Movement</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>Empowering citizens through knowledge and action.</p>
          <div className="slg-impact-btn-stack">
            <Link to="/auth/register" className="slg-btn-hero-primary" style={{ background: '#fff', color: 'var(--orange)', border: 'none', width: '100%', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
              Register Now
            </Link>
            <Link to="/public/courses-view" className="slg-btn-hero-secondary" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', width: '100%', textAlign: 'center', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── YouTube helper ─────────────────────────────────────────────────────── */
function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/)
  return m ? m[1] : url
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export function HomePage() {
  const [modalResource, setModalResource] = useState(null)
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
    retry: false,
  })

  const { theme } = useTheme()

  useEffect(() => {
    if (!sessionStorage.getItem('slogbaa-visited')) {
      // recordVisit()
      sessionStorage.setItem('slogbaa-visited', '1')
    }

    // Handle cross-page hash scroll
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [])

  const stories = cms?.stories?.length ? cms.stories : IMPACT_STORIES
  const newsItems = cms?.news?.length ? cms.news : NEWS_ITEMS
  const partners = cms?.partners?.length ? cms.partners : PARTNER_LOGOS
  const cmsVideos = cms?.videos?.length ? cms.videos : null

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className={`slg-page ${theme}-theme`}>
        <Navbar />

        {/* ── Hero ── */}
        <HeroSection />

        <hr className="slg-section-divider" />

        {/* ── Impact ── */}
        <ImpactSection />

        <hr className="slg-section-divider" />

        {/* ── About ── */}
        <section className="slg-section" id="about">
          <div className="slg-about-grid">
            <div>
              <span className="slg-eyebrow">About SLOGBAA</span>
              <h2 className="slg-section-title">
                Putting Communities<br /><em>Before Self</em>
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1.25rem' }}>
                The <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Network for Active Citizens (NAC)</strong> is a civic engagement initiative dedicated to building community capacity across Uganda. We empower citizens with the knowledge, skills, and tools to actively participate in governance and community development.
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.75, marginTop: '1rem' }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>SLOGBAA</strong> extends this mission into the digital space — structured courses, rigorous assessments, and recognised certification for civic leaders, civil society members, and engaged citizens at every level.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/auth/register" className="slg-btn-hero-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                  Start learning
                </Link>

                <a href="#features" className="slg-btn-hero-secondary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                  Explore features
                </a>
                <Link to="/auth/login" className="slg-btn-hero-primary" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                  Continue Learning
                </Link>
              </div>
            </div>

            <div className="slg-about-visual">
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Logo variant="icon" size={72} />
                <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-3)', fontStyle: 'italic' }}>
                  Empowering communities through learning
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── Features ── */}
        <section className="slg-section" id="features">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="slg-eyebrow">Platform Features</span>
            <h2 className="slg-section-title">
              Everything you need<br /><em>to learn and grow</em>
            </h2>
          </div>
          <div className="slg-feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="slg-feature-card">
                <div className="slg-feature-icon">{f.icon}</div>
                <span className="slg-feature-tag">{f.tag}</span>
                <h3 className="slg-feature-title">{f.title}</h3>
                <p className="slg-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── How it works ── */}
        <section className="slg-section" id="how">
          <div style={{ marginBottom: '3rem' }}>
            <span className="slg-eyebrow">How it works</span>
            <h2 className="slg-section-title">
              Four steps to<br /><em>civic leadership</em>
            </h2>
          </div>
          <div className="slg-steps">
            {STEPS.map((step) => (
              <div key={step.num} className="slg-step">
                <div className="slg-step-num">{step.num}</div>
                <h3 className="slg-step-title">{step.title}</h3>
                <p className="slg-step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── Impact Stories ── */}
        <section className="slg-section slg-bg-3" id="stories">
          <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="slg-eyebrow">Impact Stories</span>
              <h2 className="slg-section-title">
                Voices from<br /><em>the community</em>
              </h2>
              <p className="slg-section-desc" style={{ marginTop: '0.875rem' }}>
                Real citizen leaders sharing their journey of transformation through civic education.
              </p>
            </div>
            <Link to="/stories" className="slg-btn-ghost">View All Stories</Link>
          </div>

          <div className="slg-stories-grid">
            {IMPACT_STORIES.map((story) => (
              <article key={story.id} className="slg-story-card">
                <div className="slg-story-img-wrap">
                  <img src={story.image} alt={story.name} loading="lazy" />
                  <div className="slg-story-tag">{story.location}</div>
                </div>
                <div className="slg-story-content">
                  <header>
                    <p className="slg-story-meta">{story.role} — {story.region}</p>
                    <h3 className="slg-story-title">{story.title}</h3>
                  </header>
                  <p className="slg-story-preview">{story.preview}</p>
                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                    <Link to={`/stories/${story.id}`} className="slg-link-more">
                      Read the full story <Icon icon={icons.arrowRight} size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── Videos ── */}
        <section className="slg-section" id="videos">
          <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="slg-eyebrow">Video Content</span>
              <h2 className="slg-section-title">
                Learn through<br /><em>video</em>
              </h2>
              <p className="slg-section-desc" style={{ marginTop: '0.875rem' }}>
                Watch general videos on governance, accountability, civic engagement, and more.
              </p>
            </div>
            <Link to="/videos" className="slg-btn-ghost">More Videos</Link>
          </div>
          <div className="slg-videos-grid">
            {(cmsVideos || [
              { title: 'Introduction to Civic Leadership', youtubeUrl: 'https://www.youtube.com/watch?v=avrQXoBConA' },
              { title: 'Community Governance Basics', youtubeUrl: 'https://www.youtube.com/watch?v=fWUANWrSHSw' },
              { title: 'Accountability & Transparency', youtubeUrl: 'https://www.youtube.com/watch?v=9Xk3H0JdUTY' },
            ]).map((v) => {
              const vid = extractYoutubeId(v.youtubeUrl)
              return (
                <div key={v.title} className="slg-video-card">
                  <div className="slg-video-thumb">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="slg-video-body">
                    <h3 className="slg-video-title">{v.title}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── News ── */}
        <section className="slg-section" id="news">
          <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="slg-eyebrow">News & Updates</span>
              <h2 className="slg-section-title">
                Latest from<br /><em>SLOGBAA</em>
              </h2>
            </div>
            <Link to="/news-and-updates" className="slg-btn-ghost">View More</Link>
          </div>
          <div className="slg-news-grid">
            {newsItems.map((item) => (
              <article key={item.title} className="slg-news-card">
                <div className="slg-news-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="slg-news-card-content">
                  <span className="slg-news-card-tag">{item.tag || 'Update'}</span>
                  <h3 className="slg-news-card-title">{item.title}</h3>
                  <p className="slg-news-card-summary">{item.summary}</p>

                  <div className="slg-news-card-footer">
                    <p className="slg-news-card-date">
                      <Icon icon={item.tag === 'Events' ? icons.calendar : icons.fileText} size={14} />
                      {item.date}
                    </p>
                    <Link to={`/news-and-updates/${item.slug}`} className="slg-link-more">
                      See Details <Icon icon={icons.arrowRight} size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── In-Person Training Section ── */}
        <section id="inperson" className="slg-section slg-bg-2">
          <div className="slg-container">
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="slg-eyebrow">Training & Workshops</span>
                <h2 className="slg-section-title">In-Person <em>Training</em></h2>
              </div>
              <Link to="/inperson-training" className="slg-btn-ghost">View All Trainings</Link>
            </div>

            <div className="slg-training-grid">
              {IN_PERSON_TRAININGS.map(training => (
                <div key={training.id} className="slg-training-card">
                  <div className="slg-training-img-wrap">
                    <img src={training.image} alt={training.title} loading="lazy" />
                  </div>
                  <div className="slg-training-content">
                    <h3 className="slg-training-title">
                      <Link to={`/inperson-training/${training.slug}`}>{training.title}</Link>
                    </h3>
                    <p className="slg-training-date">{training.date}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <Link to={`/inperson-training/${training.slug}`} className="slg-link-more">
                        Read More <Icon icon={icons.arrowRight} size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="slg-section-divider" />

        <section id="public-library" className="slg-section slg-bg-3">
          <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="slg-eyebrow">Resource Center</span>
              <h2 className="slg-section-title">Public <em>Library</em></h2>
              <p className="slg-section-desc">
                Fully open-access policy guides, administrative manuals, and governance research for all citizens.
              </p>
            </div>
            <Link to="/public-library" className="slg-btn-ghost">Enter Public Library</Link>
          </div>

          <div className="slg-lib-grid">
            {PUBLIC_LIBRARY_RESOURCES.map(res => (
              <article key={res.id} className="slg-lib-card">
                <div className="slg-lib-img-box">
                  <img src={res.image} alt={res.title} />
                </div>
                <span className="slg-feature-tag">{res.tag}</span>
                <h3 className="slg-feature-title">{res.title}</h3>
                <p className="slg-feature-text">{res.desc}</p>
                <div className="slg-lib-actions">
                  <button onClick={() => setModalResource(res)} className="slg-btn-lib-outline">View More</button>
                  <a href="#" className="slg-btn-lib-main" onClick={e => e.preventDefault()}>
                    Download <Icon icon={icons.download} size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Modal for Library Details */}
        {modalResource && (
          <div className="slg-modal-overlay" onClick={() => setModalResource(null)}>
            <div className="slg-modal-box" onClick={e => e.stopPropagation()}>
              <button className="slg-modal-close" onClick={() => setModalResource(null)}>
                <Icon icon={icons.close} size={16} />
              </button>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={modalResource.image} alt="" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span className="slg-feature-tag">{modalResource.tag}</span>
                  <h2 className="slg-section-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{modalResource.title}</h2>
                  <p className="slg-article-p" style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
                    {modalResource.fullDesc}
                  </p>
                  <div style={{ marginTop: '2.5rem' }}>
                    <button className="slg-btn-hero-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Download Documentation <Icon icon={icons.download} size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <hr className="slg-section-divider" />

        {/* ── Partners ── */}
        <section className="slg-section" id="partners">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="slg-eyebrow" style={{ justifyContent: 'center' }}>Our Partners</span>
            <h2 className="slg-section-title" style={{ textAlign: 'center' }}>
              Working together<br /><em>for change</em>
            </h2>
            <p className="slg-section-desc" style={{ margin: '0.875rem auto 0', textAlign: 'center' }}>
              Collaborating with government, civil society, and development partners to deliver impactful civic education.
            </p>
          </div>
          <div className="slg-partners-container" style={{ marginTop: '1rem' }}>
            <div className="slg-partners-track">
              {[...partners, ...partners, ...partners].map((p, idx) => {
                const name = p.name || 'Partner'
                const logo = p.logoUrl || null
                const color = p.color || 'var(--orange)'
                const initials = p.initials || name.split(' ').map((w) => w[0]).join('').slice(0, 4)

                if (logo) {
                  return (
                    <a key={`${name}-${idx}`} href={p.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" className="slg-partner-link" title={name}>
                      <img src={logo} alt={name} className="slg-partner-img" loading="lazy" />
                    </a>
                  )
                }

                return (
                  <div key={`${name}-${idx}`} className="slg-partner-tile" title={name}>
                    <span className="slg-partner-initials" style={{ color }}>{initials}</span>
                    <span className="slg-partner-name">{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Band ── */}
        <CtaSection />

        {/* ── Footer ── */}
        <Footer />

      </div>
    </>
  )
}