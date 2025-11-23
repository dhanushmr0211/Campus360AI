"use client";

import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navWrapper}>
      <div className={styles.navGlow} />
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.badge}>360</div>
          <div>
            <p className={styles.title}>Campus360 AI</p>
            <p className={styles.subtitle}>Intelligent notice stream</p>
          </div>
        </div>

        <div className={styles.links}>
          <a href="/" className={styles.link}>
            Home
          </a>
          <a href="/dashboard" className={styles.link}>
            Dashboard
          </a>
          <a href="/login" className={`${styles.link} ${styles.cta}`}>
            Sign in
          </a>
        </div>
      </nav>
    </header>
  );
}
