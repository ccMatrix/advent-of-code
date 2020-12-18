import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface Example {
        equation: string;
        result: number;
    }

    const examples: Example[] = [
        { equation: '1 + (2 * 3) + (4 * (5 + 6))', result: 51 },
        { equation: '2 * 3 + (4 * 5)', result: 46 },
        { equation: '5 + (8 * 3 + 9 + 3 * 4 * 3)', result: 1445 },
        { equation: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', result: 669060 },
        { equation: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', result: 23340 },
    ]

    const equations = splitFileContents('day18/input.txt', '\n');

    const runEquation = (line: string) => {
        const runSubEquation = (equation: string) => {
            const elements = equation.split(' ');

            do {
                const addPos = elements.findIndex(el => el === '+');
                if (addPos === -1) {
                    break;
                }
                const value = `${parseInt(elements[addPos - 1], 10) + parseInt(elements[addPos + 1], 10)}`;
                elements.splice(addPos - 1, 3, value);
            }
            while (true);

            return elements
                .filter(el => el !== '*')
                .reduceRight((prev, numStr) => prev * parseInt(numStr, 10), 1);
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

    examples.forEach(example => {
        assertEquals(example.result, runEquation(example.equation));
    });

    const result = equations.reduceRight((prev, line) => prev + runEquation(line), 0);
    console.log('Sum of all equations is: ', result);
})();
