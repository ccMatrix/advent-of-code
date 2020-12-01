import { writeFileSync } from 'fs';
import { clone } from 'lodash';
import * as manhattan from 'manhattan';
import { assertEquals, splitFileContents } from '../helper';

const boardSize = 10000;

const centralPort = [Math.floor(boardSize / 2), Math.floor(boardSize / 2)];

// Initialize board
const createBoard = () => {
    const board = Array<number[]>(boardSize);
    for (let x = 0; x < boardSize; x++) {
        const boardLine = Array<number>(boardSize);
        boardLine.fill(undefined);
        board[x] = boardLine;
    }
    return board;
};

enum Lines {
    First = 1,
    Second = 2,
}

enum Direction {
    Up = 'U',
    Down = 'D',
    Right = 'R',
    Left = 'L',
}

const drawOnBoard = (board: number[][], line: string[], index: Lines) => {
    const position = clone(centralPort);
    for (const instr of line) {
        const match = instr.match(/([UDRL]{1})(\d+)/);
        const direction = match[1];
        const steps = parseInt(match[2], 10);
        for (let step = 0; step < steps; step++) {
            switch (direction) {
                case Direction.Down:
                    position[1]++;
                    break;
                case Direction.Up:
                    position[1]--;
                    break;
                case Direction.Right:
                    position[0]++;
                    break;
                case Direction.Left:
                    position[0]--;
                    break;
            }
            let currentValue = board[position[1]][position[0]] || 0;
            currentValue |= index;
            board[position[1]][position[0]] = currentValue;
        }
    }
};

class Tuple {
    private _x: number;
    private _y: number;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
}

const findDistance = (lines: string[]) => {
    const board = createBoard();
    lines.forEach((line, index) => {
        const lineCoords = line.split(',');
        drawOnBoard(board, lineCoords, Math.pow(2, index));
    });
    const intersections: Tuple[] = [];
    board.forEach((row, rowIdx) => {
        row.forEach((line, lineIdx) => {
            if (line === 3) {
                intersections.push(new Tuple(lineIdx, rowIdx));
            }
        });
    });
    const distances = intersections.map((pos) => manhattan([pos.x, pos.y], centralPort.reverse()));
    return Math.min(...distances);
};

const exportBoard = (board: number[][], name?: string) => {
    const output: string[] = [];
    board.forEach((row) => {
        const rowBuffer: string[] = [];
        row.forEach((line) => {
            rowBuffer.push(`${line}`);
        });
        output.push(rowBuffer.join(''));
    });
    writeFileSync(`./src/day3/drawing_${name || 'board'}.txt`, output.join('\r\n'));
};

assertEquals(findDistance(['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83']), 159);
assertEquals(findDistance(['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7']), 135);

const input = splitFileContents('day3/input.txt', '\n');
const data = input.filter((d) => d !== '');

const distance = findDistance(data);
console.log(distance);
