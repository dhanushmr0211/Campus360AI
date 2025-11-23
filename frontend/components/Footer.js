"use client";

import styles from "@/styles/Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3>Campus360 AI</h3>
          <span>Precision notice intelligence for modern campuses.</span>
        </div>

        <p className={styles.tagline}>
          Whisper-quiet automation, luminous insights, and a joyful experience
          every time you open the dashboard.
        </p>

        <div className={styles.stack}>
          <strong>Stack</strong>
          <span>Next.js • Supabase • FastAPI • OpenAI</span>
        </div>

        <p className={styles.copyright}>
          © {year} Campus360 AI · Crafted by Dhanush with premium polish
        </p>
      </div>
    </footer>
  );
}
