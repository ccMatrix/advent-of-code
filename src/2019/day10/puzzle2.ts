import { isEqual, maxBy, sortBy } from 'lodash';
import * as manhattan from 'manhattan';
import { assertEquals, splitFileContents } from '../helper';

interface IBase {
    position: IPoint;
    asteroids: Map<number, ILines>;
    targets: number;
}

interface IPoint {
    x: number;
    y: number;
    distance: number;
}

interface ILines {
    left: IPoint[];
    right: IPoint[];
}

enum Side {
    Right = 1,
    Left = 2,
}

(() => {

    const input = splitFileContents('day10/input.txt', '\n');
    const data = input.filter((d) => d !== '');

    const destructionOrder = (lines: string[]) => {
        const bases: IBase[] = [];
        const space = lines.map((line) => line.split(''));

        const getAsteroids = (point: IPoint) => {
            const xlen = space[0].length;
            const ylen = space.length;

            const asteroids: IPoint[] = [];

            for (let x = 0; x < xlen; x++) {
                for (let y = 0; y < ylen; y++) {
                    if (space[y][x] === '#') {
                        const asteroid: IPoint = { x, y, distance: 0 };
                        if (!isEqual(asteroid, point)) {
                            asteroids.push({ x, y, distance: 0 });
                        }
                    }
                }
            }

            const individual = new Map<number, ILines>();
            asteroids.forEach((asteroid) => {
                let m: number;
                const home: IPoint = { x: 0, y: 0, distance: 0 };
                const target: IPoint = {
                    distance: 0,
                    x: asteroid.x - point.x,
                    y: asteroid.y - point.y,
                };

                if (home.x === target.x) {
                    m = 100000000;
                } else if (home.y === target.y) {
                    m = 0;
                } else {
                    m = (target.y - home.y) / (target.x - home.x);
                }

                let line = {
                    left: [],
                    right: [],
                };
                if (individual.has(m)) {
                    line = individual.get(m);
                }

                target.distance = manhattan([0, 0], [target.x, target.y]);

                if (target.x === 0) {
                    if (target.y > 0) {
                        line.right.push(target);
                    } else {
                        line.left.push(target);
                    }
                } else if (target.x >= 0) {
                    line.right.push(target);
                } else {
                    line.left.push(target);
                }
                individual.set(m, line);
            });

            return individual;
        };

        space.forEach((line, y) => {
            line.forEach((pos, x) => {
                if (pos === '#') {
                    const position: IPoint = { x, y, distance: 0 };
                    const asteroids = getAsteroids(position);
                    const targets = Array.from(asteroids.values()).reduceRight<number>((cur, val) => (cur + (val.left.length > 0 ? 1 : 0) + (val.right.length > 0 ? 1 : 0)), 0);
                    bases.push({ position, asteroids, targets });
                }
            });
        });

        const base = maxBy(bases, (b) => b.targets);

        Array.from(base.asteroids.values()).forEach((a) => {
            a.left = sortBy(a.left, ['distance']);
            a.right = sortBy(a.right, ['distance']);
        });

        const sortedKeys = Array.from(base.asteroids.keys());
        sortedKeys.sort((a, b) => b - a);
        let side = Side.Right;
        const allTargets: IPoint[] = [];
        while (true) {
            sortedKeys.forEach((key) => {
                const meta = base.asteroids.get(key);
                switch (side) {
                    case Side.Right:
                        if (meta.right.length > 0) {
                            allTargets.push(meta.right.shift());
                        }
                        break;
                    case Side.Left:
                        if (meta.left.length > 0) {
                            allTargets.push(meta.left.shift());
                        }
                        break;
                }
            });
            side = (side === Side.Right) ? Side.Left : Side.Right;

            if (Array.from(base.asteroids.values()).every((a) => a.left.length === 0 && a.right.length === 0)) {
                break;
            }
        }

        allTargets.forEach((point, index) => {
            if (point.x === 8 && point.y === 2) {
                console.log(index);
            }
        });
        console.log(allTargets.length);
        const twohundreth = allTargets[199];
        return (100 * twohundreth.x) + twohundreth.y;
    };

    const test = [
        '.#..##.###...#######',
        '##.############..##.',
        '.#.######.########.#',
        '.###.#######.####.#.',
        '#####.##.#.##.###.##',
        '..#####..#.#########',
        '####################',
        '#.####....###.#.#.##',
        '##.#################',
        '#####.##.###..####..',
        '..######..##.#######',
        '####.##.####...##..#',
        '.#####..#.######.###',
        '##...#.##########...',
        '#.##########.#######',
        '.####.#.###.###.#.##',
        '....##.##.###..#####',
        '.#.#.###########.###',
        '#.#.#.#####.####.###',
        '###.##.####.##.#..##',
    ];
    assertEquals(802, destructionOrder(test));


    console.log(destructionOrder(data));

})();
