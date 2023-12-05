import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

interface IRange {
    destination: number;
    sourceStart: number;
    sourceEnd: number;
    length: number;
}

interface ISeedMap {
    from: string;
    to: string;
    ranges: IRange[];
}

interface ISeed {
    start: number;
    range: number;
}

interface ISeedAlmanac {
    seeds: ISeed[];
    maps: ISeedMap[];
}

const parseAlamnacInput = (data: string[], parseSeedsAsRange: boolean) => {
    const almanac: ISeedAlmanac = {
        seeds: [],
        maps: [],
    }
    let currentMap: ISeedMap;
    data.forEach(line => {
        if (line.startsWith('seeds:')) {
            const seedValues = line.substring(7).trim().split(' ').map(n => parseInt(n, 10));
            if (parseSeedsAsRange) {
                while (seedValues.length > 0) {
                    const [ start, range ] = seedValues.splice(0, 2);
                    almanac.seeds.push({ start, range });
                }
            }
            else {
                almanac.seeds = seedValues.map(s => ({ start: s, range: 1 }));
            }
            return;
        }

        if (line.includes('map:')) {
            const info = line.match(/(?<from>\w+)-to-(?<to>\w+)/)!;
            const newMap: ISeedMap = {
                from: info.groups.from,
                to: info.groups.to,
                ranges: [],
            };
            almanac.maps.push(newMap);
            currentMap = newMap;
            return;
        }

        const lineValues = line.match(/(?<destination>\d+)\s(?<source>\d+)\s(?<length>\d+)/);
        if (lineValues) {
            currentMap.ranges.push({
                destination: parseInt(lineValues.groups.destination, 10),
                sourceStart: parseInt(lineValues.groups.source, 10),
                sourceEnd: parseInt(lineValues.groups.source, 10) + parseInt(lineValues.groups.length, 10),
                length: parseInt(lineValues.groups.length, 10),
            })
        }
    });
    return almanac;
}

const findLowestLocation = (alamanac: ISeedAlmanac): number => {
    let lowestLocation: number = Infinity;
    alamanac.seeds.forEach(seed => {
        for (let x = seed.start; x < seed.start + seed.range; ++x) {
            let rangeMap: ISeedMap;
            let lookupValue = x;
            let sourceType = 'seed';
            while (rangeMap = alamanac.maps.find(m => m.from === sourceType)) {
                const range = rangeMap.ranges.find(r => lookupValue >= r.sourceStart && lookupValue < r.sourceEnd);
                if (range) {
                    lookupValue = range.destination + (lookupValue - range.sourceStart);
                }
                sourceType = rangeMap.to;
            }
            lowestLocation = Math.min(lowestLocation, lookupValue);
        }
    });

    return lowestLocation;
}

(() => {
    const alamanac = parseAlamnacInput(input, false);
    const seedLocation = findLowestLocation(alamanac);
    console.log(`Part1: Lowest location is ${seedLocation}`);
})();

(() => {
    const alamanac = parseAlamnacInput(input, true);
    const seedLocation = findLowestLocation(alamanac);
    console.log(`Part2: Lowest location is ${seedLocation}`);
})();