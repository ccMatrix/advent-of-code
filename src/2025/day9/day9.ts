import * as fs from 'node:fs';
import * as path from 'node:path';

class Point {
    constructor(public x: number, public y: number) { }

    static parse(posStr: string) {
        const [ x, y ] = posStr.split(',').map((s) => parseInt(s.trim(), 10));
        return new Point(x, y);
    }

    toString = () => `(${this.x}, ${this.y})`;
}

const loadInput = (filename: string): Point[] => {
    return fs
        .readFileSync(path.join(__dirname, filename))
        .toString()
        .trim()
        .split('\n')
        .map((line) => Point.parse(line.trim()));
};

const sampleInput = loadInput('sampleInput.txt');
const input = loadInput('input.txt');

const findLargestRectangle = (points: Point[]): number => {
    let largestRectangle = 0;

    for (const p1 of points) {
        for (const p2 of points) {
            const width = p2.x - p1.x + 1;
            const height = p2.y - p1.y + 1;
            const size = width * height;
            if (size > largestRectangle) {
                largestRectangle = size;
            }
        }
    }

    return largestRectangle;
}

console.log('Sample: Largest Rectangle:', findLargestRectangle(sampleInput));
console.log('Real: Largest Rectangle:', findLargestRectangle(input));
