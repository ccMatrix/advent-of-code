import { clone } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';
import intCode, { Status } from '../Intcode';
import IntCoder from '../Intcode';

(() => {

    const input = splitFileContents('day7/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runAmplifiers = (memory: number[], settings: number[]) => {
        const engines = [
            new IntCoder(memory),
            new IntCoder(memory),
            new IntCoder(memory),
            new IntCoder(memory),
            new IntCoder(memory),
        ];
        const inputs = [
            [settings[0], 0],
            [settings[1]],
            [settings[2]],
            [settings[3]],
            [settings[4]],
        ];

        while (engines.every((engine) => engine.status !== Status.Break)) {
            for (let amplifier = 0; amplifier < 5; ++amplifier) {
                const engine = engines[amplifier];
                const outputs = engine.run(inputs[amplifier]);
                const output = inputs[amplifier === 4 ? 0 : amplifier + 1];
                outputs.forEach((out) => output.push(out));
            }
        }

        return engines[engines.length - 1].lastOutput;
    };

    const findMaxThrust = (memory: number[]) => {
        let maxOutput = 0;
        for (let x = 0; x < 100000; ++x) {
            const settings = x.toString().padStart(5, '0').split('').map((d) => parseInt(d, 10));
            if (!settings.every((d) => d >= 5) || clone(settings).sort().join('') !== '56789') {
                continue;
            }
            const output =  runAmplifiers(memory, settings);
            maxOutput = Math.max(output, maxOutput);
        }
        return maxOutput;
    };

    assertEquals(139629729, runAmplifiers([3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26,
        27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5], [9, 8, 7, 6, 5]));
    assertEquals(18216, runAmplifiers([3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
        -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
        53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10], [9, 7, 8, 5, 6]));

    console.log(findMaxThrust(data));
})();
