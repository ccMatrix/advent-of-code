import * as fs from 'fs';
import { isEqual } from 'lodash';
import { assert } from '../helper';

import runCode from './Intcode';

const puzzle = () => {
    assert(isEqual(runCode([1,0,0,0,99]), [2,0,0,0,99]));
    assert(isEqual(runCode([2,3,0,3,99]), [2,3,0,6,99]));
    assert(isEqual(runCode([2,4,4,5,99,0]), [2,4,4,5,99,9801]));
    assert(isEqual(runCode([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]));

    const input = fs.readFileSync('./day2/input.txt').toString();
    const data = input.split(',').filter(d => d !== '').map(d => parseInt(d, 10));

    // Manipulation before running
    data[1] = 12;
    data[2] = 2;

    const result = runCode(data);

    console.log(result[0]);
}

export default puzzle;
