"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import NoticeCard from "@/components/NoticeCard";
import Loader from "@/components/Loader";
import styles from "@/styles/Home.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = process.env.NEXT_PUBLIC_API_URL + "/api/notices";

  // 🔐 Protect Route
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

  async function logoutUser() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className={styles.container}>
      <h1>Your Dashboard</h1>
      <button onClick={logoutUser} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {loading ? (
        <Loader />
      ) : (
        <div className={styles.grid}>
          {notices.map((notice, i) => (
            <NoticeCard key={i} notice={notice} />
          ))}
        </div>
      )}
    </main>
  );
}
