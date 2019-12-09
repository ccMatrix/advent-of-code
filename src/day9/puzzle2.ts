import { assertEquals, splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {
    const input = splitFileContents('day9/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runCode = (memory: number[]) => {
        const intCoder = new IntCoder(memory);
        intCoder.run([2]);
        return intCoder.outputs;
    };

    console.log(runCode(data));

})();
