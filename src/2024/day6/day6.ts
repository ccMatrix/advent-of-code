import * as fs from 'fs';
import { sample } from 'lodash';
import * as path from 'path';

const loadMaze = (filename: string) =>
    fs.readFileSync(path.join(__dirname, filename))
        .toString()
        .trim()
        .split('\n')
        .map(line => line.split(''));

const maze = loadMaze('input.txt');

interface Point {
    x: number;
    y: number;
}

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

const traverseMaze = (maze: string[][]) => {
    const findStart = (maze: string[][]) => {
        let start: Point | undefined;
        maze.forEach((line, index) => {
            const pos = line.indexOf('^');
            if (pos >= 0) {
                start = { x: pos, y: index };
                return;
            }
        });
        return start as Point;
    };

    const guard = findStart(maze);
    let direction: Direction = Direction.Up;
    let guardWalking = true;

    console.log('start is', guard);

    while (guardWalking) {
        direction: switch (direction) {
            case Direction.Up:
                for (let y = guard.y; y >= 0; y--) {
                    if (maze[y][guard.x] === '#') {
                        direction = Direction.Right;
                        break direction;
                    }
                    guard.y = y;
                    maze[guard.y][guard.x] = 'X';
                }
                guardWalking = false;
                break;
            case Direction.Right:
                for (let x = guard.x; x < maze[guard.y].length; x++) {
                    if (maze[guard.y][x] === '#') {
                        direction = Direction.Down;
                        break direction;
                    }
                    guard.x = x;
                    maze[guard.y][x] = 'X';
                }
                guardWalking = false;
                break;
            case Direction.Down:
                for (let y = guard.y; y < maze.length; y++) {
                    if (maze[y][guard.x] === '#') {
                        direction = Direction.Left;
                        break direction;
                    }
                    guard.y = y;
                    maze[guard.y][guard.x] = 'X';
                }
                guardWalking = false;
                break;
            case Direction.Left:
                for (let x = guard.x; x >= 0; x--) {
                    if (maze[guard.y][x] === '#') {
                        direction = Direction.Up;
                        break direction;
                    }
                    guard.x = x;
                    maze[guard.y][guard.x] = 'X';
                }
                guardWalking = false;
                break;
        }
    }

    console.log('Finished walking around');

    return maze;
}

const countGuardPositions = (maze: string[][]) => {
    const mazeString = maze.map(l => l.join('')).join('\n');
    const matches = mazeString.match(/X/g).length;
    return matches;
}

const sampleMaze = loadMaze('input.txt');
const sampleTraversed = traverseMaze(sampleMaze);
console.log('Guard positions', countGuardPositions(sampleTraversed));

// console.log(sampleMaze.map(l => l.join('')).join('\n'));