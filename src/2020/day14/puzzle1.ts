// tslint:disable: object-literal-sort-keys
import { cloneDeep, sum, values } from 'lodash';
import { assertEquals } from '../helper';
import { splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day14/input.txt', '\n');

    const dockingProgram = (data: string[]) => {
        const mem = [];

        let bitMask = [];
        data.forEach((line) => {
            if (line.startsWith('mask')) {
                bitMask = line.substr('mask = '.length).split('').reverse();
            }
            else {
                const [ _, addressStr, valueStr ] = line.match(/mem\[(\d+)\] = (\d+)/);
                const binaryArr = parseInt(valueStr, 10).toString(2).split('').reverse();

                const newValue = [];
                for (let i = 0; i < bitMask.length; ++i) {
                    if (bitMask[i] !== 'X') {
                        newValue.push(bitMask[i]);
                    }
                    else {
                        newValue.push(binaryArr[i] || 0);
                    }
                }
                const value = parseInt(newValue.reverse().join(''), 2);

                mem[parseInt(addressStr, 10)] = value;
            }
        })
        return sum(Object.values(mem));
    }

    const exampleInput = [
        'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
        'mem[8] = 11',
        'mem[7] = 101',
        'mem[8] = 0',
    ]
    const exampleMemory = dockingProgram(exampleInput);
    assertEquals(165, exampleMemory);

    const memory = dockingProgram(input);
    console.log('sum of all memories:', memory);

})();
