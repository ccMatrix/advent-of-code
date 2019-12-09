import { assertEquals, splitFileContents } from '../helper';
import IntCoder from '../Intcode';

import { clone } from 'lodash';

(() => {
    const runTest = (testData: number[], value: number) => {
        const intCoder = new IntCoder(testData);
        intCoder.run([value]);
        return intCoder.lastOutput;
    };

    const input = splitFileContents('day5/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const testDataInput = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
        1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
        999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99,
    ];
    assertEquals(999, runTest(clone(testDataInput), 7));
    assertEquals(1000, runTest(clone(testDataInput), 8));
    assertEquals(1001, runTest(clone(testDataInput), 9));

    const diagnosticCode = runTest(data, 5);
    console.log(diagnosticCode);
})();
