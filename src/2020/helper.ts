import * as fs from 'fs';
import { isEqual } from 'lodash';
import * as path from 'path';

export const assertTrue = (test: boolean) => {
    if (!test) {
        console.log('Assertion failed. true expected but got false');
        throw Error('Assertion failed');
    }
};

export const assertFalse = (test: boolean) => {
    if (test) {
        console.log('Assertion failed. false expected but got true');
        throw Error('Assertion failed');
    }
};

export const assertEquals = (expected: any, current: any) => {
    if (!isEqual(expected, current)) {
        console.log(`Assertion failed. ${JSON.stringify(expected)} expected but got ${JSON.stringify(current)}`);
        throw Error('Assertion failed');
    }
};

export const splitFileContents = (filename: string, delimiter: string) => {
    const data = fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf-8' }).toString().trim();
    return data.split(delimiter);
};

export const readFileContents = (filename: string) => {
    const data = fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf-8' }).toString().trim();
    return data;
};

