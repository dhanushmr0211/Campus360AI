import { useState } from "react";
import supabase from "@/utils/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setMessage(error.message);
    else setMessage("Check your email to verify your account!");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Create Account</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
