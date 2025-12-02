import { strict } from 'assert';
import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split(',')
    .map(line => line.trim().split('-').map(n => parseInt(n, 10)));

const findInvalidIdInRange = (min: number, max: number, occurance?: number): number[] => {
    let invalidIds: number[] = [];
    for (let id = min; id <= max; id++) {
        const strId = id.toString();
        if (occurance === 2) {
            const first = strId.substring(0, Math.ceil(strId.length / occurance));
            const second = strId.substring(Math.ceil(strId.length / occurance));
            if (first === second) {
                invalidIds.push(parseInt(strId, 10));
            }
        }
        else {
            for (let i = 1; i < strId.length; i++) {
                if (strId.length % i === 0) {
                    const repeats = strId.length / i;
                    const segment = strId.substring(0, i);
                    if (segment.repeat(repeats) === strId) {
                        const invalidId = parseInt(strId, 10);
                        if (!invalidIds.includes(invalidId)) {
                            invalidIds.push(invalidId);
                        }
                    }
                }
            }
        }
    }
    return invalidIds;
};

const findInvalidIds = (data: number[][], occurance?: number) => {
    const invalidIds: number[] = [];
    for (const range of data) {
        invalidIds.push(...findInvalidIdInRange(range[0], range[1], occurance));
    }

    return invalidIds.reduce((a, b) => a + b, 0);
};

console.log('Invalid Ids 1:', findInvalidIds(input, 2));
console.log('Invalid Ids 2:', findInvalidIds(input));
