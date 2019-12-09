import { clone } from 'lodash';
import { assertEquals, readFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {

    const input = readFileContents('day7/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runAmplifiers = (memory: number[], settings: number[]) => {
        let output = 0;
        for (let amplifier = 0; amplifier < 5; ++amplifier) {
            const runMemory = clone(memory);
            const parameters = [settings[amplifier], output];
            const intCoder = new IntCoder(runMemory);
            const outputs = intCoder.run(parameters);
            output = outputs.shift();
        }
        return output;
    };

    const findMaxThrust = (memory: number[]) => {
        let maxOutput = 0;
        for (let x = 0; x < 100000; ++x) {
            const settings = x.toString().padStart(5, '0').split('').map((d) => parseInt(d, 10));
            if (!settings.every((d) => d < 5) || clone(settings).sort().join('') !== '01234') {
                continue;
            }
            const output =  runAmplifiers(memory, settings);
            maxOutput = Math.max(output, maxOutput);
        }
        return maxOutput;
    };

    assertEquals(43210, runAmplifiers([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], [4, 3, 2, 1, 0]));
    assertEquals(54321, runAmplifiers([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
        101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], [0, 1, 2, 3, 4]));
    assertEquals(65210, runAmplifiers([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
        1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], [1, 0, 4, 3, 2]));

    console.log(findMaxThrust(data));
})();
