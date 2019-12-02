import { isEqual } from 'lodash';

export const assertTrue = (test: boolean) => {
    if (!test) {
        console.log('Assertion failed. true expected but got false');
        throw Error('Assertion failed');
    }
}

export const assertEquals = (expected: any, current: any) => {
    if (!isEqual(expected, current)) {
        console.log(`Assertion failed. ${JSON.stringify(expected)} expected but got ${JSON.stringify(current)}`);
        throw Error('Assertion failed');
    }
}