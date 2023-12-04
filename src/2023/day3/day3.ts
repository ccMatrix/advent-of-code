import * as fs from 'fs';
import * as path from 'path';

const engineSchematic = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

(() => {
    let sumSchematics = 0;
    engineSchematic.forEach((line, index, data) => {
        const numbersInLine = line.matchAll(/(\d+)/g);
        for (const matchingNumber of numbersInLine) {
            const numberToFind = matchingNumber[1];
            const numberStartPos = matchingNumber.index!;
            const surroundings = data[Math.max(0, index - 1)].substring(Math.max(0, numberStartPos - 1), numberStartPos + numberToFind.length + 1)
                + data[index].substring(Math.max(0, numberStartPos - 1), numberStartPos + numberToFind.length + 1)
                + data[Math.min(data.length - 1, index + 1)].substring(Math.max(0, numberStartPos - 1), numberStartPos + numberToFind.length + 1)
            ;
            const hasSymbol = surroundings.replace(/[0-9.]+/g, '').length > 0;
            if (hasSymbol) {
                sumSchematics += parseInt(numberToFind, 10);
            }
        }
    });
    console.log('part1:', sumSchematics);
})();

(() => {
    interface IGear {
        x: number;
        y: number;
        value1: number;
        value2: number;
        invalid: boolean;
        ratio: number;
    }
    const gearPos = (searchField: string[], lineIndex: number, startPos: number, gearNumber: string) => {
        const gearPos = searchField[lineIndex].indexOf('*', Math.max(0, startPos - 1));
        if (gearPos >= 0 && gearPos <= startPos + gearNumber.length) {
            return {
                value1: parseInt(gearNumber, 10),
                value2: 0,
                x: gearPos,
                y: lineIndex,
                ratio: 0,
                invalid: false,
            };
        }
        return undefined;
    }
    const gears: IGear[] = [];
    engineSchematic.forEach((line, index, data) => {
        const numbersInLine = line.matchAll(/(\d+)/g);
        for (const matchingNumber of numbersInLine) {
            const numberToFind = matchingNumber[1];
            const numberStartPos = matchingNumber.index!;
            for (let start = Math.max(0, index - 1); start <= Math.min(data.length -1, index + 1); ++start) {
                const gearPosData = gearPos(data, start, numberStartPos, numberToFind);
                if (gearPosData) {
                    const gearExists = gears.find(g => g.x === gearPosData.x && g.y === gearPosData.y);
                    if (gearExists && gearExists.value2 === 0) {
                        gearExists.value2 = gearPosData.value1;
                        gearExists.ratio = gearExists.value1 * gearExists.value2;
                    }
                    else if (gearExists && gearExists.value2 > 0) {
                        gearExists.invalid = true;
                    }
                    else {
                        gears.push(gearPosData);
                    }
                }
            }
        }
    });

    const validGears = gears.filter(g => !g.invalid && g.value2 > 0);

    const sumGearRatios = validGears.reduce((prev, current) => prev + current.ratio, 0);
    console.log('part2:', sumGearRatios);
})();
