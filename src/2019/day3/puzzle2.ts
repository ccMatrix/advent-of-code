import { clone, sum } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

const boardSize = 10000;

const centralPort = [Math.floor(boardSize / 2), Math.floor(boardSize / 2)];

class DataPoint {
    public value = 0;
    private stepsMap: Map<number, number>;

    get steps() {
        return this.stepsMap;
    }

    constructor() {
        this.stepsMap = new Map<number, number>();
    }

    public setSteps(line: number, steps: number) {
        if (!this.stepsMap.has(line)) {
            this.stepsMap.set(line, steps);
        }
    }
}

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

// Initialize board
const createBoard = () => {
    const board = new Array<DataPoint[]>(boardSize);
    for (let y = 0; y < boardSize; y++) {
        const boardLine = new Array<DataPoint>(boardSize);
        for (let x = 0; x < boardSize; x++) {
            boardLine[x] = undefined;
        }
        board[y] = boardLine;
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

const pointFromBoard = (board: DataPoint[][], position: number[]) => {
    let currentPoint = board[position[1]][position[0]];
    if (!currentPoint) {
        currentPoint = new DataPoint();
        board[position[1]][position[0]] = currentPoint;
    }
    return currentPoint;
};

const drawOnBoard = (board: DataPoint[][], line: string[], index: Lines) => {
    const position = clone(centralPort);
    let totalSteps = 0;
    for (const instr of line) {
        const match = instr.match(/([UDRL]{1})(\d+)/);
        const direction = match[1];
        const steps = parseInt(match[2], 10);
        for (let step = 0; step < steps; step++) {
            totalSteps++;
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

            const currentPoint = pointFromBoard(board, position);
            currentPoint.value |= index;
            currentPoint.setSteps(index, totalSteps);
        }
    }
};

const findTotalSteps = (lines: string[]) => {
    const board = createBoard();
    lines.forEach((line, index) => {
        const lineCoords = line.split(',');
        drawOnBoard(board, lineCoords, Math.pow(2, index));
    });
    const intersections: Tuple[] = [];
    board.forEach((row, rowIdx) => {
        row.forEach((line, lineIdx) => {
            if (line && line.value === 3) {
                intersections.push(new Tuple(lineIdx, rowIdx));
            }
        });
    });
    const totalSteps = intersections.map((pos) => sum(Array.from(board[pos.y][pos.x].steps.values())));
    return Math.min(...totalSteps);
};

assertEquals(610, findTotalSteps(['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83']));
assertEquals(410, findTotalSteps(['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7']));

const input = splitFileContents('day3/input.txt', '\n');
const data = input.filter((d) => d !== '');

const distance = findTotalSteps(data);
console.log(distance);
