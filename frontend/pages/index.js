import { createClient } from "@supabase/supabase-js";
import NoticeCard from "../components/NoticeCard";

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    props: {
      notices: data || [],
      error: error ? error.message : null,
    },
  };
}

export default function Home({ notices, error }) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CampusConnect-AI</h1>

      {error && (
        <p className="text-red-500 mb-4">Error loading notices: {error}</p>
      )}

      {notices.map((n) => (
        <NoticeCard key={n.id} notice={n} />
      ))}
    </div>
  );
}
