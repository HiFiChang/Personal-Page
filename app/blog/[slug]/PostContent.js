'use client';

import { useState } from 'react';
import LangToggle from '@/components/LangToggle';
import GlitchText from '@/components/GlitchText';
import styles from './post.module.css';

export default function PostContent({
    title,
    titleZh,
    date,
    readingTime,
    tags,
    htmlEn,
    htmlZh,
    hasZh,
}) {
    const [lang, setLang] = useState('en');
    const [transitioning, setTransitioning] = useState(false);

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    const handleToggle = () => {
        setTransitioning(true);
        setTimeout(() => {
            setLang(lang === 'en' ? 'zh' : 'en');
            // Allow a frame for React to update, then animate in
            requestAnimationFrame(() => {
                setTransitioning(false);
            });
        }, 150);
    };

    const currentTitle = lang === 'zh' && titleZh ? titleZh : title;
    const currentHtml = lang === 'zh' && htmlZh ? htmlZh : htmlEn;

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <a href="/blog" className={styles.back}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Blog</span>
                    </a>
                    {hasZh && (
                        <LangToggle lang={lang} onToggle={handleToggle} />
                    )}
                </div>

                <h1 className={styles.title}>
                    <GlitchText text={currentTitle} lang={lang} as="span" />
                </h1>

                <div className={styles.meta}>
                    {date && (
                        <time className={styles.date}>{formatDate(date)}</time>
                    )}
                    <span className={styles.dot}>·</span>
                    <span className={styles.readTime}>{readingTime} min read</span>
                </div>

                {tags && tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}
            </header>

            <div
                className={`prose ${styles.content} ${transitioning ? styles.contentExit : styles.contentEnter}`}
                dangerouslySetInnerHTML={{ __html: currentHtml }}
            />
        </>
    );
}
