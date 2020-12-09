import { max, min, sum } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    const exampleInput = [
        35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182,
        127, 219, 299, 277, 309, 576,
    ]
    const input = splitFileContents('day9/input.txt', '\n')
        .map<number>(line => parseInt(line, 10));

    const findSum = (needle: number, haystack: number[]) => {
        let foundSum = false;
        haystack.forEach((a, ia) => {
            haystack.forEach((b, ib) => {
                if (foundSum || ia === ib) {
                    return;
                }
                if (a + b === needle) {
                    foundSum = true;
                }
            });
        });
        return foundSum;
    };

    const findAnySum = (target: number, data: number[]): number[] => {
        for (let i = 0; i < data.length; ++i) {
            for (let j = i + 1; j < data.length; ++j) {
                const subset = data.slice(i, j);
                const subsetSum = sum(subset);
                if (subsetSum > target) {
                    break;
                }

                if (subsetSum === target) {
                    return subset;
                }
            }
        }
    }

    const decode = (data: number[], preamble: number): number | undefined => {
        for (let i = preamble; i < data.length; ++i) {
            const target = data[i];
            const subset = data.slice(i - preamble, i);
            if (!findSum(target, subset)) {
                const sumMatches = findAnySum(target, data);
                return min(sumMatches) + max(sumMatches);
            }
        }

        return undefined;
    }

    assertEquals(62, decode(exampleInput, 5));

    const wakness = decode(input, 25);
    console.log('weakness is:', wakness);
})();
