'use client';

import { useState } from 'react';
import LangToggle from '@/components/LangToggle';
import GlitchText from '@/components/GlitchText';
import styles from './page.module.css';

const content = {
  en: {
    name: 'Chang Haofei',
    bio: [
      {
        text: 'Junior student in __Computer Science__ at Renmin University of China (RUC).',
      },
      {
        text: 'Interested in __LLM Agent__, __Multimodal__.',
      },
    ],
    status: 'Currently based in Beijing, China',
    honorsLabel: 'Honors',
    honors: [
      { text: 'First-Class Academic Excellence Scholarship, RUC' },
      { text: 'Merit Student, RUC' },
    ],
    publicationsLabel: 'Publications',
    publications: [
      {
        title: 'EnvScaler: Scaling Tool-Interactive Environments for LLM Agent via Programmatic Synthesis',
        authors: [
          { name: 'Xiaoshuai Song' },
          { name: 'Haofei Chang', self: true },
          { name: 'Guanting Dong' },
          { name: 'Yutao Zhu' },
          { name: 'Zhicheng Dou' },
          { name: 'Ji-Rong Wen' },
        ],
        venue: 'arXiv 2026.1',
        url: 'https://arxiv.org/abs/2601.05808',
      },
      {
        title: 'An End-to-End Multimodal System for Subtitle Recognition and Chinese-Japanese Translation in Short Dramas',
        authors: [
          { name: 'Jing An*' },
          { name: 'Haofei Chang*', self: true },
          { name: 'Rui-Yang Ju*' },
          { name: 'Jinhua Su*' },
          { name: 'Yanbing Bai' },
          { name: 'Xin Qu' },
        ],
        venue: 'ICASSP 2026 [CCF-B]',
        url: '',
      },
    ],
  },
  zh: {
    name: '常皓飞',
    bio: [
      {
        text: '中国人民大学__计算机科学与技术__专业大三学生。',
      },
      {
        text: '对 __LLM Agent__、__多模态__感兴趣。',
      },
    ],
    status: '现居北京',
    honorsLabel: '荣誉',
    honors: [
      { text: '中国人民大学学习优秀一等奖学金' },
      { text: '中国人民大学三好学生' },
    ],
    publicationsLabel: '论文',
    publications: [
      {
        title: 'EnvScaler: Scaling Tool-Interactive Environments for LLM Agent via Programmatic Synthesis',
        authors: [
          { name: 'Xiaoshuai Song' },
          { name: 'Haofei Chang', self: true },
          { name: 'Guanting Dong' },
          { name: 'Yutao Zhu' },
          { name: 'Zhicheng Dou' },
          { name: 'Ji-Rong Wen' },
        ],
        venue: 'arXiv 2026.1',
        url: 'https://arxiv.org/abs/2601.05808',
      },
      {
        title: 'An End-to-End Multimodal System for Subtitle Recognition and Chinese-Japanese Translation in Short Dramas',
        authors: [
          { name: 'Jing An*' },
          { name: 'Haofei Chang*', self: true },
          { name: 'Rui-Yang Ju*' },
          { name: 'Jinhua Su*' },
          { name: 'Yanbing Bai' },
          { name: 'Xin Qu' },
        ],
        venue: 'ICASSP 2026 [CCF-B]',
        url: '',
      },
    ],
  },
};

function BioLine({ text, lang }) {
  // Parse __highlight__ markers
  const parts = text.split(/(__[^_]+__)/g);
  return parts.map((part, i) => {
    if (part.startsWith('__') && part.endsWith('__')) {
      const inner = part.slice(2, -2);
      return (
        <GlitchText key={i} text={inner} lang={lang} as="span" className={styles.highlight} />
      );
    }
    return <GlitchText key={i} text={part} lang={lang} as="span" />;
  });
}

export default function Home() {
  const [lang, setLang] = useState('en');
  const c = content[lang];

  return (
    <div className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <h1 className={`${styles.name} animate-fade-in-up`}>
            <GlitchText text={c.name} lang={lang} as="span" />
          </h1>
          <div className={`animate-fade-in-up delay-1`}>
            <LangToggle lang={lang} onToggle={() => setLang(lang === 'en' ? 'zh' : 'en')} />
          </div>
        </div>
        <div className={`${styles.titleLine} animate-fade-in-up delay-1`} />
      </section>

      {/* Bio */}
      <section className={`${styles.bio} animate-fade-in-up delay-2`}>
        {c.bio.map((line, i) => (
          <p key={i} className={styles.bioText}>
            <BioLine text={line.text} lang={lang} />
          </p>
        ))}
      </section>

      {/* Honors */}
      <section className={`${styles.listSection} animate-fade-in-up delay-2`}>
        <h2 className={styles.sectionLabel}>{c.honorsLabel}</h2>
        <ul className={styles.list}>
          {c.honors.map((h, i) => (
            <li key={i} className={styles.listItem}>{h.text}</li>
          ))}
        </ul>
      </section>

      {/* Publications */}
      <section className={`${styles.listSection} animate-fade-in-up delay-3`}>
        <h2 className={styles.sectionLabel}>{c.publicationsLabel}</h2>
        <ul className={styles.list}>
          {c.publications.map((p, i) => (
            <li key={i} className={styles.listItem}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.pubLink}>
                {p.title}
              </a>
              {p.authors && (
                <span className={styles.authors}>
                  {p.authors.map((a, j) => (
                    <span key={j}>
                      {j > 0 && ', '}
                      {a.self ? <strong>{a.name}</strong> : a.name}
                    </span>
                  ))}
                </span>
              )}
              <span className={styles.venue}>{p.venue}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Social Links */}
      <section className={`${styles.social} animate-fade-in-up delay-3`}>
        <a
          href="https://github.com/HiFiChang"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="GitHub"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </a>

        <a
          href="https://scholar.google.com/citations?user=901Xpl0AAAAJ&hl=en&oi=ao"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Google Scholar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
          </svg>
          <span>Scholar</span>
        </a>

        <a
          href="mailto:haofeichang@ruc.edu.cn"
          className={styles.socialLink}
          aria-label="Email"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>Email</span>
        </a>
      </section>

      {/* Status */}
      <section className={`${styles.status} animate-fade-in-up delay-4`}>
        <div className={styles.statusDot} />
        <GlitchText text={c.status} lang={lang} as="span" />
      </section>
    </div>
  );
}
