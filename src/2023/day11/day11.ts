import * as fs from 'fs';
import * as path from 'path';

interface ICoord {
    x: number;
    y: number;
    num?: number;
}

let input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

const emptyLines: number[] = [];
const emptyColumns: number[] = [];
for (let y = input.length - 1; y >= 0; --y) {
    if (!input[y].includes('#')) {
        emptyLines.push(y);
    }
}
for (let x = input[0].length - 1; x >=0; --x) {
    if (!input.map(line => line[x]).includes('#')) {
        emptyColumns.push(x);
    }
}

const galaxies: ICoord[] = [];
let galaxyCounter = 0;
input.forEach((line, y) => {
    line.forEach((pos, x) => {
        if (pos === '#') {
            galaxies.push({ x, y, num: ++galaxyCounter });
        }
    });
});

const caluclateDistances = (galaxies: ICoord[], emptyDistanceMultiplier: number) => {
    const distanceMap = new Map<string, number>();
    galaxies.forEach(galaxy1 => {
        galaxies.forEach(galaxy2 => {
            if (galaxy1.num === galaxy2.num) {
                return;
            }
            const key = `${Math.min(galaxy1.num, galaxy2.num)}-${Math.max(galaxy1.num, galaxy2.num)}`;
            if (!distanceMap.has(key)) {
                const coord1: ICoord = { x: Math.max(galaxy1.x, galaxy2.x), y: Math.max(galaxy1.y, galaxy2.y) };
                const coord2: ICoord = { x: Math.min(galaxy1.x, galaxy2.x), y: Math.min(galaxy1.y, galaxy2.y) };
                const spaceIncrease: ICoord = { x: 0, y: 0 };
                spaceIncrease.y = emptyLines.filter(y => y >= coord2.y && y <= coord1.y).length * (emptyDistanceMultiplier - 1);
                spaceIncrease.x = emptyColumns.filter(x => x >= coord2.x && x <= coord1.x).length * (emptyDistanceMultiplier - 1);
                coord1.x += spaceIncrease.x;
                coord1.y += spaceIncrease.y;
                let dist = (coord1.x - coord2.x) + (coord1.y - coord2.y);
                distanceMap.set(key, dist);
            }
        });
    });
    return distanceMap;
}

(() => {
    const distanceMap = caluclateDistances(galaxies, 2);
    const totalDistance = Array.from(distanceMap.values()).reduce((prev, cur) => prev + cur, 0);
    console.log('Part1', totalDistance);
})();

(() => {
    const distanceMap = caluclateDistances(galaxies, 1000000);
    const totalDistance = Array.from(distanceMap.values()).reduce((prev, cur) => prev + cur, 0);
    console.log('Part2', totalDistance);
})();