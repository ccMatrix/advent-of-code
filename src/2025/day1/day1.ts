import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => parseInt(line.trim().replace('L', '-').replace('R', ''), 10));

const findRotations = (data: number[]) => {
    let rotations = 0;
    let start = 50;
    data.forEach(move => {
        start += move;
        while (start < 0) {
            start += 100;
        }
        start %= 100;
        if (start === 0) {
            rotations += 1;
        }
    });
    return rotations;
};

console.log('Total Rotations:', findRotations(input));

const findClicks = (data: number[]) => {
    let clicks = 0;
    let start = 50;
    data.forEach(move => {
        start += move;
        while (start < 0) {
            start += 100;
            clicks += 1;
        }
        while (start >= 100) {
            start -= 100;
            clicks += 1;
        }
    });
    return clicks;
};

console.log('Total Clicks:', findClicks(input));