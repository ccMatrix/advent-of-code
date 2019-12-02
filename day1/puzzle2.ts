import * as fs from 'fs';

const puzzle = () => {
    const fuelCalc = (mass: number) => {
        if (mass === 0) {
            return 0;
        }
        const fuel = Math.max(Math.floor(mass / 3) - 2, 0);
        return fuel + fuelCalc(fuel);
    }

    console.log(fuelCalc(14) === 2);
    console.log(fuelCalc(1969) === 966);
    console.log(fuelCalc(100756) === 50346);

    const input = fs.readFileSync('./day1/input.txt').toString();
    const totalMass = input
        .split('\n')
        .filter(d => d !== '')
        .map(d => fuelCalc(parseInt(d, 10)))
        .reduce((prev, current) => prev + current);

    console.log(totalMass);
}

export default puzzle;
