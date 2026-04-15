import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { getHomepageContent, recordVisit } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

/* ─── Brand SVG icons ──────────────────────────────────────────────────────── */
function FacebookSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}
function TwitterSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function WhatsAppSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
function YoutubeSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

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
    name: 'Sarah Namuli',
    role: 'Community Leader, Kampala',
    quote: 'SLOGBAA gave me the knowledge and confidence to lead accountability initiatives in my community. The structured courses made complex governance topics accessible.',
    color: '#F58220',
    initials: 'SN',
  },
  {
    name: 'James Okello',
    role: 'Civil Society Member, Gulu',
    quote: 'The certificates I earned through SLOGBAA opened doors in governance advocacy. The platform is intuitive, well-organised, and genuinely impactful.',
    color: '#059669',
    initials: 'JO',
  },
  {
    name: 'Grace Achieng',
    role: 'Trainee, Mbarara',
    quote: 'Progress tracking kept me motivated. I could see exactly how far I had come and what remained. Completing my first course felt like a real achievement.',
    color: '#7c3aed',
    initials: 'GA',
  },
]

const NEWS_ITEMS = [
  {
    date: 'Coming Soon',
    title: 'New Courses on Civic Engagement',
    summary: 'NAC is preparing new courses on community-led governance, accountability, and citizen participation.',
    tag: 'Courses',
  },
  {
    date: 'Coming Soon',
    title: 'Regional Training Workshops',
    summary: 'Live training workshops will complement online courses, bringing trainers and trainees together across Uganda.',
    tag: 'Events',
  },
  {
    date: 'Coming Soon',
    title: 'Platform Updates & Improvements',
    summary: 'Ongoing enhancements including new content formats, mobile improvements, and expanded district coverage.',
    tag: 'Updates',
  },
]

const PARTNER_LOGOS = [
  { name: 'Network for Active Citizens', initials: 'NAC', color: '#F58220' },
  { name: 'Ministry of ICT', initials: 'MoICT', color: '#059669' },
  { name: 'Uganda Communications Commission', initials: 'UCC', color: '#d97706' },
  { name: 'Civil Society Alliance', initials: 'CSA', color: '#7c3aed' },
  { name: 'Community Development Fund', initials: 'CDF', color: '#0d9488' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', SvgIcon: FacebookSvg },
  { label: 'Twitter', href: 'https://twitter.com', SvgIcon: TwitterSvg },
  { label: 'WhatsApp', href: 'https://wa.me/', SvgIcon: WhatsAppSvg },
  { label: 'YouTube', href: 'https://youtube.com', SvgIcon: YoutubeSvg },
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
    --nav-bg: rgba(255,255,255,0.85);
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
    --nav-bg: rgba(9,9,11,0.85);
    --hero-overlay: linear-gradient(90deg, #09090b 0%, rgba(9,9,11,0.9) 35%, rgba(9,9,11,0.4) 65%, transparent 100%);
    --stats-bg: rgba(255,255,255,0.04);
  }

  .slg-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .slg-page { font-family: 'DM Sans', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; scroll-behavior: smooth; }

  .slg-serif { font-family: 'DM Serif Display', Georgia, serif; }

  /* Scrollbar */
  .slg-page ::-webkit-scrollbar { width: 6px; }
  .slg-page ::-webkit-scrollbar-track { background: var(--bg); }
  .slg-page ::-webkit-scrollbar-thumb { background: var(--surface-2); border-radius: 99px; }

  /* Nav */
  .slg-nav {
    position: sticky; top: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 72px;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slg-nav.scrolled {
    height: 64px;
    background: var(--nav-bg);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid var(--border);
  }
  .slg-nav-links { display: flex; align-items: center; gap: 0.5rem; }
  .slg-nav-link {
    position: relative;
    padding: 0.45rem 0.9375rem; border-radius: 10px; font-size: 0.875rem; font-weight: 400;
    color: var(--text-2); text-decoration: none; 
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
  .slg-nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 1rem; right: 1rem;
    height: 1.5px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
  }
  .slg-nav-link:hover { color: var(--orange); background: var(--orange-dim); }
  .slg-nav-link:hover::after { transform: scaleX(1); }
  
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
  }
  .slg-btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,130,32,0.4); }
  .slg-btn-hero-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.75rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 500;
    color: var(--text); background: var(--surface); text-decoration: none;
    border: 1px solid var(--border); transition: border-color 0.15s, background 0.15s;
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

  /* Stories */
  .slg-stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .slg-story-card {
    padding: 2rem; border-radius: 16px; background: var(--bg-2);
    border: 1px solid var(--border); display: flex; flex-direction: column; gap: 1rem;
    transition: border-color 0.2s, transform 0.2s;
  }
  .slg-story-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
  .slg-story-avatar {
    width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-weight: 700; font-size: 0.875rem; color: #fff; flex-shrink: 0;
  }
  .slg-story-quote { font-size: 0.9375rem; color: var(--text-2); line-height: 1.7; font-style: italic; flex: 1; }
  .slg-story-quote::before { content: '\x201C'; font-size: 2rem; line-height: 0; vertical-align: -0.5em; color: var(--orange); margin-right: 0.2rem; font-style: normal; font-family: 'DM Serif Display', Georgia, serif; }
  .slg-story-name { font-size: 0.9375rem; font-weight: 600; color: var(--text); }
  .slg-story-role { font-size: 0.8125rem; color: var(--text-3); }

  /* News */
  .slg-news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
  .slg-news-card {
    padding: 1.5rem; border-radius: 14px; background: var(--bg-2); border: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 0.6rem; transition: border-color 0.2s, transform 0.2s;
  }
  .slg-news-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
  .slg-news-tag {
    display: inline-block; padding: 0.175rem 0.55rem; border-radius: 5px; align-self: flex-start;
    font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--orange); background: var(--orange-dim);
  }
  .slg-news-title { font-size: 1rem; font-weight: 600; color: var(--text); }
  .slg-news-summary { font-size: 0.875rem; color: var(--text-2); line-height: 1.65; flex: 1; }
  .slg-news-date { font-size: 0.75rem; color: var(--text-3); font-weight: 500; }

  /* Partners */
  .slg-partners-row { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; }
  .slg-partner-tile {
    width: 110px; height: 80px; border-radius: 12px; border: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.3rem; background: var(--bg-2); transition: border-color 0.2s, background 0.2s;
  }
  .slg-partner-tile:hover { border-color: var(--border-hover); background: var(--surface); }
  .slg-partner-initials { font-size: 1.0625rem; font-weight: 800; }
  .slg-partner-name { font-size: 0.5rem; color: var(--text-3); text-align: center; line-height: 1.3; max-width: 90px; }

  /* CTA band */
  .slg-cta-band {
    position: relative; padding: clamp(3.5rem, 7vw, 6rem) 2rem; text-align: center;
    overflow: hidden;
    background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245,130,32,0.1) 0%, transparent 65%);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .slg-cta-band-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
    background-image: linear-gradient(var(--border-hover) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-hover) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .slg-cta-title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 300; letter-spacing: -0.025em; color: var(--text); margin-bottom: 1rem; position: relative; }
  .slg-cta-title em { font-style: normal; font-family: 'DM Serif Display', Georgia, serif; color: var(--orange); }
  .slg-cta-text { font-size: 1rem; color: var(--text-2); max-width: 460px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative; }
  .slg-cta-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; position: relative; }

  /* Videos */
  .slg-videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .slg-video-card { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); background: var(--bg-2); transition: border-color 0.2s; }
  .slg-video-card:hover { border-color: var(--border-hover); }
  .slg-video-thumb { aspect-ratio: 16/9; position: relative; }
  .slg-video-thumb iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
  .slg-video-body { padding: 1rem 1.25rem; }
  .slg-video-title { font-size: 0.9375rem; font-weight: 600; color: var(--text); }

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
`

/* ─── Hero with Carousel ──────────────────────────────────────────────────── */
function HeroSection() {
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

        <p className="slg-hero-sub" key={`sub-${current}`}>
          {slide.subtitle}
        </p>

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
          {STATS.map((s) => (
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

/* ─── YouTube helper ─────────────────────────────────────────────────────── */
function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/)
  return m ? m[1] : url
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export function HomePage() {
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
    retry: false,
  })

  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!sessionStorage.getItem('slogbaa-visited')) {
      recordVisit()
      sessionStorage.setItem('slogbaa-visited', '1')
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

        {/* ── Nav ── */}
        <nav className={`slg-nav ${scrolled ? 'scrolled' : ''}`}>
          <Link to="/" className="slg-logo-wrap" title="Go to home">
            <Logo variant="full" size={30} color={theme === 'dark' ? 'white' : 'dark'} />
          </Link>
          <div className="slg-nav-links">
            <a href="#about" className="slg-nav-link">About</a>
            <a href="#features" className="slg-nav-link">Features</a>
            <a href="#how" className="slg-nav-link">How it works</a>
            <a href="#stories" className="slg-nav-link">Stories</a>
            <a href="#news" className="slg-nav-link">News</a>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="slg-theme-toggle"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <Icon icon={theme === 'dark' ? icons.sun : icons.moon} size={18} />
            </button>
            <Link to="/auth/login" className="slg-btn-ghost">Sign in</Link>
            <Link to="/auth/register" className="slg-btn-orange">Register Free</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <HeroSection />

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
        <section className="slg-section" id="stories">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="slg-eyebrow">Impact Stories</span>
            <h2 className="slg-section-title">
              Voices from<br /><em>the community</em>
            </h2>
            <p className="slg-section-desc" style={{ marginTop: '0.875rem' }}>
              How SLOGBAA is transforming civic participation across Uganda.
            </p>
          </div>
          <div className="slg-stories-grid">
            {stories.map((story) => {
              const name = story.authorName || story.name || 'Unknown'
              const role = story.authorRole || story.role || ''
              const quote = story.quoteText || story.quote || ''
              const img = story.imageUrl || null
              const color = story.color || '#F58220'
              const initials = story.initials || name.split(' ').map((n) => n[0]).join('')
              return (
                <article key={name} className="slg-story-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {img ? (
                      <img src={img} alt={name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="slg-story-avatar" style={{ background: color }}>{initials}</div>
                    )}
                    <div>
                      <p className="slg-story-name">{name}</p>
                      <p className="slg-story-role">{role}</p>
                    </div>
                  </div>
                  <p className="slg-story-quote">{quote}</p>
                </article>
              )
            })}
          </div>
        </section>

        <hr className="slg-section-divider" />

        {/* ── Videos ── */}
        <section className="slg-section" id="videos">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="slg-eyebrow">Video Content</span>
            <h2 className="slg-section-title">
              Learn through<br /><em>video</em>
            </h2>
            <p className="slg-section-desc" style={{ marginTop: '0.875rem' }}>
              Watch training videos on governance, accountability, and civic engagement.
            </p>
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
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="slg-eyebrow">News & Updates</span>
            <h2 className="slg-section-title">
              Latest from<br /><em>NAC</em>
            </h2>
          </div>
          <div className="slg-news-grid">
            {newsItems.map((item) => (
              <article key={item.title} className="slg-news-card">
                <span className="slg-news-tag">{item.tag || 'Update'}</span>
                <h3 className="slg-news-title">{item.title}</h3>
                <p className="slg-news-summary">{item.summary}</p>
                <p className="slg-news-date">{item.publishedDate || item.date || ''}</p>
              </article>
            ))}
          </div>
        </section>

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
          <div className="slg-partners-row">
            {partners.map((p) => {
              const name = p.name || 'Partner'
              const logo = p.logoUrl || null
              const color = p.color || '#F58220'
              const initials = p.initials || name.split(' ').map((w) => w[0]).join('').slice(0, 4)
              return logo ? (
                <a key={name} href={p.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" title={name} style={{ textDecoration: 'none' }}>
                  <img src={logo} alt={name} style={{ height: 60, maxWidth: 120, objectFit: 'contain', borderRadius: 10 }} loading="lazy" />
                </a>
              ) : (
                <div key={name} className="slg-partner-tile" title={name}>
                  <span className="slg-partner-initials" style={{ color }}>{initials}</span>
                  <span className="slg-partner-name">{name}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CTA Band ── */}
        <div className="slg-cta-band">
          <div className="slg-cta-band-grid" />
          <h2 className="slg-cta-title">
            Ready to start your<br /><em>learning journey?</em>
          </h2>
          <p className="slg-cta-text">
            Join thousands of citizens building the skills to make a real difference in their communities across Uganda.
          </p>
          <div className="slg-cta-actions">
            <Link to="/auth/register" className="slg-btn-hero-primary">
              Register Free — No credit card
            </Link>
            <Link to="/auth/login" className="slg-btn-hero-secondary">
              Sign in
            </Link>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="slg-footer">
          <div className="slg-footer-inner">
            <div>
              <div style={{ marginBottom: '0.875rem' }}>
                <Logo variant="full" size={28} color="dark" />
              </div>
              <p className="slg-footer-text" style={{ maxWidth: 220 }}>
                NAC&rsquo;s online learning platform for civic leadership and community development across Uganda.
              </p>
            </div>

            <div>
              <h4 className="slg-footer-title">Platform</h4>
              <Link to="/auth/login" className="slg-footer-link">Sign in</Link>
              <Link to="/auth/register" className="slg-footer-link">Register</Link>
              <a href="#features" className="slg-footer-link">Features</a>
              <a href="#how" className="slg-footer-link">How it works</a>
            </div>

            <div>
              <h4 className="slg-footer-title">Explore</h4>
              <a href="#about" className="slg-footer-link">About SLOGBAA</a>
              <a href="#stories" className="slg-footer-link">Impact stories</a>
              <a href="#news" className="slg-footer-link">News & Updates</a>
              <a href="#partners" className="slg-footer-link">Our Partners</a>
            </div>

            <div>
              <h4 className="slg-footer-title">Connect</h4>
              <p className="slg-footer-text" style={{ marginBottom: '0.5rem' }}>support@nac.go.ug</p>
              <p className="slg-footer-text" style={{ marginBottom: '1.25rem' }}>Kampala, Uganda</p>
              <div className="slg-footer-socials">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="slg-social-btn"
                    aria-label={link.label}
                  >
                    <link.SvgIcon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="slg-footer-bottom">
            <p className="slg-copyright">
              &copy; {new Date().getFullYear()} Network for Active Citizens (NAC). All rights reserved.
            </p>
            <p className="slg-copyright">
              SLOGBAA Online Learning Platform
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}