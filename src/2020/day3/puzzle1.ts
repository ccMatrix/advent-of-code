import { assertEquals, splitFileContents } from '../helper';

(() => {
    enum Field {
        Open,
        Tree,
    };
    interface Point {
        x: number;
        y: number;
    };
    const encounters: Field[] = [];

    const traverse = (pos: Point, space: Field[][]) => {
        if (pos.y >= space.length) {
            return;
        }

        pos.x = pos.x % space[0].length;
        encounters.push(space[pos.y][pos.x]);
        return traverse({ x: pos.x + 3, y: pos.y + 1 }, space);
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

    traverse({ x: 0, y: 0 }, input);

    const trees = encounters.filter(e => e === Field.Tree);
    console.log('Trees: ', trees.length);
})();
