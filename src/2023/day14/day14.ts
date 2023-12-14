import * as fs from 'fs';
import * as path from 'path';
import { cloneDeep, repeat } from 'lodash';
import { platform } from 'os';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

const printPlatform = (platform: string[][]) => {
    console.log(
        platform.map(line => line.join('')).join('\n'), '\n'
    );
}

const generateCacheKey = (platform: string[][]) => {
    const generateHash = (data: string[]) => {
        return data.reduce(function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
    const key = `${platform.map(line => generateHash(line)).join('_')}`;
    return key;
}

const tiltPlateVertically = (platform: string[][]) => {
    for (let x = 0; x < platform[0].length; ++x) {
        let topBlock = -1;
        for (let y = 0; y < platform.length; ++y) {
            const location = platform[y][x];
            if (location === 'O') {
                platform[y][x] = '.';
                platform[++topBlock][x] = 'O';
            }
            else if (location === '#') {
                topBlock = y;
            }
        }
    }
}

const tiltPlateHorizontally = (platform: string[][]) => {
    for (let y = 0; y < platform.length; ++y) {
        let topBlock = -1;
        for (let x = 0; x < platform[0].length; ++x) {
            const location = platform[y][x];
            if (location === 'O') {
                platform[y][x] = '.';
                platform[y][++topBlock] = 'O';
            }
            else if (location === '#') {
                topBlock = x;
            }
        }
    }
}

const rotateOneCircle = (platform: string[][]) => {
    tiltPlateVertically(platform);
    tiltPlateHorizontally(platform);
    platform.reverse();
    tiltPlateVertically(platform);
    platform.map(line => line.reverse());
    tiltPlateHorizontally(platform);
    platform.reverse();
    platform.map(line => line.reverse());
}

const calculateNorthLoad = (platform: string[][]) =>
    platform.reduce((prev, current, idx) => prev + (current.filter(b => b === 'O').length * (platform.length - idx)), 0);

(() => {
    const platform = cloneDeep(input);
    tiltPlateVertically(platform);
    console.log('Part1:', calculateNorthLoad(platform));
})();

(() => {
    const cache = new Map<string, number>();
    let platform = cloneDeep(input);
    const totalCircles = 1000000000;
    for (let circle = 0; circle < totalCircles; circle++) {
        const cacheKey = generateCacheKey(platform);
        if (!cache.has(cacheKey)) {
            rotateOneCircle(platform);
            cache.set(cacheKey, circle);
        }
        else {
            const init = cache.get(cacheKey);
            const searchPosition = (totalCircles - init) % (circle - init);
            circle = totalCircles - searchPosition;
            cache.clear();
        }
    }
    console.log('Part2:', calculateNorthLoad(platform));
})();
