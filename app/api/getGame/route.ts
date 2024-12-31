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
    return NextResponse.json({ message: game, }, { status: 200 })
}