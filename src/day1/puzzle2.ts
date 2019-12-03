import { assertEquals, readFileContents } from '../helper';

const fuelCalc = (mass: number) => {
    if (mass === 0) {
        return 0;
    }
    const fuel = Math.max(Math.floor(mass / 3) - 2, 0);
    return fuel + fuelCalc(fuel);
};

assertEquals(2, fuelCalc(14));
assertEquals(966, fuelCalc(1969));
assertEquals(50346, fuelCalc(100756));

const input = readFileContents('day1/input.txt', '\n');

const totalMass = input
    .filter((d) => d !== '')
    .map((d) => fuelCalc(parseInt(d, 10)))
    .reduce((prev, current) => prev + current);

console.log(totalMass);
