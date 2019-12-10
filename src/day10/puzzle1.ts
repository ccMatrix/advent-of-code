import { isEqual, maxBy } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

interface IBase {
    position: IPoint;
    asteroids: number;
}

interface IPoint {
    x: number;
    y: number;
}

(() => {

    const input = splitFileContents('day10/input.txt', '\n');
    const data = input.filter((d) => d !== '');

    const findBase = (lines: string[]) => {
        const bases: IBase[] = [];
        const space = lines.map((line) => line.split(''));

        const countAsteroids = (point: IPoint) => {
            const xlen = space[0].length;
            const ylen = space.length;

            const asteroids: IPoint[] = [];

            for (let x = 0; x < xlen; x++) {
                for (let y = 0; y < ylen; y++) {
                    if (space[y][x] === '#') {
                        const asteroid: IPoint = { x, y };
                        if (!isEqual(asteroid, point)) {
                            asteroids.push({ x, y });
                        }
                    }
                }
            }

            const individual = new Map<number, { left: number, right: number }>();
            asteroids.forEach((asteroid) => {
                let m: number;
                const home: IPoint = { x: 0, y: 0 };
                const target: IPoint = {
                    x: asteroid.x - point.x,
                    y: asteroid.y - point.y,
                };

                if (home.x === target.x) {
                    m = Infinity;
                }
                if (home.y === target.y) {
                    m = 0;
                }

                m = (target.y - home.y) / (target.x - home.x);

                let line = {
                    left: 0,
                    right: 0,
                };
                if (individual.has(m)) {
                    line = individual.get(m);
                }

                if (target.x >= 0) {
                    line.right++;
                } else {
                    line.left++;
                }
                individual.set(m, line);
            });

            return Array.from(individual.values())
                .reduceRight<number>((cur, val) => (cur + (val.left > 0 ? 1 : 0) + (val.right > 0 ? 1 : 0)), 0);
        };

        space.forEach((line, y) => {
            line.forEach((pos, x) => {
                if (pos === '#') {
                    const position: IPoint = { x, y };
                    const asteroids = countAsteroids(position);
                    bases.push({ position, asteroids });
                }
            });
        });

        const base = maxBy(bases, (b) => b.asteroids);
        return [base.position.x, base.position.y, base.asteroids];
    };

    const test1 = ['......#.#.', '#..#.#....', '..#######.', '.#.#.###..', '.#..#.....', '..#....#.#', '#..#....#.', '.##.#..###', '##...#..#.', '.#....####'];
    assertEquals([5, 8, 33], findBase(test1));
    const test2 = ['#.#...#.#.', '.###....#.', '.#....#...', '##.#.#.#.#', '....#.#.#.', '.##..###.#', '..#...##..', '..##....##', '......#...', '.####.###.'];
    assertEquals([1, 2, 35], findBase(test2));
    const test3 = ['.#..#..###', '####.###.#', '....###.#.', '..###.##.#', '##.##.#.#.', '....###..#', '..#.#..#.#', '#..#.#.###', '.##...##.#', '.....#.#..'];
    assertEquals([6, 3, 41], findBase(test3));
    const test4 = [
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
    assertEquals([11, 13, 210], findBase(test4));

    console.log(findBase(data));

})();
