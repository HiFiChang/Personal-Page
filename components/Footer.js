import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <span className={styles.text}>© 2026 Chang Haofei</span>
                <span className={styles.divider}>·</span>
                <span className={styles.text}>Built with curiosity</span>
            </div>
        </footer>
    );
}
