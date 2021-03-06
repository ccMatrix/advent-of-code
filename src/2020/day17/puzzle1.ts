import { assertEquals, splitFileContents } from '../helper';

(() => {
    class Point {
        x: number;
        y: number;
        z: number;

        constructor(x: number, y: number, z: number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        toKey() {
            return `${this.x}/${this.y}/${this.z}`;
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
        const gameMap: Map<string,boolean> & MapExtension = new Map<string, boolean>();

        const minPoint: Point = new Point(0, 0, 0);
        const maxPoint: Point = new Point(0, 0, 0);

        const z = 0;
        data.forEach((line, y) => {
            line.split('').forEach((cube, x) => {
                const point = new Point(x, y, z);
                if (cube === '#') {
                    gameMap.set(point.toKey(), true);
                }
                minPoint.x = Math.min(minPoint.x, x);
                minPoint.y = Math.min(minPoint.y, y);
                minPoint.z = Math.min(minPoint.z, z);
                maxPoint.x = Math.max(maxPoint.x, x);
                maxPoint.y = Math.max(maxPoint.y, y);
                maxPoint.z = Math.max(maxPoint.z, z);
            });
        });
        gameMap.minPoint = minPoint;
        gameMap.maxPoint = maxPoint;

        return gameMap;
    }

    const collectStates = (map: Map<string, boolean>, point: Point) => {
        const states: boolean[] = [];
        for (let x = point.x - 1; x <= point.x + 1; ++x) {
            for (let y = point.y - 1; y <= point.y + 1; ++y) {
                for (let z = point.z - 1; z <= point.z + 1; ++z) {
                    const statePoint = new Point(x, y, z);
                    if (statePoint.x === point.x &&
                        statePoint.y === point.y &&
                        statePoint.z === point.z) {
                        continue;
                    }
                    if (!!map.get(statePoint.toKey())) {
                        states.push(true);
                    }
                }
            }
        }
        return states;
    }

    const runGame = (map: Map<string,boolean> & MapExtension, iteration: number = 6) => {
        if (iteration === 0) {
            return Array.from(map.values()).filter(v => v).length;
        }

        const nextMap: Map<string,boolean> & MapExtension = new Map<string, boolean>();
        nextMap.minPoint = new Point(
            map.minPoint.x - 1,
            map.minPoint.y - 1,
            map.minPoint.z - 1,
        );
        nextMap.maxPoint = new Point(
            map.maxPoint.x + 1,
            map.maxPoint.y + 1,
            map.maxPoint.z + 1,
        );

        for (let x = map.minPoint.x - 1; x <= map.maxPoint.x + 1; ++x) {
            for (let y = map.minPoint.y - 1; y <= map.maxPoint.y + 1; ++y) {
                for (let z = map.minPoint.z - 1; z <= map.maxPoint.z + 1; ++z) {
                    const point = new Point(x, y, z);
                    const states = collectStates(map, point);

                    const active = states.length;
                    const currentState = !!map.get(point.toKey());
                    if (currentState && !(active === 2 || active === 3)) {
                        nextMap.delete(point.toKey());
                    }
                    else if (!currentState && active === 3) {
                        nextMap.set(point.toKey(), true);
                    }
                    else if (currentState) {
                        nextMap.set(point.toKey(), currentState);
                    }
                }
            }
        }

        return runGame(nextMap, iteration - 1);
    }

    const exampleGame = parseInput(exampleInput);
    const exampleActiveCubes = runGame(exampleGame, 6);
    assertEquals(112, exampleActiveCubes);

    const game = parseInput(input);
    const activeCubes = runGame(game, 6);
    console.log('active cubes after 6 iterations:', activeCubes);

})();
