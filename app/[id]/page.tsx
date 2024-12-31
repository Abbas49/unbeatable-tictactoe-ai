"use client"

import { error } from "console";
import React, { useEffect, useState } from "react";

export default function Game(props: {params: Promise<{id: string}>}){
    const params = React.use(props.params);
    const [moves, setMoves] = useState<number[]>([]);
    const [message, setMessage] = useState<string>();
    const [isEnd, setEnd] = useState(false);
    let board: string[] = "         ".split('');
    for(let i = 0; i < moves.length; i++){
        board[moves[i]-1] = (i%2 == 0 ? 'X' : 'O');
    }
    useEffect(() => {
        const fetchData = async () => {
            const game = await fetch('/api/getGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: params.id
                })
            }).then((e) => e.json());
            setMoves(game.message.moves || []);
        };
        fetchData();
    }, [])
    async function clickHandler(num : number){
            const game = await fetch('/api/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: params.id,
                move: num
            })
        }).then(async (e) =>{
            const res = await e.json();
            if(e.status != 200) throw new Error(res.message);
            setMoves(res.message.moves || []);
            setMessage(res.message.result || "");
            if(res.message.result != null){
                setEnd(true);
            }
        }).catch((error)=>{
            console.log(error.text);
            setMessage(error.message);
        })
    }
    console.log(params.id);
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="grid grid-cols-3 grid-rows-3 max-w-80 w-9/12 aspect-square">
            {
                board.map((value, index)=>{
                    index++;
                    let shadow = "0px 0px 16px rgba(47,17,210,1), 0px 0px 16px rgba(47,17,210,1), 0px 0px 16px rgba(47,17,210,1)";
                    let color = "text-blue-500"
                    if(value == 'O'){
                        color = "text-red-500";
                        shadow = "0px 0px 16px rgba(210,17,17,1)";
                    }
                    return <button style={{textShadow: shadow}} className={`border-2 text-5xl ${color}`} key={index} onClick={()=>clickHandler(index)} >{value}</button>
                })
            }
            </div>
            <p className="text-5xl mt-10">{message}</p>
        </div>
    )
}