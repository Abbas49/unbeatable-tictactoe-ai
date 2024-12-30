"use client"

import { error } from "console";
import React, { useEffect, useState } from "react";

export default function Game(props: {params: Promise<{id: string}>}){
    const params = React.use(props.params);
    const [moves, setMoves] = useState<number[]>([]);
    const [message, setMessage] = useState<string>();
    let board: string[] = ".........".split('');
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
        }).then((e) =>{
            if(e.status != 200) throw new Error("error")
            return e.json()
        }).then((e)=>{
            setMoves(e.message.moves || []);
            setMessage(e.message.result || "");
        }).catch((error)=>{
            console.log(error);
            setMessage("game has ended");
        })
    }
    console.log(params.id);
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <p>{params.id}</p>
            <div>
                {moves.map((e)=>{
                    return <span>{e}, </span>
                })}
            </div>
            <br />
            <br />
            <div>
            {
                board.map((value, index)=>{
                    index++;
                    return <><button className="w-20 h-20 border-2 text-3xl" key={index} onClick={()=>clickHandler(index)} >{value}</button> {index%3==0?<br></br>:""}</>
                })
            }
            </div>
            <p className="text-5xl mt-10">{message}</p>
        </div>
    )
}