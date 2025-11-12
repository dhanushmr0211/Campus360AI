import styles from '../styles/Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading notices...</p>
    </div>
  );
}
