import React, { useState, useEffect } from 'react';

import './index.css';

export default function HistoryGame({squares}) {

    
    const [winLine, setWinLine] = useState(null);
    const [xIsNext, setXIsNext] = useState(true);
    const [XorO, setXorO] = useState(null);
    const dimension = 20;


    useEffect(() => {

    },[]);

    function Square(props) {
        let style;
        if (props.isWinLine) {
            style = { color: props.color, background: 'violet' };
        } else {
            style = { color: props.color};
        }
    
        return (
            <button className="square" style={style}>
                {props.value}
            </button>
        );
    }

    function Board({squares, winLine, numRow, numCol}) {
        const rows = [];
        for (let row = 0; row < numRow; row++)
            rows.push(renderRow(row));

        function renderSquare(i) {
            //let isWin = false;
            let color, isWinLine = false;
            if (winLine) {
                winLine.forEach(index => {
                    if (i === index) {
                        isWinLine = true;
                    }
                });
            }
            if (squares[i] === 'X')
                color = 'red';
            else
                color = 'green';
    
            return (
                <Square
                    value={squares[i]}
                    color={color}
                    isWinLine={isWinLine}
                />
            );
        }
    
        function renderRow(row) {
            const cols = []
            for (let col = 0; col < numCol; col++)
                cols.push(renderSquare(row * numCol + col));
            return (
                <div className="board-row">
                    {cols}
                </div>
            );
        }
        
        return (
            <div>
                {rows}
            </div>
        );   
    }

    return (
        <div className="game">
            <div className="game-board" >
                <Board
                    squares={squares}
                    winLine={winLine}
                    numRow={dimension}
                    numCol={dimension}
                />
            </div>
        </div>
    );
}