import * as fs from 'fs';
import { clone } from 'lodash';
import { assertEquals, readFileContents } from '../helper';

import runCode from './Intcode';

assertEquals([2,0,0,0,99], runCode([1,0,0,0,99]));
assertEquals([2,3,0,6,99], runCode([2,3,0,3,99]));
assertEquals([2,4,4,5,99,9801], runCode([2,4,4,5,99,0]));
assertEquals([30,1,1,4,2,5,6,0,99], runCode([1,1,1,4,99,5,6,0,99]));

const input = readFileContents('day2/input.txt', ',');
const data = input.filter(d => d !== '').map(d => parseInt(d, 10));

// Manipulation before running
const findSolution = (program: number[], noun: number, verb: number) => {
    try {
        const variation = program;
        variation[1] = noun;
        variation[2] = verb;
        const result = runCode(variation);
        return (result[0] === 19690720);
    }
    catch {
        return false;
    }
}

const range = () => {
    return Array.from(Array(100).keys());
}

for (const noun of range()) {
    for (const verb of range()) {
        const program = clone(data);
        if (findSolution(program, noun, verb)) {
            console.log(100 * noun + verb);
        }
    }
}
