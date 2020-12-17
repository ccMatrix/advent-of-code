import { assertEquals, splitFileContents } from '../helper';

(() => {
    class Point {
        public w: number;
        public x: number;
        public y: number;
        public z: number;

        constructor(w: number, x: number, y: number, z: number) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public toKey() {
            return `${this.w}/${this.x}/${this.y}/${this.z}`;
        }
    }

    const exampleInput = [
        '.#.',
        '..#',
        '###',
    ];

    const input = splitFileContents('day17/input.txt', '\n');

    interface MapExtension {
        minPoint?: Point;
        maxPoint?: Point;
    }

    const parseInput = (data: string[]): Map<string, boolean> & MapExtension => {
        const gameMap: Map<string, boolean> & MapExtension = new Map<string, boolean>();

        const z = 0;
        const w = 0;
        gameMap.minPoint = new Point(0, 0, 0, 0);
        data.forEach((line, y) => {
            line.split('').forEach((cube, x) => {
                const point = new Point(w, x, y, z);
                if (cube === '#') {
                    gameMap.set(point.toKey(), true);
                }

                gameMap.maxPoint = new Point(w, x, y, z);
            });
        });

        return gameMap;
    };

    const collectStates = (map: Map<string, boolean>, point: Point) => {
        const states: boolean[] = [];
        const pointKey = point.toKey();
        for (let w = point.w - 1; w <= point.w + 1; ++w) {
            for (let x = point.x - 1; x <= point.x + 1; ++x) {
                for (let y = point.y - 1; y <= point.y + 1; ++y) {
                    for (let z = point.z - 1; z <= point.z + 1; ++z) {
                        const statePoint = new Point(w, x, y, z);
                        const stateKey = statePoint.toKey();
                        if (stateKey === pointKey) {
                            continue;
                        }
                        if (!!map.get(stateKey)) {
                            states.push(true);
                        }
                    }
                }
            }
        }
        return states;
    };

    const runGame = (map: Map<string, boolean> & MapExtension, iteration: number = 6) => {
        if (iteration === 0) {
            return Array.from(map.values()).length;
        }

        const nextMap: Map<string, boolean> & MapExtension = new Map<string, boolean>();
        nextMap.minPoint = new Point(
            map.minPoint.w - 1,
            map.minPoint.x - 1,
            map.minPoint.y - 1,
            map.minPoint.z - 1,
        );
        nextMap.maxPoint = new Point(
            map.maxPoint.w + 1,
            map.maxPoint.x + 1,
            map.maxPoint.y + 1,
            map.maxPoint.z + 1,
        );

        for (let w = map.minPoint.w - 1; w <= map.maxPoint.w + 1; ++w) {
            for (let x = map.minPoint.x - 1; x <= map.maxPoint.x + 1; ++x) {
                for (let y = map.minPoint.y - 1; y <= map.maxPoint.y + 1; ++y) {
                    for (let z = map.minPoint.z - 1; z <= map.maxPoint.z + 1; ++z) {
                        const point = new Point(w, x, y, z);
                        const states = collectStates(map, point);

                        const active = states.length;
                        const currentState = !!map.get(point.toKey());
                        if (currentState && !(active === 2 || active === 3)) {
                            nextMap.delete(point.toKey());
                        } else if (!currentState && active === 3) {
                            nextMap.set(point.toKey(), true);
                        } else if (currentState) {
                            nextMap.set(point.toKey(), currentState);
                        }
                    }
                }
            }
        }

        return runGame(nextMap, iteration - 1);
    };

    const exampleGame = parseInput(exampleInput);
    const exampleActiveCubes = runGame(exampleGame, 6);
    assertEquals(848, exampleActiveCubes);

    const game = parseInput(input);
    const activeCubes = runGame(game, 6);
    console.log('active cubes after 6 iterations:', activeCubes);

})();
