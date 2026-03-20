import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon, icons } from '../../../shared/icons.jsx'
import { Logo } from '../../../shared/components/Logo.jsx'
import { getHomepageContent, recordVisit } from '../../../api/homepage.js'
import { queryKeys } from '../../../lib/query-keys.js'

// ─── Social-media SVG icons (brand icons not in Lucide) ────────────
function FacebookSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}
function TwitterSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function WhatsAppSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
function YoutubeSvg(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

// ─── Data constants ────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    title: 'Empowering Active Citizens Through Online Learning',
    subtitle: 'SLOGBAA is the Network for Active Citizens\u2019 online learning platform. Build your civic leadership skills with structured courses, assessments, and certificates.',
    bg: [
      'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(245,130,32,0.22) 0%, transparent 70%)',
      'linear-gradient(160deg, #050a15 0%, #0a1628 25%, #1e3a5f 50%, #0a1628 75%, #050a15 100%)',
    ].join(', '),
    accent: '#F58220',
  },
  {
    title: 'Learn at Your Own Pace, Anywhere',
    subtitle: 'Access training modules, video content, and downloadable resources from any device. Your progress is saved automatically so you never lose your place.',
    bg: [
      'radial-gradient(ellipse 60% 50% at 60% 40%, rgba(5,150,105,0.20) 0%, transparent 70%)',
      'linear-gradient(160deg, #050a15 0%, #052e16 25%, #14532d 50%, #052e16 75%, #050a15 100%)',
    ].join(', '),
    accent: '#34d399',
  },
  {
    title: 'Earn Recognized Certificates',
    subtitle: 'Complete courses, pass assessments, and receive certificates of civic leadership. Your achievements are downloadable and automatically emailed to you.',
    bg: [
      'radial-gradient(ellipse 60% 50% at 40% 45%, rgba(124,58,237,0.20) 0%, transparent 70%)',
      'linear-gradient(160deg, #050a15 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #050a15 100%)',
    ].join(', '),
    accent: '#a78bfa',
  },
]

const FEATURES = [
  {
    icon: icons.learning,
    bg: 'linear-gradient(135deg, #F58220 0%, #e07318 100%)',
    title: 'Structured Learning Paths',
    text: 'Courses with sequential modules, rich content blocks, and embedded quizzes that guide trainees from basics to mastery.',
  },
  {
    icon: icons.blockActivity,
    bg: 'linear-gradient(135deg, #00A651 0%, #008a42 100%)',
    title: 'Assessments & Certificates',
    text: 'Validated quizzes at every milestone. Earn certificates on completion to showcase your civic leadership skills.',
  },
  {
    icon: icons.viewList,
    bg: 'linear-gradient(135deg, #F58220 0%, #e07318 100%)',
    title: 'Progress Tracking',
    text: 'Track your learning journey with real-time progress bars, resume-where-you-left-off, and completion dashboards.',
  },
  {
    icon: icons.download,
    bg: 'linear-gradient(135deg, #00A651 0%, #F58220 100%)',
    title: 'Resource Library',
    text: 'Access policy documents, reading materials, and reference guides — all organized and searchable.',
  },
]

const STEPS = [
  { title: 'Register', text: 'Create your free trainee account with your name, email, and district.' },
  { title: 'Enroll', text: 'Browse available courses and enroll in the ones relevant to your civic role.' },
  { title: 'Learn', text: 'Study rich module content at your own pace with progress saved automatically.' },
  { title: 'Earn', text: 'Pass the module quizzes and earn certificates of completion.' },
]

const IMPACT_STORIES = [
  {
    name: 'Sarah Namuli',
    role: 'Community Leader, Kampala',
    quote: 'SLOGBAA gave me the knowledge and confidence to lead accountability initiatives in my community. The structured courses made complex governance topics accessible.',
    color: '#F58220',
  },
  {
    name: 'James Okello',
    role: 'Civil Society Member, Gulu',
    quote: 'As a civil society member, the certificates I earned through SLOGBAA opened doors for me in governance advocacy. The platform is intuitive and well-organized.',
    color: '#059669',
  },
  {
    name: 'Grace Achieng',
    role: 'Trainee, Mbarara',
    quote: 'The progress tracking kept me motivated. I could see exactly how far I had come and what remained. Completing my first course felt like a real achievement.',
    color: '#7c3aed',
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
    summary: 'Ongoing enhancements to the learning experience including new content formats, mobile improvements, and more.',
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
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookSvg },
  { label: 'Twitter', href: 'https://twitter.com', Icon: TwitterSvg },
  { label: 'WhatsApp', href: 'https://wa.me/', Icon: WhatsAppSvg },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeSvg },
]

// ─── Styles ────────────────────────────────────────────────────────

const s = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)' },

  // Nav
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 2rem', color: 'var(--text-main, #1A1A1B)', position: 'sticky', top: 0, zIndex: 100,
  },
  navRight: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  navLink: {
    padding: '0.45rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 500,
    textDecoration: 'none', transition: 'background 0.2s ease',
  },

  // Hero carousel
  carousel: {
    position: 'relative', height: 'clamp(380px, 55vh, 560px)', overflow: 'hidden',
  },
  slide: (isActive) => ({
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: isActive ? 1 : 0, transition: 'opacity 0.9s ease-in-out', pointerEvents: isActive ? 'auto' : 'none',
  }),
  slideInner: {
    position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '2rem',
    textAlign: 'center', color: '#fff',
  },
  slideTitle: {
    margin: '0 0 1.25rem', fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
    fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em',
  },
  slideSub: {
    margin: '0 auto 2rem', maxWidth: 600, fontSize: '1.0625rem', lineHeight: 1.7, opacity: 0.9,
  },
  slideActions: { display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem',
    borderRadius: 14, fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', border: 'none', cursor: 'pointer',
  },
  ctaPrimary: { background: 'var(--primary-orange, #F58220)', color: '#fff', boxShadow: '0 4px 20px rgba(245,130,32,0.35)' },
  ctaSecondary: {
    background: 'rgba(255,255,255,0.08)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
  },
  dots: {
    position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', gap: '0.5rem', zIndex: 2,
  },
  dot: (active) => ({
    width: active ? 28 : 10, height: 10, borderRadius: 999,
    background: active ? '#fff' : 'rgba(255,255,255,0.4)',
    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
    padding: '17px 0', backgroundClip: 'content-box',
  }),

  // Section defaults
  section: { padding: 'clamp(2.5rem, 5vw, 4rem) 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' },
  sectionTag: {
    display: 'block', margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slogbaa-blue)',
  },
  sectionTitle: {
    margin: '0 0 2rem', fontSize: 'clamp(1.375rem, 3vw, 1.75rem)', fontWeight: 700,
    color: 'var(--slogbaa-text)', textAlign: 'center',
  },
  sectionDesc: {
    margin: '-1rem auto 2.5rem', maxWidth: 600, textAlign: 'center',
    fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--slogbaa-text-muted)',
  },

  // About
  aboutGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem', alignItems: 'center',
  },
  aboutText: { fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--slogbaa-text)' },
  aboutImagePlaceholder: {
    aspectRatio: '4/3', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(245,130,32,0.08) 0%, rgba(0,166,81,0.08) 100%)',
    border: '1px solid var(--slogbaa-glass-border)',
  },

  // Feature cards
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' },
  featureCard: {
    padding: '1.75rem 1.5rem', borderRadius: 18,
    background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  featureIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 46, height: 46, borderRadius: 13, marginBottom: '0.875rem', color: '#fff',
  },
  featureTitle: { margin: '0 0 0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  featureText: { margin: 0, fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // Impact stories
  storiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  storyCard: {
    padding: '1.75rem', borderRadius: 18,
    background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex', flexDirection: 'column',
  },
  storyAvatar: (color) => ({
    width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 800, fontSize: '1.125rem', color: '#fff',
    background: color, marginBottom: '1rem', flexShrink: 0,
  }),
  storyQuote: {
    margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text)',
    lineHeight: 1.65, fontStyle: 'italic', flex: 1,
  },
  storyAuthor: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
  storyRole: { margin: '0.15rem 0 0', fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' },
  readMore: {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600,
    color: 'var(--slogbaa-blue)', background: 'none', border: 'none',
    cursor: 'pointer', padding: 0, textDecoration: 'none',
    transition: 'gap 0.2s ease',
  },

  // Videos
  videosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  videoCard: {
    borderRadius: 18, overflow: 'hidden',
    background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  videoThumb: {
    aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2.5rem', color: 'rgba(255,255,255,0.9)',
  },
  videoBody: { padding: '1rem 1.25rem' },
  videoTitle: { margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slogbaa-text)' },
  videoDuration: { margin: 0, fontSize: '0.8125rem', color: 'var(--slogbaa-text-muted)' },

  // How it works
  howSection: { padding: 'clamp(2.5rem, 5vw, 4rem) 2rem', background: 'var(--slogbaa-bg-secondary)' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' },
  howStep: {
    textAlign: 'center', padding: '1.5rem 1.25rem', borderRadius: 18,
    background: 'var(--slogbaa-glass-bg-subtle)', backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    border: '1px solid var(--slogbaa-glass-border-subtle)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  howNumber: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 42, height: 42, borderRadius: '50%', background: 'var(--primary-orange, #F58220)',
    color: '#fff', fontWeight: 800, fontSize: '1.0625rem', marginBottom: '0.875rem',
  },
  howTitle: { margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  howText: { margin: 0, fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },

  // News
  newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  newsCard: {
    padding: '1.5rem', borderRadius: 18,
    background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    border: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  newsTag: {
    display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 6,
    fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.04em', background: 'rgba(245,130,32,0.1)', color: 'var(--primary-orange, #F58220)',
    marginBottom: '0.625rem',
  },
  newsTitle: { margin: '0 0 0.4rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--slogbaa-text)' },
  newsSummary: { margin: '0 0 0.5rem', fontSize: '0.9375rem', color: 'var(--slogbaa-text-muted)', lineHeight: 1.6 },
  newsDate: { margin: 0, fontSize: '0.75rem', color: 'var(--slogbaa-text-muted)', fontWeight: 500 },

  // Partners
  partnersWrap: {
    display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', alignItems: 'center',
  },
  partnerLogo: (color) => ({
    width: 100, height: 100, borderRadius: 16, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
    background: `${color}12`, border: `1px solid ${color}30`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  }),
  partnerInitials: (color) => ({
    fontSize: '1.25rem', fontWeight: 800, color, lineHeight: 1,
  }),
  partnerName: {
    fontSize: '0.5rem', fontWeight: 500, color: 'var(--slogbaa-text-muted)',
    textAlign: 'center', lineHeight: 1.2, maxWidth: 80, overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  // CTA
  ctaSection: {
    position: 'relative', padding: 'clamp(3rem, 6vw, 4.5rem) 2rem', textAlign: 'center',
    color: '#fff', overflow: 'hidden',
    background: [
      'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,130,32,0.15) 0%, transparent 70%)',
      'linear-gradient(145deg, #050a15 0%, #0f1d3a 35%, #1e3a5f 50%, #0f1d3a 65%, #050a15 100%)',
    ].join(', '),
  },
  ctaTitle: { margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 700, position: 'relative', zIndex: 1 },
  ctaText: {
    margin: '0 auto 2rem', maxWidth: 500, fontSize: '1rem',
    opacity: 0.9, lineHeight: 1.6, position: 'relative', zIndex: 1,
  },

  // Footer
  footer: {
    padding: '2.5rem 2rem 1.5rem', color: '#fff',
    background: 'linear-gradient(180deg, #0a1628, #050a15)',
  },
  footerInner: {
    maxWidth: 1100, margin: '0 auto', display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem',
  },
  footerTitle: {
    margin: '0 0 0.75rem', fontSize: '0.9375rem', fontWeight: 700, color: '#fff',
  },
  footerText: { margin: 0, fontSize: '0.8125rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' },
  footerLink: {
    display: 'block', padding: '0.2rem 0', fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  footerSocials: { display: 'flex', gap: '0.625rem', flexWrap: 'wrap' },
  socialBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none', transition: 'background 0.2s ease, color 0.2s ease',
  },
  footerBottom: {
    maxWidth: 1100, margin: '1.5rem auto 0', padding: '1rem 0 0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '0.75rem',
  },
  copyright: { margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' },
}

// ─── Hero Carousel Component ──────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)
  const total = HERO_SLIDES.length

  const goTo = useCallback((idx) => setCurrent(idx), [])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (paused) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    intervalRef.current = setInterval(next, 5500)
    return () => clearInterval(intervalRef.current)
  }, [paused, next])

  return (
    <section
      style={s.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          style={{ ...s.slide(i === current), background: slide.bg }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${total}`}
          aria-hidden={i !== current}
        >
          <div style={s.slideInner}>
            <h2 style={{ ...s.slideTitle, color: '#fff' }}>
              {slide.title.split(' ').map((word, wi) =>
                ['Citizens', 'Pace', 'Certificates'].includes(word)
                  ? <span key={wi} style={{ color: slide.accent }}>{word} </span>
                  : word + ' '
              )}
            </h2>
            <p style={s.slideSub}>{slide.subtitle}</p>
            <div style={s.slideActions}>
              <Link to="/auth/register" style={{ ...s.ctaBtn, ...s.ctaPrimary }}>
                <Icon icon={icons.register} size={18} />
                Get Started Free
              </Link>
              <Link to="/auth/login" style={{ ...s.ctaBtn, ...s.ctaSecondary }}>
                <Icon icon={icons.signIn} size={18} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <nav style={s.dots} aria-label="Carousel navigation">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            style={s.dot(i === current)}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </nav>
    </section>
  )
}

// ─── Page Component ───────────────────────────────────────────────

function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/)
  return m ? m[1] : url
}

export function HomePage() {
  // Fetch dynamic CMS content (falls back to static if API unavailable)
  const { data: cms } = useQuery({
    queryKey: queryKeys.homepage.content(),
    queryFn: () => getHomepageContent(),
    staleTime: 60_000,
    retry: false,
  })

  // Record page visit (fire-and-forget, once per session)
  useEffect(() => {
    if (!sessionStorage.getItem('slogbaa-visited')) {
      recordVisit()
      sessionStorage.setItem('slogbaa-visited', '1')
    }
  }, [])

  // Use CMS content if available, otherwise static fallback
  const stories = cms?.stories?.length ? cms.stories : IMPACT_STORIES
  const newsItems = cms?.news?.length ? cms.news : NEWS_ITEMS
  const partners = cms?.partners?.length ? cms.partners : PARTNER_LOGOS
  const cmsVideos = cms?.videos?.length ? cms.videos : null

  return (
    <div style={s.page}>
      {/* ── Navigation ── */}
      <nav style={s.nav} className="glass-nav">
        <Logo variant="full" size={34} color="dark" />
        <div style={s.navRight}>
          <Link to="/auth/login" style={{ ...s.navLink, color: 'var(--text-main, #1A1A1B)' }}>
            Sign in
          </Link>
          <Link to="/auth/register" style={{ ...s.navLink, background: 'var(--primary-orange, #F58220)', color: '#fff' }}>
            Register
          </Link>
        </div>
      </nav>

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── About SLOGBA ── */}
      <section style={s.section} id="about">
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>About Us</span>
          <h2 style={s.sectionTitle}>About SLOGBA &amp; the Network for Active Citizens</h2>
        </div>
        <div style={s.aboutGrid}>
          <div>
            <p style={s.aboutText}>
              The <strong>Network for Active Citizens (NAC)</strong> is a civic engagement initiative dedicated to
              building the capacity of communities across Uganda. Our mission is to empower citizens with the knowledge,
              skills, and tools needed to actively participate in governance and community development.
            </p>
            <p style={{ ...s.aboutText, marginTop: '1rem' }}>
              <strong>SLOGBAA</strong> (the online learning platform) extends this mission into the digital space,
              providing structured courses, assessments, and certification for civic leaders, civil society members,
              and community citizens. Whether you are a local leader or a first-time learner, SLOGBAA meets you
              where you are with accessible, engaging content.
            </p>
            <p style={{ ...s.aboutText, marginTop: '1rem', fontStyle: 'italic', color: 'var(--slogbaa-text-muted)' }}>
              &ldquo;Putting Communities Before Self&rdquo;
            </p>
          </div>
          <div style={s.aboutImagePlaceholder}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Logo variant="icon" size={64} />
              <p style={{ margin: '1rem 0 0', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' }}>
                Empowering communities through learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Features ── */}
      <section style={{ ...s.section, background: 'var(--slogbaa-bg-secondary)', maxWidth: 'none', padding: 'clamp(2.5rem, 5vw, 4rem) 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={s.sectionTag}>Platform Features</span>
            <h2 style={s.sectionTitle}>Everything You Need to Learn and Grow</h2>
          </div>
          <div style={s.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} style={s.featureCard} className="glass-hover">
                <div style={{ ...s.featureIcon, background: f.bg }}>
                  <Icon icon={f.icon} size={22} />
                </div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureText}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Stories ── */}
      <section style={s.section} id="stories">
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>Impact Stories</span>
          <h2 style={s.sectionTitle}>Stories from the Community</h2>
          <p style={s.sectionDesc}>
            Read how SLOGBAA is transforming civic participation across Uganda.
          </p>
        </div>
        <div style={s.storiesGrid}>
          {stories.map((story) => {
            const name = story.authorName || story.name || 'Unknown'
            const role = story.authorRole || story.role || ''
            const quote = story.quoteText || story.quote || ''
            const img = story.imageUrl || null
            const color = story.color || '#F58220'
            return (
              <article key={name} style={s.storyCard} className="glass-hover">
                {img ? (
                  <img src={img} alt={name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                ) : (
                  <div style={s.storyAvatar(color)}>
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
                <p style={s.storyQuote}>&ldquo;{quote}&rdquo;</p>
                <p style={s.storyAuthor}>{name}</p>
                <p style={s.storyRole}>{role}</p>
                <button type="button" style={s.readMore} aria-label={`Read more about ${name}`}>
                  Read more <Icon icon={icons.arrowRight} size={14} />
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Videos Section ── */}
      <section style={{ ...s.section, background: 'var(--slogbaa-bg-secondary)', maxWidth: 'none', padding: 'clamp(2.5rem, 5vw, 4rem) 2rem' }} id="videos">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={s.sectionTag}>Video Content</span>
            <h2 style={s.sectionTitle}>Learn Through Video</h2>
            <p style={s.sectionDesc}>
              Watch training videos on governance, accountability, and civic engagement.
            </p>
          </div>
          <div style={s.videosGrid}>
            {(cmsVideos || [
              { title: 'Introduction to Civic Leadership', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { title: 'Community Governance Basics', youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0' },
              { title: 'Accountability & Transparency', youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8' },
            ]).map((v) => {
              const vid = extractYoutubeId(v.youtubeUrl)
              return (
                <div key={v.title} style={s.videoCard} className="glass-hover">
                  <div style={{ ...s.videoThumb, position: 'relative', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      allowFullScreen
                      loading="lazy"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', borderRadius: '18px 18px 0 0' }}
                    />
                  </div>
                  <div style={s.videoBody}>
                    <h3 style={s.videoTitle}>{v.title}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={s.howSection}>
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>How It Works</span>
          <h2 style={{ ...s.sectionTitle, marginBottom: '2rem' }}>Four Steps to Civic Leadership</h2>
        </div>
        <div style={s.howGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={s.howStep} className="glass-hover">
              <div style={s.howNumber}>{i + 1}</div>
              <h3 style={s.howTitle}>{step.title}</h3>
              <p style={s.howText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── News & Updates ── */}
      <section style={s.section} id="news">
        <div style={{ textAlign: 'center' }}>
          <span style={s.sectionTag}>News &amp; Updates</span>
          <h2 style={s.sectionTitle}>Latest from NAC</h2>
        </div>
        <div style={s.newsGrid}>
          {newsItems.map((item) => (
            <article key={item.title} style={s.newsCard} className="glass-hover">
              <span style={s.newsTag}>{item.tag || 'Update'}</span>
              <h3 style={s.newsTitle}>{item.title}</h3>
              <p style={s.newsSummary}>{item.summary}</p>
              <p style={s.newsDate}>{item.publishedDate || item.date || ''}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Partners & Logos ── */}
      <section style={{ ...s.section, background: 'var(--slogbaa-bg-secondary)', maxWidth: 'none', padding: 'clamp(2.5rem, 5vw, 4rem) 2rem' }} id="partners">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={s.sectionTag}>Our Partners</span>
            <h2 style={s.sectionTitle}>Working Together for Change</h2>
            <p style={s.sectionDesc}>
              We collaborate with government, civil society, and development partners to deliver impactful civic education.
            </p>
          </div>
          <div style={s.partnersWrap}>
            {partners.map((p) => {
              const name = p.name || 'Partner'
              const logo = p.logoUrl || null
              const color = p.color || '#F58220'
              const initials = p.initials || name.split(' ').map((w) => w[0]).join('').slice(0, 4)
              return logo ? (
                <a key={name} href={p.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" title={name} style={{ textDecoration: 'none' }}>
                  <img src={logo} alt={name} style={{ height: 80, maxWidth: 140, objectFit: 'contain', borderRadius: 12 }} loading="lazy" />
                </a>
              ) : (
                <div key={name} style={s.partnerLogo(color)} className="glass-hover" title={name}>
                  <span style={s.partnerInitials(color)}>{initials}</span>
                  <span style={s.partnerName}>{name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Call to Action ── */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to Start Your Learning Journey?</h2>
        <p style={s.ctaText}>
          Join the Network for Active Citizens and gain the skills you need to make a difference in your community.
        </p>
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Link to="/auth/register" style={{ ...s.ctaBtn, ...s.ctaPrimary }}>
            Register Now
          </Link>
          <Link to="/auth/login" style={{ ...s.ctaBtn, ...s.ctaSecondary }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <Logo variant="full" size={30} color="white" />
            </div>
            <p style={s.footerText}>
              Putting Communities Before Self. NAC&rsquo;s online learning platform for civic leadership and community development.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={s.footerTitle}>Quick Links</h4>
            <Link to="/auth/login" style={s.footerLink}>Sign In</Link>
            <Link to="/auth/register" style={s.footerLink}>Register</Link>
            <a href="#about" style={s.footerLink}>About Us</a>
            <a href="#stories" style={s.footerLink}>Impact Stories</a>
            <a href="#news" style={s.footerLink}>News &amp; Updates</a>
          </div>

          {/* Contact */}
          <div>
            <h4 style={s.footerTitle}>Contact</h4>
            <p style={s.footerText}>
              <Icon icon={icons.envelope} size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
              support@nac.go.ug
            </p>
            <p style={{ ...s.footerText, marginTop: '0.5rem' }}>
              <Icon icon={icons.mapPin} size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Kampala, Uganda
            </p>
          </div>

          {/* Social */}
          <div>
            <h4 style={s.footerTitle}>Follow Us</h4>
            <div style={s.footerSocials}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.socialBtn}
                  aria-label={link.label}
                  title={link.label}
                >
                  <link.Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={s.footerBottom}>
          <p style={s.copyright}>
            &copy; {new Date().getFullYear()} Network for Active Citizens (NAC). All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Logo variant="icon" size={16} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)' }}>SLOGBAA Online Learning Platform</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
