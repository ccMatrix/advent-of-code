import { assertEquals } from '../helper';

(() => {
    const input = [ 5,1,9,18,13,8,0 ];

    const examples = [
        { input: [ 0,3,6 ], result: 436 },
        { input: [ 1,3,2 ], result: 1 },
        { input: [ 2,1,3 ], result: 10 },
        { input: [ 1,2,3 ], result: 27 },
        { input: [ 2,3,1 ], result: 78 },
        { input: [ 3,2,1 ], result: 438 },
        { input: [ 3,1,2 ], result: 1836 },
    ];

    const runMemoryGame = (data: number[], endPosition: number = 2020) => {
        let position = data.length;
        while (position < endPosition) {
            const lastNumber = data[position - 1];
            const lastIndex = data.lastIndexOf(lastNumber, position - 2);
            if (lastIndex === -1) {
                data[position] = 0;
            }
            else {
                data[position] = position - 1 - lastIndex;
            }
            position++;
        }
        return data[endPosition - 1];
    }

    examples.forEach((data) => {
        assertEquals(data.result, runMemoryGame(data.input));
    });

    const result = runMemoryGame(input);
    console.log('memory game position 2020 is:', result);

})();
