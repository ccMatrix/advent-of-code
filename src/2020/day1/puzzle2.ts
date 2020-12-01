import { assertEquals, splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day1/input.txt', '\n')
        .map(i => parseInt(i, 10));
    const target = 2020;

    input.forEach(a => {
        input.forEach(b => {
            input.forEach(c => {
                if ((a + b + c) === target) {
                    console.log(`${a} + ${b} + ${c} = 2020; ${a} * ${b} * ${c} = ${a * b * c}`);
                    return;
                }
            })
        })
    })
})();
