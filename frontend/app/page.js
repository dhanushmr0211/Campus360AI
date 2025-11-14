"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import NoticeCard from "@/components/NoticeCard";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch(`${API_URL}/api/notices`);
        const data = await res.json();

        setNotices(data.notices || []);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "10px" }}>Campus360 AI</h1>
        <p style={{ marginBottom: "20px" }}>
          Welcome to your AI-powered campus notice dashboard.
        </p>

        {loading ? (
          <Loader />
        ) : notices.length === 0 ? (
          <p>No notices available.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
