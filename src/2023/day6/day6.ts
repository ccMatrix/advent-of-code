import * as fs from 'fs';
import * as path from 'path';

interface iRace {
    time: number;
    distance: number;
    winningOptions: number[];
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

const parseInput = (data: string[], singleRace: boolean) => {
    const times = singleRace
        ? [ parseInt(data[0].substring(5).replace(/\s+/g, '').trim(), 10) ]
        : data[0].substring(5).trim().split(/\s+/).map(l => parseInt(l, 10));
    const distances = singleRace
        ? [ parseInt(data[1].substring(9).replace(/\s+/g, '').trim(), 10) ]
        : data[1].substring(9).trim().split(/\s+/).map(l => parseInt(l, 10));
    const races = times.map<iRace>((time, index) => ({
        time,
        distance: distances[index],
        winningOptions: [],
    }));
    return races;
}

const isWinningRace = (holdTime: number, race: iRace): boolean => {
    const speed = holdTime;
    const boatTime = race.time - holdTime;
    const actualDistance = boatTime * speed;
    return actualDistance > race.distance;
}

const runRaces = (races: iRace[]): number => {
    races.forEach(race => {
        for (let x = 0; x <= race.time; ++x) {
            const winner = isWinningRace(x, race);
            if (winner) {
                race.winningOptions.push(x);
            }
        }
    });

    const winningOptionsCounts = races.map(race => race.winningOptions.length);
    const result = winningOptionsCounts.reduce((prev, current) => prev * current, 1);
    return result;
}

(() => {
    const races = parseInput(input, false);
    const result = runRaces(races);
    console.log('part1:', result);
})();

(() => {
    const races = parseInput(input, true);
    const result = runRaces(races);
    console.log('part2:', result);
})();
