"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NoticeCard from "@/components/NoticeCard";
import Loader from "@/components/Loader";
import styles from "@/styles/Home.module.css";
import supabase from "@/utils/supabaseClient";

const categories = [
  "All",
  "Academic",
  "Recruitment",
  "Technical",
  "Cultural",
  "Sports",
  "General",
];

export default function Dashboard() {
  const router = useRouter();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");

  const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/notices`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
    });
  }, [router]);

  useEffect(() => {
    fetch(backendURL)
      .then((res) => res.json())
      .then((data) => {
        setNotices(data.notices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [backendURL]);

  const filteredNotices = useMemo(() => {
    return (notices || []).filter((n) => {
      const cat = (n.category || "General").toLowerCase();
      const active = filter.toLowerCase();
      const summary = (n.summary || "").toLowerCase();
      const title = (n.title || "").toLowerCase();
      const q = search.toLowerCase();

      return (
        (active === "all" || cat === active) &&
        (summary.includes(q) || title.includes(q))
      );
    });
  }, [notices, filter, search]);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div>
              <span className={styles.heroBadge}>Operator dashboard</span>
              <h1 className={styles.title}>Team cockpit</h1>
              <p className={styles.subtitle}>
                Review, curate and publish campus communications with cinematic
                polish. Every filter, every search, delicately animated.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔎</span>
            <input
              type="text"
              placeholder="Search internal notices..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${
                view === "grid" ? styles.viewActive : ""
              }`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={`${styles.viewBtn} ${
                view === "list" ? styles.viewActive : ""
              }`}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>
        </section>

        <section className={styles.filtersRow}>
          {categories.map((c) => (
            <button
              key={c}
              className={`${styles.filterBtn} ${
                filter === c ? styles.filterActive : ""
              }`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </section>

        {loading ? (
          <div className={styles.loaderWrap}>
            <Loader />
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No notices match your filters</h3>
            <p>Adjust search keywords or switch to a different category.</p>
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
