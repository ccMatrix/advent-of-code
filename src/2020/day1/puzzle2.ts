import { without } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day1/input.txt', '\n')
        .map(i => parseInt(i, 10));
    const target = 2020;

    let numbers = input;
    numbers.forEach(a => {
        numbers.forEach(b => {
            numbers.forEach(c => {
                if ((a + b + c) === target) {
                    console.log(`${a} + ${b} + ${c} = 2020`);
                    console.log(`${a} * ${b} * ${c} = ${a * b * c}`);
                    numbers = without(numbers, a, b, c);
                    return;
                }
            })
        })
    })
})();
