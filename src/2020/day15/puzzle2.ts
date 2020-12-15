import { last } from 'lodash';
import { assertEquals } from '../helper';

(() => {
    const input = [ 12,1,16,3,11,0 ];

    const examples = [
        { input: [ 0,3,6 ], finalPos: 2020, result: 436 },
        { input: [ 1,3,2 ], finalPos: 2020, result: 1 },
        { input: [ 2,1,3 ], finalPos: 2020, result: 10 },
        { input: [ 1,2,3 ], finalPos: 2020, result: 27 },
        { input: [ 2,3,1 ], finalPos: 2020, result: 78 },
        { input: [ 3,2,1 ], finalPos: 2020, result: 438 },
        { input: [ 3,1,2 ], finalPos: 2020, result: 1836 },

        { input: [ 0,3,6 ], finalPos: 30000000, result: 175594 },
        { input: [ 1,3,2 ], finalPos: 30000000, result: 2578 },
        { input: [ 2,1,3 ], finalPos: 30000000, result: 3544142 },
        { input: [ 1,2,3 ], finalPos: 30000000, result: 261214 },
        { input: [ 2,3,1 ], finalPos: 30000000, result: 6895259 },
        { input: [ 3,2,1 ], finalPos: 30000000, result: 18 },
        { input: [ 3,1,2 ], finalPos: 30000000, result: 362 },
    ];

    interface CacheData {
        first: number;
        second?: number;
    }
    interface Cache {
        [propName: number]: CacheData;
    }

    const runMemoryGame = (data: number[], endPosition: number = 2020) => {
        const mem: number[] = new Array<number>(endPosition);
        const cache: Cache = new Array<CacheData>(endPosition);
        const findLastIndex = (lastNumber: number) => {
            const numbers = cache[lastNumber];
            return numbers.second;
        };
        const setLastIndex = (lastNumber: number, pos: number) => {
            if (cache[lastNumber] === undefined) {
                cache[lastNumber] = {
                    first: pos,
                    second: -1,
                };
            }
            else {
                const cacheData = cache[lastNumber];
                cacheData.second = cacheData.first;
                cacheData.first = pos;
            }
        }

        // Populate cache
        data.forEach((num, idx) => {
            setLastIndex(num, idx);
            mem[idx] = num;
        });

        let position = data.length;
        while (position < endPosition) {
            const lastNumber = mem[position - 1];
            const lastIndex = findLastIndex(lastNumber);
            if (lastIndex === -1) {
                mem[position] = 0;
                setLastIndex(0, position);
            }
            else {
                const value = position - lastIndex - 1;
                mem[position] = value;
                setLastIndex(value, position);
            }
            position++;
        }

        return mem[endPosition - 1];
    }

    console.log('Check examples...');
    examples.forEach((data) => {
        console.log('checking: ', data.input.join(','));
        assertEquals(data.result, runMemoryGame(data.input, data.finalPos));
    });

    console.log('Find solution...');
    const result = runMemoryGame(input, 30000000);
    console.log('memory game position 30000000 is:', result);

})();
