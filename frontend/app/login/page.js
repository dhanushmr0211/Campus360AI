"use client";

import { useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

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
    <div style={{ padding: "40px", maxWidth: "450px", margin: "0 auto" }}>
      <h1>Login</h1>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            width: "100%",
            background: "black",
            color: "white",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
