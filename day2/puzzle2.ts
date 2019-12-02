import * as fs from 'fs';
import { isEqual, clone } from 'lodash';

const runCode = (input: number[]) => {
    const output = input;
    let i = 0;
    while (i < input.length) {
        const n = input[i];
        switch (n) {
            case 1: 
                const sum = output[output[i + 1]] + output[output[i + 2]];
                output[output[i + 3]] = sum;
                i += 4;
                break;
            case 2:
                const mul = output[output[i + 1]] * output[output[i + 2]];
                output[output[i + 3]] = mul;
                i += 4;
                break;
            case 99:
                i += 1;
                return output;
            default:
                throw Error('Unknown opt code detected!');
        }
    }
    return output;
}

console.log(isEqual(runCode([1,0,0,0,99]), [2,0,0,0,99]));
console.log(isEqual(runCode([2,3,0,3,99]), [2,3,0,6,99]));
console.log(isEqual(runCode([2,4,4,5,99,0]), [2,4,4,5,99,9801]));
console.log(isEqual(runCode([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]));

const input = fs.readFileSync('./day2/input.txt').toString();
const data = input.split(',').filter(d => d !== '').map(d => parseInt(d, 10));

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
