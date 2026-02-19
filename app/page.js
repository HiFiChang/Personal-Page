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
        text: 'Junior student in __Computer Science__ at Renmin University of China (RUC). Recipient of the First-Class Academic Scholarship.',
      },
      {
        text: 'Interested in __AI__, __systems programming__, and the intersection of technology with creative expression. Currently exploring large language models and compiler design.',
      },
      {
        text: 'I believe in building things that are both functional and beautiful.',
      },
    ],
    status: 'Currently based in Beijing, China',
  },
  zh: {
    name: '常皓飞',
    bio: [
      {
        text: '中国人民大学__计算机科学与技术__专业大三学生，一等奖学金获得者。',
      },
      {
        text: '对 __AI__、__系统编程__、以及技术与创造性表达的交叉领域感兴趣。目前专注于大语言模型与编译器设计。',
      },
      {
        text: '我相信好的作品兼具功能与美感。',
      },
    ],
    status: '现居北京',
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

      {/* Social Links */}
      <section className={`${styles.social} animate-fade-in-up delay-3`}>
        <a
          href="https://github.com/changhaofei"
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
          href="https://scholar.google.com/"
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
          href="mailto:changhaofei@ruc.edu.cn"
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
