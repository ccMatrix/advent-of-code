import { assertEquals, splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {
    const input = splitFileContents('day9/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runCode = (memory: number[]) => {
        const intCoder = new IntCoder(memory);
        intCoder.run([1]);
        return intCoder.outputs;
    };

    assertEquals([1125899906842624], runCode([104, 1125899906842624, 99]));
    assertEquals([1219070632396864], runCode([1102, 34915192, 34915192, 7, 4, 7, 99, 0]));
    const test3 = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
    assertEquals(test3, runCode(test3));

    console.log(runCode(data));

})();
