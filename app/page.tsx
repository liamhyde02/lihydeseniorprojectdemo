"use client"

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [githubLink, setGithubLink] = useState("");
  const [branch, setBranch] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-24">
      <h1 className="text-4xl font-bold">Liam Hyde Senior Project Demo</h1>
      <input disabled={loading} className="border border-gray-300 rounded p-2" placeholder="Github link" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
      <input disabled={loading} className="border border-gray-300 rounded p-2" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
      <button disabled={loading} className="bg-blue-500 text-white p-2 rounded" onClick={async () => {
        setLoading(true);
        const response = await fetch("/api/run", {
          method: "POST",
          body: JSON.stringify({ githubLink, branch }),
        });
        const json = await response.json();
        setImageUrl(json.imageUrl);
        setLoading(false);
      }}>Submit</button>
      {loading && <p>Loading...</p>}
      {imageUrl && <Image alt="UML diagram" src={imageUrl} width={2000} height={4000} />}
    </main>
  );
}
