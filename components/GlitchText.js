'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './GlitchText.module.css';

const EN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
const ZH_CHARS = '天地人和风云雨雪山水木火金土日月星辰光影梦幻虚实数码维度量子';

function getRandomChar(targetLang) {
    const pool = targetLang === 'zh' ? ZH_CHARS : EN_CHARS;
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function GlitchText({ text, lang, as: Tag = 'span', className = '' }) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTextRef = useRef(text);
    const animFrameRef = useRef(null);

    const animate = useCallback((newText, targetLang) => {
        setIsAnimating(true);
        const maxLen = Math.max(prevTextRef.current.length, newText.length);
        const totalDuration = 400;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);

            // Characters resolve left-to-right based on progress
            const resolvedCount = Math.floor(progress * newText.length);
            let result = '';

            for (let i = 0; i < maxLen; i++) {
                if (i < resolvedCount) {
                    // Already resolved
                    result += newText[i] || '';
                } else if (i < newText.length) {
                    // Still scrambling
                    result += getRandomChar(targetLang);
                }
                // Beyond new text length — just drop
            }

            setDisplayText(result);

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(step);
            } else {
                setDisplayText(newText);
                setIsAnimating(false);
                prevTextRef.current = newText;
            }
        }

        animFrameRef.current = requestAnimationFrame(step);
    }, []);

    useEffect(() => {
        if (text !== prevTextRef.current) {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
            animate(text, lang);
        }
        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [text, lang, animate]);

    // Initial render — no animation
    useEffect(() => {
        prevTextRef.current = text;
        setDisplayText(text);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Tag className={`${className} ${isAnimating ? styles.glitching : ''}`}>
            {displayText}
        </Tag>
    );
}
