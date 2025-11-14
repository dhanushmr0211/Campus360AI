import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Campus360 <span>AI</span></div>

      <div className={styles.links}>
        <a href="/">Home</a>
        <a href="#notices">Notices</a>
        <a href="https://github.com/dhanushmr0211" target="_blank">GitHub</a>
      </div>
    </nav>
  );
}
