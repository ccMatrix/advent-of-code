import * as fs from 'fs';
import { assertEquals } from '../helper';

const puzzle = () => {
    const fuelCalc = (mass: number) => {
        return Math.floor(mass / 3) - 2;
    }

    assertEquals(2, fuelCalc(12));
    assertEquals(2, fuelCalc(14));
    assertEquals(654, fuelCalc(1969));
    assertEquals(33583, fuelCalc(100756));

    const input = fs.readFileSync('./day1/input.txt').toString();
    const totalMass = input
        .split('\n')
        .filter(d => d !== '')
        .map(d => fuelCalc(parseInt(d, 10)))
        .reduce((prev, current) => prev + current);

    console.log(totalMass);
}

export default puzzle;
