import React, { useState, useEffect } from 'react';
import Board from '../../../components/Board';
import axios from "../../../utils/axios";

import './index.css'

function Game({dimension, handlePlayGame, newSquares, newWinLine, handleWinGame, handleReplay, isWin}) {
    const [squares, setSquares] = useState(Array(dimension*dimension).fill(null));
    const [lastMove, setLastMove] = useState(-1);
    const [winLine, setWinLine] = useState(null);
    const [xIsNext, setXIsNext] = useState(true);
    const [XorO, setXorO] = useState(null);

    useEffect(() => {
        if (newSquares) {
            setSquares(newSquares);
            if (newSquares.every(el => !el)) {
                setWinLine(null);
            }
            setXIsNext(!xIsNext);
        }
    }, [newSquares]);

    useEffect(() => {
        setWinLine(newWinLine);
        if (!newWinLine) {
            setXIsNext(true);
            setXorO(null);
            console.log('reset');
        }
        handleReplay();
    }, [newWinLine]);

    function handleClick(i) {
        const currentSquares = squares.slice();
        if (!XorO) {
            if (xIsNext) {
                setXorO('X');
            } else {
                setXorO('O');
            }
        }
        console.log((xIsNext && XorO === 'O'));

        if (currentSquares[i] || winLine || (xIsNext && XorO === 'O') || (!xIsNext && XorO === 'X') || isWin) {
            return;
        }

        currentSquares[i] = xIsNext ? 'X' : 'O';
        const line = calculateWinner(currentSquares, i);
        if (line) {
            setWinLine(line);
            handleReplay();
            handleWinGame(line);
        }
        setSquares(currentSquares);
        setLastMove(i);
        setXIsNext(!xIsNext);
        handlePlayGame(currentSquares);
    }

    function calculateWinner(squares, i) {
        const distance = [1, dimension - 1, dimension, dimension + 1];
        let line = [];
        for (let j = 0; j < distance.length; j++) {
            line = [];
            let backward = true, forward = true, countBackWard = 0, countForWard = 0;
            do {
                // console.log(i + (-countBackWard - 1)*distance[j],squares[i],squares[i + (-countBackWard - 1)*distance[j]]);
                // console.log(i + (countForWard + 1)*distance[j],squares[i],squares[i + (countForWard + 1)*distance[j]]);
                    if (backward && (i + (-countBackWard - 1)*distance[j]) >= 0 && squares[i] === squares[i + (-countBackWard - 1)*distance[j]]) {
                        line.push(i + (-countBackWard - 1)*distance[j]);
                        countBackWard++;
                    } else {
                        backward = false;
                    }
                    if (forward && (i + (countForWard + 1)*distance[j]) < squares.length && squares[i] === squares[i + (countForWard + 1)*distance[j]]) {
                        line.push(i + (countForWard + 1)*distance[j]);
                        countForWard++;
                    } else {
                        forward = false;
                    }
            } while (backward || forward);
            if (line.length >= 4) {
                line.push(i);
                return line;
            }
        }
        return null;
    }

    return (
        <div className="game">
            <div className="game-board" >
                <Board
                    squares={squares}
                    onClick={(i) => handleClick(i)}
                    winLine={winLine}
                    numRow={dimension}
                    numCol={dimension}
                />
            </div>

        </div>
    );
}


export default Game;