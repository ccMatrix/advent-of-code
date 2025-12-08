import { cloneDeep, first, uniq, uniqBy } from 'lodash';
import * as fs from 'node:fs';
import * as path from 'node:path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

class Position {
    constructor(public x: number, public y: number) { }

    toString = () => `${this.x},${this.y}`;
    public left = () => new Position(this.x - 1, this.y);
    public right = () => new Position(this.x + 1, this.y);

    static parse(posStr: string) {
        const [ x, y ] = posStr.split(',').map(s => parseInt(s, 10));
        return new Position(x, y);
    }
}

const runTachyonBeam = (input: string[][]): number => {
    let splitCount = 0;
    let beams: Position[] = [];

    const start = new Position(first(input).indexOf('S'), 0);
    beams.push(start);

    for (let y = 1; y < input.length; y++) {
        for (const beam of beams) {
            if (input[y][beam.x] === '^') {
                const newBeam = new Position(beam.x - 1, y);
                if (!beams.includes(newBeam)) {
                    beams.push(newBeam);
                    splitCount++;
                }
                beam.y = y;
                beam.x = beam.x + 1;
            }
            else {
                beam.y = y;
            }
        }
        beams = uniqBy(beams, b => `${b.x},${b.y}`);
    }

    return splitCount;
};

console.log('Tachyon Beam Count:', runTachyonBeam(input));

const runQuantumTachyonBeam = (input: string[][]): number => {
    const addMapEntry = (map: Map<string, number>, pos: Position, count: number) => {
        const key = pos.toString();
        map.set(key, (map.get(key) ?? 0) + count);
    }

    const start: Position = new Position(first(input).indexOf('S'), 0);

    let beamsMap: Map<string, number> = new Map();
    beamsMap.set(start.toString(), 1);

    for (let y = 1; y < input.length; y++) {
        const newBeamsMap: Map<string, number> = new Map();

        for (const [ key, count ] of beamsMap.entries()) {
            const pos = Position.parse(key);

            if (input[y][pos.x] === '^') {
                addMapEntry(newBeamsMap, pos.left(), count)
                addMapEntry(newBeamsMap, pos.right(), count)
            }
            else {
                addMapEntry(newBeamsMap, pos, count);
            }
        }

        beamsMap = newBeamsMap;
    }

    return beamsMap.values().reduce((sum, count) => sum + count, 0);
};

console.log('Quantum Tachyon Beam Count:', runQuantumTachyonBeam(input));
