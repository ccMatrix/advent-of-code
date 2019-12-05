import { assertFalse, assertTrue, readFileContents } from '../helper';
import intCode from '../Intcode';

(() => {
    const input = readFileContents('day5/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const outputs: number[] = [];
    intCode(data, 1, outputs);
    const diagnosticCode = outputs[outputs.length - 1];
    console.log(diagnosticCode);
})();
