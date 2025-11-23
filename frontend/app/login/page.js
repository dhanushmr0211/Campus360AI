"use client";

import { useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "@/styles/Auth.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <h1 className={styles.headline}>Welcome back</h1>
          <p className={styles.subtext}>
            Sign in to continue orchestrating your AI-powered campus broadcasts.
          </p>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Email address"
              required
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <button type="submit" className={styles.primaryButton}>
              Sign In
            </button>
          </form>

          <p className={styles.switch}>
            Don’t have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
