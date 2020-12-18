import { assertEquals, splitFileContents } from '../helper';

(() => {
    enum Operator {
        Add,
        Mul,
    };

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
                        switch (operator) {
                            case Operator.Add:
                                subResult += parseInt(el, 10);
                                break;
                            case Operator.Mul:
                                subResult *= parseInt(el, 10);
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

    [
        { equation: '2 * 3 + (4 * 5)', result: 26 },
        { equation: '5 + (8 * 3 + 9 + 3 * 4 * 3)', result: 437 },
        { equation: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', result: 12240 },
        { equation: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', result: 13632 },
    ]
    .forEach(example => {
        assertEquals(example.result, runEquation(example.equation));
    });

    const equations = splitFileContents('day18/input.txt', '\n');
    const result = equations.reduceRight((prev, line) => prev + runEquation(line), 0);
    console.log('Sum of all equations is: ', result);
})();
