import { splitFileContents } from '../helper';

(() => {
    enum Field {
        Open,
        Tree,
    };
    interface Point {
        x: number;
        y: number;
    };
    interface Slope {
        move: Point;
        encounters: Field[];
    }

    const traverse = (pos: Point, slope: Slope, space: Field[][]) => {
        if (pos.y >= space.length) {
            return;
        }

        pos.x = pos.x % space[0].length;
        if (space[pos.y][pos.x] === Field.Tree) {
            slope.encounters.push(Field.Tree);
        }
        return traverse({ x: pos.x + slope.move.x, y: pos.y + slope.move.y }, slope, space);
    }

    const input = splitFileContents('day3/input.txt', '\n')
        .map<Field[]>(line => line.split('').map<Field>(d => {
            if (d === '.') {
                return Field.Open;
            }
            else if (d === '#') {
                return Field.Tree;
            }
        }));

    const slopes: Slope[] = [
        { move: { x: 1, y: 1 }, encounters: [] },
        { move: { x: 3, y: 1 }, encounters: [] },
        { move: { x: 5, y: 1 }, encounters: [] },
        { move: { x: 7, y: 1 }, encounters: [] },
        { move: { x: 1, y: 2 }, encounters: [] },
    ];

    slopes.forEach(slope => {
        traverse({ x: 0, y: 0 }, slope, input);
    });

    const totalTrees = slopes.reduce<number>((counter, slope) => counter * slope.encounters.length, 1);

    console.log('Total Trees: ', totalTrees);
})();
