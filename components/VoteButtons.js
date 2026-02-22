'use client';

import { useState, useEffect } from 'react';
import styles from './VoteButtons.module.css';

export default function VoteButtons({ slug }) {
    const [counts, setCounts] = useState({ up: 0, down: 0 });
    const [voted, setVoted] = useState(null); // 'up' | 'down' | null
    const [animating, setAnimating] = useState(null);
    const [loading, setLoading] = useState(true);

    const storageKey = `vote-${slug}`;

    useEffect(() => {
        // Load current counts
        fetch(`/api/votes/${slug}`)
            .then((r) => r.json())
            .then((data) => {
                setCounts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Restore previous vote from localStorage
        const prev = localStorage.getItem(storageKey);
        if (prev) setVoted(prev);
    }, [slug, storageKey]);

    async function handleVote(type) {
        if (voted) return; // already voted

        setAnimating(type);
        setTimeout(() => setAnimating(null), 400);

        try {
            const res = await fetch(`/api/votes/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });
            const updated = await res.json();
            setCounts(updated);
            setVoted(type);
            localStorage.setItem(storageKey, type);
        } catch {
            // silent fail
        }
    }

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>Was this helpful?</p>
            <div className={styles.buttons}>
                <button
                    className={`${styles.btn} ${voted === 'up' ? styles.active : ''} ${animating === 'up' ? styles.pop : ''}`}
                    onClick={() => handleVote('up')}
                    disabled={!!voted}
                    title="Helpful"
                    aria-label="Upvote"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                    </svg>
                    <span className={`${styles.count} ${loading ? styles.ghost : ''}`}>
                        {counts.up}
                    </span>
                </button>

                <button
                    className={`${styles.btn} ${voted === 'down' ? styles.activeDown : ''} ${animating === 'down' ? styles.pop : ''}`}
                    onClick={() => handleVote('down')}
                    disabled={!!voted}
                    title="Not helpful"
                    aria-label="Downvote"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M19 12l-7 7-7-7" />
                    </svg>
                    <span className={`${styles.count} ${loading ? styles.ghost : ''}`}>
                        {counts.down}
                    </span>
                </button>
            </div>

        </div>
    );
}
