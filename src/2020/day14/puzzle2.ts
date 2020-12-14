// tslint:disable: object-literal-sort-keys
import { cloneDeep, sum } from 'lodash';
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
                const value = parseInt(valueStr, 10);
                const binaryAddr = parseInt(addressStr, 10).toString(2).split('').reverse();

                const newValue = [];
                for (let i = 0; i < bitMask.length; ++i) {
                    if (bitMask[i] === '0') {
                        newValue.push(`${binaryAddr[i] || 0}`);
                    }
                    else {
                        newValue.push(bitMask[i]);
                    }
                }

                const addresses: number[] = [];
                const createPermutation = (base: string[]) => {
                    for (let i = 0; i < base.length; ++i) {
                        if (base[i] === 'X') {
                            const zero = cloneDeep(base);
                            const one = cloneDeep(base);
                            zero[i] = '0';
                            one[i] = '1';
                            createPermutation(zero);
                            createPermutation(one);
                            return;
                        }
                    }

                    const address = parseInt(base.reverse().join(''), 2);
                    addresses.push(address);
                }
                createPermutation(newValue);

                addresses.forEach((address) => {
                    mem[address] = value;
                });
            }
        })
        return sum(Object.values(mem));
    }

    const exampleInput = [
        'mask = 000000000000000000000000000000X1001X',
        'mem[42] = 100',
        'mask = 00000000000000000000000000000000X0XX',
        'mem[26] = 1',
    ]
    const exampleMemory = dockingProgram(exampleInput);
    assertEquals(208, exampleMemory);

    const memory = dockingProgram(input);
    console.log('sum of all memories:', memory);

})();
