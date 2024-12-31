# Unbeatable Tic-Tac-Toe AI Bot

## Overview
This project implements an unbeatable Tic-Tac-Toe AI using the Minimax algorithm. The AI evaluates all possible game states to always choose the optimal move, making it impossible to win against.

## How It Works

### Minimax Algorithm
- Explores all possible game states
- Chooses move with maximum score for AI
- Assumes opponent plays optimally

### Key Features
- 🤖 Unbeatable AI using minimax algorithm
- 🎮 Beautiful modern dark UI with glass-morphic design
- 🎯 Perfect move calculation

### Game Outcomes
When playing against this AI:
- Best case: Draw
- AI wins or forces draw in every game
- No possibility of human player winning

## Technical Implementation
- Recursive minimax algorithm
- Depth-first search of game tree
- Move evaluation using position scoring
- State management with MongoDB
- Modern Next.js frontend

The AI analyzes up to 362,880 possible game states (9!) to ensure it always makes the optimal move.