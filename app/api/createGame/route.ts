import Board from "@/lib/Board";
import connectDB from "@/lib/database";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    let req;
    try {
        req = await request.json();
        if(!req.playerTurn || (req.playerTurn != 'X' && req.playerTurn != 'O')){
            throw new Error("Player turn not found.")
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Invalid JSON in request body"
            },
            {
                status: 400
            }
        );
    }

    const isConnected = await connectDB();
    if(!isConnected){
        return NextResponse.json( { message: "Database error." }, { status: 500 });
    }
    let moves: number[] = [];
    if(req.playerTurn == 'O'){
        const board = new Board([]);
        board.play(board.getBestMove());
        moves = board.moves;
    }
    const game = await Game.create({
        moves: moves,
        playerTurn: req.playerTurn,
    });
    return NextResponse.json(game);
}