"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import NoticeCard from "@/components/NoticeCard";
import Loader from "@/components/Loader";

import styles from "@/styles/Home.module.css";
import supabase from "@/utils/supabaseClient";

export default function Home() {
  const router = useRouter();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/notices`;

  // 🔐 Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      }
    });
  }, [router]);

  // 📡 Fetch notices
  useEffect(() => {
    fetch(backendURL)
      .then((res) => res.json())
      .then((data) => {
        setNotices(data.notices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [backendURL]);

  // 🧮 Filtered notices
  const filteredNotices = useMemo(() => {
    return (notices || []).filter((n) => {
      const cat = (n.category || "General").toLowerCase();
      const f = filter.toLowerCase();
      const summary = (n.summary || "").toLowerCase();
      const title = (n.title || "").toLowerCase();
      const q = search.toLowerCase();

      const categoryMatch = f === "all" || cat === f;
      const textMatch = summary.includes(q) || title.includes(q);

      return categoryMatch && textMatch;
    });
  }, [notices, filter, search]);

  // Small stats
  const totalCount = notices.length;
  const todayCount = useMemo(() => {
    const now = Date.now();
    return (notices || []).filter((n) => {
      const created = n.created_at ? new Date(n.created_at).getTime() : null;
      if (!created) return false;
      const diffHours = (now - created) / (1000 * 60 * 60);
      return diffHours < 24;
    }).length;
  }, [notices]);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        {/* Hero + top row */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div>
              <span className={styles.heroBadge}>Live campus feed</span>
              <h1 className={styles.title}>Campus360 AI</h1>
              <p className={styles.subtitle}>
                One luxurious dashboard for every AI curated announcement. Search,
                filter and glide through updates in a single, animated flow.
              </p>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.stat}>
                <p className={styles.statsLabel}>Total Notices</p>
                <p className={styles.statsValue}>{totalCount}</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statsLabel}>New (Last 24h)</p>
                <p className={styles.statsValue}>{todayCount}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Controls row */}
        <section className={styles.controlsRow}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search announcements by title, summary or category..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* View toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${
                view === "grid" ? styles.viewActive : ""
              }`}
              onClick={() => setView("grid")}
            >
              ⬛ Grid
            </button>
            <button
              className={`${styles.viewBtn} ${
                view === "list" ? styles.viewActive : ""
              }`}
              onClick={() => setView("list")}
            >
              📄 List
            </button>
          </div>
        </section>

        {/* Category filters */}
        <section className={styles.filtersRow}>
          {["All", "Academic", "Recruitment", "Technical", "Cultural", "Sports", "General"].map(
            (c) => (
              <button
                key={c}
                className={`${styles.filterBtn} ${
                  filter === c ? styles.filterActive : ""
                }`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            )
          )}
        </section>

        {/* Content */}
        {loading ? (
          <div className={styles.loaderWrap}>
            <Loader />
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No announcements found</h3>
            <p>Try changing filters or clearing the search term.</p>
          </div>
        ) : (
          <section
            className={view === "grid" ? styles.gridLayout : styles.listLayout}
          >
            {filteredNotices.map((notice, idx) => (
              <NoticeCard key={notice.id || idx} notice={notice} view={view} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
