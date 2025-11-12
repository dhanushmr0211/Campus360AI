import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import NoticeCard from '../components/NoticeCard';
import Loader from '../components/Loader';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Academic', 'Events', 'Sports', 'Clubs', 'Administration', 'Placement', 'Workshop', 'Scholarship', 'General'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/notices?limit=50`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }
      
      const data = await response.json();
      setNotices(data.notices || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter(notice => notice.category === selectedCategory);

  return (
    <div className={styles.container}>
      <Head>
        <title>CampusConnect-AI | Smart Campus Announcements</title>
        <meta name="description" content="AI-powered campus announcement system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Campus Announcements</h1>
          <p className={styles.subtitle}>Stay updated with AI-summarized campus notices</p>
        </div>

        <div className={styles.filterBar}>
          <label htmlFor="category-filter">Filter by category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={fetchNotices} className={styles.refreshButton}>
            Refresh
          </button>
        </div>

        {loading && <Loader />}

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
            <button onClick={fetchNotices}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.noticesGrid}>
            {filteredNotices.length === 0 ? (
              <p className={styles.noNotices}>No notices found</p>
            ) : (
              filteredNotices.map(notice => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 CampusConnect-AI. Powered by AI.</p>
      </footer>
    </div>
  );
}
