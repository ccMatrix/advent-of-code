import * as fs from 'fs';

const fuelCalc = (mass: number) => {
    return Math.floor(mass / 3) - 2;
}

console.log(fuelCalc(12) === 2);
console.log(fuelCalc(14) === 2);
console.log(fuelCalc(1969) === 654);
console.log(fuelCalc(100756) === 33583);

const input = fs.readFileSync('./day1/input.txt').toString();
const totalMass = input
    .split('\n')
    .filter(d => d !== '')
    .map(d => fuelCalc(parseInt(d, 10)))
    .reduce((prev, current) => prev + current);

console.log(totalMass);