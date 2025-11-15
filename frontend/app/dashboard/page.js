"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NoticeCard from "@/components/NoticeCard";
import Loader from "@/components/Loader";
import styles from "@/styles/Home.module.css";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const backendURL = process.env.NEXT_PUBLIC_API_URL + "/api/notices";

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
    });
  }, []);

  // Fetch notices
  useEffect(() => {
    fetch(backendURL)
      .then((res) => res.json())
      .then((data) => {
        setNotices(data.notices || []);
        setLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredNotices = notices.filter(
    (n) =>
      (filter === "All" || n.category === filter) &&
      (n.summary?.toLowerCase().includes(search.toLowerCase()) ||
        n.title?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />

      <main className={styles.container}>
        <h1>Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search notices..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filters */}
        <div className={styles.filters}>
          {["All", "Academic", "General", "Cultural", "Sports"].map((c) => (
            <button
              key={c}
              className={`${styles.filterBtn} ${
                filter === c ? styles.active : ""
              }`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Notices */}
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.grid}>
            {filteredNotices.map((notice, i) => (
              <NoticeCard key={i} notice={notice} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
