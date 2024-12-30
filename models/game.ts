import mongoose, { models } from "mongoose";


const gameSchema = new mongoose.Schema({
		moves:{
			type: [Number],
		},
		playerTurn:{
			type: String,
		},
        result:{
            type: String,
            default: null,
        }
	},
	{
		timestamps: true
	}
)

const Game = models.Game || mongoose.model("Game", gameSchema);

export default Game;