import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login"); // redirect
      } else {
        setUser(data.session.user);
      }
    });
  }, []);

  if (!user) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {user.email}</h1>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
