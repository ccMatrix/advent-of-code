import { assertEquals, readFileContents } from '../helper';

import runCode from './Intcode';

assertEquals([2, 0, 0, 0, 99], runCode([1, 0, 0, 0, 99]));
assertEquals([2, 3, 0, 6, 99], runCode([2, 3, 0, 3, 99]));
assertEquals([2, 4, 4, 5, 99, 9801], runCode([2, 4, 4, 5, 99, 0]));
assertEquals([30, 1, 1, 4, 2, 5, 6, 0, 99], runCode([1, 1, 1, 4, 99, 5, 6, 0, 99]));

const input = readFileContents('day2/input.txt', ',');
const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

// Manipulation before running
data[1] = 12;
data[2] = 2;

const result = runCode(data);

console.log(result[0]);
