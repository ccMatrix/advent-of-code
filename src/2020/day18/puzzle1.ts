import { assert } from 'console';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    enum Operator {
        Add,
        Mul,
    };

    interface Example {
        equation: string;
        result: number;
    }

    const examples: Example[] = [
        { equation: '2 * 3 + (4 * 5)', result: 26 },
        { equation: '5 + (8 * 3 + 9 + 3 * 4 * 3)', result: 437 },
        { equation: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', result: 12240 },
        { equation: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', result: 13632 },
    ]

    const equations = splitFileContents('day18/input.txt', '\n');

    const runEquation = (line: string) => {
        const runSubEquation = (equation: string) => {
            let subResult = 0;
            let operator = Operator.Add;
            const elements = equation.split(' ');
            elements.forEach(el => {
                switch (el) {
                    case '+':
                        operator = Operator.Add;
                        break;
                    case '*':
                        operator = Operator.Mul;
                        break;
                    default:
                        const num = parseInt(el, 10);
                        switch (operator) {
                            case Operator.Add:
                                subResult += num;
                                break;
                            case Operator.Mul:
                                subResult *= num;
                                break;
                        }
                        break;
                }
            });
            return subResult;
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
