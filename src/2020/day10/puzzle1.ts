import { max, sortBy } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    const exampleInput1 = [ 16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4 ];

    const input = splitFileContents('day10/input.txt', '\n')
        .map<number>(line => parseInt(line, 10));

    interface JoltInfo {
        diff3: number;
        diff1: number;
    }

    const countJolts = (data: number[]): JoltInfo => {
        const sorted = data.sort((a, b) => a - b);
        const dataset = [0, ...sorted, (max(data) + 3)];
        const joltInfo: JoltInfo = {
            diff1: 0,
            diff3: 0,
        };
        for (let i = 0; i < dataset.length - 1; ++i) {
            const diff = (dataset[i + 1] - dataset[i]);
            if (diff === 3) {
                joltInfo.diff3++;
            }
            if (diff === 1) {
                joltInfo.diff1++;
            }
        }
        return joltInfo;
    }

    const exampleJolts = countJolts(exampleInput1);
    assertEquals(7, exampleJolts.diff1);
    assertEquals(5, exampleJolts.diff3);

    const jolts = countJolts(input);
    console.log('result is:', jolts.diff1 * jolts.diff3);
})();
