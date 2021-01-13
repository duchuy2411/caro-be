import React from 'react';
function Square(props) {
    let style;
    if (props.isWinLine) {
        style = { color: props.color, background: 'violet' };
    } else {
        style = { color: props.color};
    }

    return (
        <button className="square" onClick={props.onClick} style={style}>
            {props.value}
        </button>
    );
}

export default Square;