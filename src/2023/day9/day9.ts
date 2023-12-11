import * as fs from 'fs';
import * as path from 'path';

const readings = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/).map(n => parseInt(n, 10)));

const findNextInLine = ((reading: number[]) => {
    const levels: Array<number[]> = [];
    levels.push(reading);
    let processing = reading;

    while (!processing.every(n => n === 0)) {
        const nextLevel: number[] = [];
        for (let x = 0; x < processing.length - 1; ++x) {
            nextLevel.push(processing[x + 1] - processing[x]);
        }
        levels.push(nextLevel);
        processing = nextLevel;
    }

    for (let y = levels.length - 2; y >= 0; --y) {
        const currentLine = levels[y];
        const nextLine = levels[y + 1];
        // Calculate next history in future
        levels[y].push(currentLine[currentLine.length - 1] + nextLine[nextLine.length - 1]);
        // Calculate next history in past
        levels[y].unshift(currentLine[0] - nextLine[0]);
    }
    return levels.shift();
});

const updatedReadings = readings.map(reading => findNextInLine(reading));

(() => {
    const historySum = updatedReadings.reduce((prev, current) => prev + current.pop(), 0)
    console.log('part1:', historySum);
})();

(() => {
    const historySum = updatedReadings.reduce((prev, current) => prev + current.shift(), 0)
    console.log('part2:', historySum);
})();