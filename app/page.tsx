"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const createGame = async () => {
      let last = localStorage.getItem("last") || "X";
      last = last == "X" ? "O" : "X";
      const game = await fetch("/api/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerTurn: last,
        }),
      }).then((e) => e.json());
      localStorage.setItem("last", last);
      router.push(game._id);
    };
    createGame();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      ></div>
    </div>
  );
}
