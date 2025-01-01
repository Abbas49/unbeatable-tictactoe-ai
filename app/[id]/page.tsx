"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface GameState{
  moves: number[];
  result: string | null;
  message: string;
  isEnd: boolean;
}

export default function Game(props: { params: Promise<{ id: string }> }) {
  const params = React.use(props.params);
  const [gameState, setGameState] = useState<GameState>({
    moves: [],
    result: null,
    message: "",
    isEnd: false,
  });
  const router = useRouter();
  const board = React.useMemo(() => {
    const boardArray = Array(9).fill(' ');
    gameState.moves.forEach((move, index) => {
      boardArray[move - 1] = index % 2 === 0 ? 'X' : 'O';
    });
    return boardArray;
  }, [gameState.moves]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/getGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
        }),
      }).then((e) => e.json()).then((game) => {
        if(game.message == "Invalid game id"){
          setGameState({...gameState, message: game.message, isEnd: true});
          return;
        }
        const state: GameState = {
          ...gameState,
          moves: game.message.moves || [],
        }
        if(game.message.result != null){
          state.isEnd = true;
          state.message = game.message.result;
        }
        setGameState(state);
      });
    };
    fetchData();
  }, [params.id]);
  async function clickHandler(num: number) {
    await fetch("/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: params.id,
        move: num,
      }),
    })
      .then(async (e) => {
        const res = await e.json();
        if (e.status != 200) throw new Error(res.message);
        const state: GameState = {
          ...gameState,
          moves: res.message.moves || [],
          message: res.message.result || "",
        }
        if (res.message.result != null) {
          state.isEnd = true;
        }
        setGameState(state);
      })
      .catch((error) => {
        console.log(error.text);
        setGameState({...gameState, message: error.message});
      });
  }
  console.log(params.id);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="grid grid-cols-3 grid-rows-3 max-w-80 w-9/12 aspect-square">
        {board.map((value, index) => {
          index++;
          let shadow = "0px 0px 25px rgba(99, 102, 241, 0.5)";
          let color = "text-indigo-300 hover:text-indigo-200";
          if (value == "O") {
            color = "text-fuchsia-300 hover:text-fuchsia-200";
            shadow = "0px 0px 25px rgba(217, 70, 239, 0.5)";
          }
          return (
            <button
              style={{
                textShadow: shadow,
                backdropFilter: "blur(16px)",
                boxShadow: "inset 0 0 20px rgba(255,255,255,0.05)",
              }}
              className={`m-1 border-2 border-slate-600/80 bg-slate-800/80 rounded-2xl
                            text-6xl font-bold ${color}
                            hover:bg-slate-700/80 transition-all duration-300
                            hover:scale-105 backdrop-blur-xl
                            hover:border-slate-500/80
                            hover:shadow-lg hover:shadow-slate-900/50
                            active:scale-95`}
              key={index}
              onClick={() => clickHandler(index)}
            >
              {value}
            </button>
          );
        })}
      </div>
      <p className="text-5xl mt-10 text-gray-200">{gameState.message}</p>
      {gameState.isEnd ? (
        <button
            onClick={() => {router.push("/")}}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white 
                    rounded-lg hover:bg-indigo-500 transition-colors"
        >
          New Game
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
