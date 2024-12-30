"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  async function handleClick(){
    const game = await fetch('/api/createGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerTurn: 'X'
      })
    }).then((e) => e.json());
    router.push(game._id);
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleClick} className="text-nowrap inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">Create Game</button>
    </div>
  );
}
