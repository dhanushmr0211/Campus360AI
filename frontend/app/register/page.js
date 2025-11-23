"use client";

import { useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "@/styles/Auth.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <h1 className={styles.headline}>Create an account</h1>
          <p className={styles.subtext}>
            Unlock the premium experience to monitor, summarize and elevate
            campus-wide communications.
          </p>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <form onSubmit={handleRegister} className={styles.form}>
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
              Create Account
            </button>
          </form>

          <p className={styles.switch}>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
