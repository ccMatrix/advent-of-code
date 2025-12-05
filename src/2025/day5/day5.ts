import * as fs from 'node:fs';
import * as path from 'node:path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n\n')
    .map(line => line.trim().split('\n').map(l => l.trim()));

const freshRanges = input[0].map(line => line.split('-').map(num => parseInt(num, 10)));
const incredients = input[1].map(line => parseInt(line, 10));

const checkIsFresh = (fresh: number[][], incredient: number) => {
    for (const range of fresh) {
        if (incredient >= range[0] && incredient <= range[1]) {
            return true;
        }
    }
    return false;
};

const checkFreshIncredients = (fresh: number[][], incredients: number[]): number => {
    let totalFresh = 0;
    for (const incredient of incredients) {
        if (checkIsFresh(fresh, incredient)) {
            totalFresh += 1;
        }
    }
    return totalFresh;
}

const findTotalIncredientsCount = (fresh: number[][]): number => {
    const mergeRanges = (ranges: number[][]): number[][] => {
        if (ranges.length === 0) return [];

        const sortedRanges = ranges.toSorted((a, b) => a[0] - b[0]);
        const merged: number[][] = [];
        let [currentStart, currentEnd] = sortedRanges[0];

        for (let i = 1; i < sortedRanges.length; i++) {
            const [start, end] = sortedRanges[i];
            if (start <= currentEnd) {
                currentEnd = Math.max(currentEnd, end);
            }
            else {
                merged.push([currentStart, currentEnd]);
                currentStart = start;
                currentEnd = end;
            }
        }

        merged.push([currentStart, currentEnd]);

        return merged;
    }
    const mergedRanges = mergeRanges(fresh);

    const totalCount = mergedRanges.reduce((acc, range) => {
        const [start, end] = range;
        return acc + (end - start + 1);
    }, 0);

    return totalCount;
};

console.log('Total fresh incredients:', checkFreshIncredients(freshRanges, incredients));
console.log('Total incredients count:', findTotalIncredientsCount(freshRanges));