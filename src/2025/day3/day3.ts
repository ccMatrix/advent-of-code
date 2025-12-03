import * as fs from 'node:fs';
import * as path from 'node:path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim());

const findHighest2DigitNumber = (data: string): number => {
    for (let i = 99; i >= 10; i--) {
        const strNum = i.toString();
        const first = parseInt(strNum.charAt(0), 10);
        const second = parseInt(strNum.charAt(1), 10);
        const regex = new RegExp(`${first}\\d*${second}`);
        if (data.match(regex)) {
            return i;
        }
    }

    throw new Error('No valid number found');
};

const findHighest2DigitNumbers = (data: string[]): number[] =>
    data.map(line => findHighest2DigitNumber(line));

const findHighest12DigitNumber = (data: string): number => {
    const toRemove = data.length - 12;
    const stack: string[] = [];
    let removed = 0;

    for (const digit of data) {
        while (stack.length > 0 && stack[stack.length - 1] < digit && removed < toRemove) {
            stack.pop();
            removed++;
        }
        stack.push(digit);
    }

    return parseInt(stack.slice(0, 12).join(''), 10);
};

const findHighest12DigitNumbers = (data: string[]): number[] =>
    data.map(line => findHighest12DigitNumber(line));

const totalJoltageOutput = (numbers: number[]): number =>
    numbers.reduce((a, b) => a + b, 0);

console.log('Total Joltage 2:', totalJoltageOutput(findHighest2DigitNumbers(input)));
console.log('Total Joltage 12:', totalJoltageOutput(findHighest12DigitNumbers(input)));
