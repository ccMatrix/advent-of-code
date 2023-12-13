import * as fs from 'fs';
import * as path from 'path';
import { distance } from 'fastest-levenshtein';

interface IMirror {
    column: number;
    row: number;
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n\n')
    .map(line => line.split('\n').map(l => l.trim()));

type verificationFunc = (map: string[], start: number) => boolean;

const findMirror = (map: string[], verifyMirrorLine: verificationFunc): IMirror => {
    for (let row = 1; row < map.length; ++row) {
        if (verifyMirrorLine(map, row)) {
            return { row, column: 0 };
        }
    }

    const transMap = map[0].trim().split('').map((_, colIndex) => map.map(row => row[colIndex]).join(''));
    for (let column = 1; column < transMap.length; ++column) {
        if (verifyMirrorLine(transMap, column)) {
            return { row: 0, column };
        }
    }

    return {
        column: 0,
        row: 0,
    };
}

(() => {
    const verifyMirror = (map: string[], start: number) => {
        const maxSteps = Math.min(map.length - start, start);
        for (let i = 0; i < maxSteps; ++i) {
            if (map[start - i - 1] !== map[start + i]) {
                return false;
            }
        }
        return true;
    }

    const results = input.map(map => findMirror(map, verifyMirror));
    const totalResult = results.reduce((prev, current) => prev + (100 * current.row) + current.column, 0)
    console.log('Part1', totalResult);
})();

(() => {
    const verifyMirror = (map: string[], start: number) => {
        let smutchCorrected = false;
        const maxSteps = Math.min(map.length - start, start);
        for (let i = 0; i < maxSteps; ++i) {
            const dist = distance(map[start - i - 1], map[start + i]);
            if (dist > 1 || (smutchCorrected && dist >= 1)) {
                return false;
            }
            if (dist === 1) {
                smutchCorrected = true;
            }
        }
        return smutchCorrected;
    }

    const results = input.map(map => findMirror(map, verifyMirror));
    const totalResult = results.reduce((prev, current) => prev + (100 * current.row) + current.column, 0)
    console.log('Part2', totalResult);
})();
