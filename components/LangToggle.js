'use client';

import styles from './LangToggle.module.css';

export default function LangToggle({ lang, onToggle }) {
    return (
        <button
            className={styles.toggle}
            onClick={onToggle}
            aria-label={`Switch to ${lang === 'en' ? 'Chinese' : 'English'}`}
            title={lang === 'en' ? '切换到中文' : 'Switch to English'}
        >
            <span className={styles.track}>
                <span
                    className={styles.indicator}
                    style={{ transform: lang === 'en' ? 'translateX(0)' : 'translateX(100%)' }}
                />
                <span className={`${styles.label} ${lang === 'en' ? styles.active : ''}`}>EN</span>
                <span className={`${styles.label} ${lang === 'zh' ? styles.active : ''}`}>中</span>
            </span>
        </button>
    );
}
