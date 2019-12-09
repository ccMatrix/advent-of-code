import { assertFalse, assertTrue, splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {
    const input = splitFileContents('day5/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const intCoder = new IntCoder(data);
    intCoder.run([1]);
    const diagnosticCode = intCoder.lastOutput;
    console.log(diagnosticCode);
})();
