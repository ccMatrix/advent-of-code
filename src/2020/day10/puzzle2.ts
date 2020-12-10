import { cloneDeep, max, sortBy } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    interface Cache {
        [propName: number]: number;
    }

    const exampleInput1 = [ 16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4 ];

    const exampleInput2 = [ 28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39,
        11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3 ];

    const input = splitFileContents('day10/input.txt', '\n')
        .map<number>(line => parseInt(line, 10));

    const countOptions = (data: number[]): number => {
        const sorted = data.sort((a, b) => a - b);
        const maxRating = max(data) + 3;
        const dataset = [0, ...sorted, maxRating];
        const cache: Cache = {};
        return countOptionsRecursive(dataset, dataset.length, 0, maxRating, cache);
    }

    const countOptionsRecursive = (dataset: number[], length: number, index: number, maxRating: number, cache: Cache): number => {
        let validConnections = 1;
        for (let i = index; i < length - 1; ++i) {
            const next = i + 2;
            const nextNext = i + 3;
            if (length > next && dataset[next] - dataset[i] <= 3) {
                if (cache[next] === undefined) {
                    const result = countOptionsRecursive(dataset, length, next, maxRating, cache);
                    cache[next] = result;
                }
                validConnections += cache[next];
            }
            if (length > nextNext && dataset[nextNext] - dataset[i] <= 3) {
                if (cache[nextNext] === undefined) {
                    const result = countOptionsRecursive(dataset, length, nextNext, maxRating, cache);
                    cache[nextNext] = result;
                }
                validConnections += cache[nextNext];
            }
        }

        return validConnections;
    }

    console.log('verifying examples...');
    assertEquals(8, countOptions(exampleInput1));
    assertEquals(19208, countOptions(exampleInput2));

    console.log('calculating connection options...');
    console.log('Connection options:', countOptions(input));
})();
