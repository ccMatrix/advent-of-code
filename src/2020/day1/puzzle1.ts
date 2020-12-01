import { assertEquals, splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day1/input.txt', '\n')
        .map(i => parseInt(i, 10));
    const target = 2020;

    input.forEach(a => {
        input.forEach(b => {
            if (a !== b && (a + b) === target) {
                console.log(`${a} + ${b} = 2020; ${a} * ${b} = ${a * b}`);
                return;
            }
        })
    })
})();
