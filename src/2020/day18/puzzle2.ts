import { assertEquals, splitFileContents } from '../helper';

(() => {
    const runEquation = (line: string) => {
        const runSubEquation = (equation: string): number => {
            const elements = equation.split(' ').map(x => ['+', '*'].includes(x) ? x : parseInt(x, 10));

            while (elements.includes('+')) {
                const addPos = elements.indexOf('+');
                const value = (elements[addPos - 1] as number) + (elements[addPos + 1] as number);
                elements.splice(addPos - 1, 3, value);
            }

            return elements
                .filter(el => el !== '*')
                .map<number>(el => el as number)
                .reduceRight((prev: number, num: number) => prev * num, 1);
        };

        while (true) {
            const subEquation = line.match(/\(([0-9+*\s]+)\)/);
            if (subEquation) {
                const equationResult = runSubEquation(subEquation[1]);
                line = line.replace(subEquation[0], `${equationResult}`);
            }
            else {
                return runSubEquation(line);
            }
        }
    };

    [
        { equation: '1 + (2 * 3) + (4 * (5 + 6))', result: 51 },
        { equation: '2 * 3 + (4 * 5)', result: 46 },
        { equation: '5 + (8 * 3 + 9 + 3 * 4 * 3)', result: 1445 },
        { equation: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', result: 669060 },
        { equation: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', result: 23340 },
    ]
    .forEach(example => {
        assertEquals(example.result, runEquation(example.equation));
    });

    const equations = splitFileContents('day18/input.txt', '\n');
    const result = equations.reduceRight((prev, line) => prev + runEquation(line), 0);
    console.log('Sum of all equations is: ', result);
})();
