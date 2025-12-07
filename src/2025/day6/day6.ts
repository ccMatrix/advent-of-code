import { last } from 'lodash';
import * as fs from 'node:fs';
import * as path from 'node:path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

const calculateHomework = (data: string[][]): number => {
    const instructions = data.pop();

    const numbers = data.map(line => line.map(num => parseInt(num, 10)));

    const results = instructions.map((inst, index) => {
        switch (inst) {
            case '+':
                return numbers.reduce((sum, nums) => sum + nums[index], 0);
            case '*':
                return numbers.reduce((prod, nums) => prod * nums[index], 1);
            default:
                throw new Error(`Unknown instruction: ${inst}`);
        }
    });

    return results.reduce((a, b) => a + b, 0);
}

const humanMathParsed = input.map(line => line.trim().split(/\s+/));
console.log('Homework result:', calculateHomework(humanMathParsed));

const calculateAdvancedHomework = (data: string[]): number => {
    let result = 0;
    const instructions = data.pop();
    let instructionPointer = 0;
    let lastPosition = 0;
    do {
        const instruction = instructions[instructionPointer];
        lastPosition = instructionPointer;

        const nextPlus = instructions.indexOf('+', instructionPointer + 1);
        const nextMultiply = instructions.indexOf('*', instructionPointer + 1);
        if (nextPlus !== -1 && nextMultiply !== -1) {
            instructionPointer = Math.min(nextPlus, nextMultiply);
        } else if (nextPlus !== -1) {
            instructionPointer = nextPlus;
        } else if (nextMultiply !== -1) {
            instructionPointer = nextMultiply;
        } else {
            instructionPointer = data[0].length + 1;
        }

        const numberStack: number[] = [];
        for (let i = lastPosition; i < instructionPointer - 1; i++) {
            const digits = data.map(line => line[i]);
            const num = parseInt(digits.join(''), 10);
            numberStack.push(num);
        }

        switch (instruction) {
            case '+':
                result += numberStack.reduce((sum, num) => sum + num, 0);
                break;
            case '*':
                result += numberStack.reduce((sum, num) => sum * num, 1);
                break;
            default:
                throw new Error(`Unknown instruction: ${instruction}`);
        }
    } while (instructionPointer < instructions.length && instructionPointer !== -1);

    return result;
};

console.log('Advanced Homework result:', calculateAdvancedHomework(input));