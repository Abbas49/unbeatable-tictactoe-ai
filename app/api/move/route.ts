import Board from "@/lib/Board";
import connectDB from "@/lib/database";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    const req = await request.json();
    const isConnected = await connectDB();
    if(!isConnected){
        return NextResponse.json( { message: "Database error." }, { status: 500 });
    }
    let game;
    try{
        game = await Game.findById(req.id);
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Invalid game id"}, { status: 400 });
    }
    if(game.result != null){
        return NextResponse.json({ message: "Game has ended"}, { status: 400 });
    }
    const moves: number[] = game.moves;
    if(moves.includes(req.move) || !(req.move >= 1 && req.move <= 9)){
        return NextResponse.json({ message: "Invalid move"}, { status: 400 });
    }
    const board = new Board(moves);
    board.play(req.move);
    board.play(board.getBestMove());
    board.printBoard();
    game.moves = board.moves;
    if(board.checkWin() == game.playerTurn){
        game.result = "Won";
    }else if(board.checkWin() == board.oppositeTurn(game.playerTurn)){
        game.result = "Lost";
    }else if(board.moves.length == 9){
        game.result = "Draw";
    }
    game.save();
    return NextResponse.json({ message: game, }, { status: 200 })
}