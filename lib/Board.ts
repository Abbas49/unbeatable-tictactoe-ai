export default class Board{
    board: string[][] = [
        ['.', '.', '.'],
        ['.', '.', '.'],
        ['.', '.', '.']
    ];
    turn: string = 'X';
    playCount:number = 1;
    moves: number[];
    constructor(moves: number[]){
        this.moves = [];
        for(let i = 0; i < moves.length; i++){
            this.play(moves[i]);
        }
    }
    gameEvaluator(t : number, turn:string) : number{
        const winner = this.checkWin();
        if(winner == this.turn) return 1;
        if(winner == this.oppositeTurn(this.turn)) return -1;
        if(t == 10){
            return 0;
        }

        let result:number = 0;
        let isFirst = true;
        for(let i = 0; i < 3 ;i++){
            for(let j = 0; j < 3; j++){
                if(this.board[i][j] == '.'){
                    this.board[i][j] = turn;
                    const temp = this.gameEvaluator(t+1, this.oppositeTurn(turn));
                    if(turn == this.turn){
                        if(temp > result || isFirst){
                            result = temp;
                        }
                    }else{
                        if(temp < result || isFirst){
                            result = temp;
                        }
                    }
                    this.board[i][j] = '.';
                    isFirst = false;
                }
            }
        }
        return result;
    }
    checkWin(): string{
        for(let i = 0; i < 3; i++){
            let x:number = 0;
            let o:number = 0;
            for(let j = 0; j < 3; j++){
                if(this.board[i][j] == 'X') x++;
                if(this.board[i][j] == 'O') o++;
            }
            if(x == 3) return 'X';
            if(o == 3) return 'O';
            x = 0;
            o = 0;
            for(let j = 0; j < 3; j++){
                if(this.board[j][i] == 'X') x++;
                if(this.board[j][i] == 'O') o++;
            }
            if(x == 3) return 'X';
            if(o == 3) return 'O';
        }
        if((this.board[0][0] == 'X' && this.board[1][1] == 'X' && this.board[2][2] == 'X') || (this.board[0][2] == 'X' && this.board[1][1] == 'X' && this.board[2][0] == 'X')) return 'X';
        if((this.board[0][0] == 'O' && this.board[1][1] == 'O' && this.board[2][2] == 'O') || (this.board[0][2] == 'O' && this.board[1][1] == 'O' && this.board[2][0] == 'O')) return 'O';
        return ".";
    }
    printBoard() : void{
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                process.stdout.write(this.board[i][j]);
            }
            process.stdout.write("\n");
        }
    }
    numberToPair(num: number): number[]{
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                num--;
                if(num == 0) return [i, j];
            }
        }
        return [-1, -1];
    }
    play(num : number){
        if(!(num >= 1 && num <= 9)){
            console.log("unvalid play.");
            return;
        }
        if(this.playCount == 10){
            console.log("the game ended.");
            return;
        }
        const position = this.numberToPair(num);
        if(this.board[position[0]][position[1]] == '.'){
            this.board[position[0]][position[1]] = this.turn
            this.moves.push(num);
        }else{
            console.log("unvalid play.");
            return;
        }
        this.turn = this.oppositeTurn(this.turn);
    }
    oppositeTurn(turn:string){
        return (turn == 'X'? 'O': 'X');
    }
    getBestMove(): number{
        let bestMove = -1;
        let bestResult = 0;
        let isFirst = true;
        for(let i = 1; i <= 9; i++){
            const position = this.numberToPair(i);
            if(this.board[position[0]][position[1]] != '.') continue;
            this.board[position[0]][position[1]] = this.turn
            const check = this.gameEvaluator(this.playCount+1, this.oppositeTurn(this.turn));
            if(check> bestResult || isFirst){
                bestMove = i;
                bestResult = check;
            }
            this.board[position[0]][position[1]] = '.';
            isFirst = false;
        }
        return bestMove;
    }
}