import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface ICoordinate {
        x: number;
        y: number;
        z: number;
    }
    interface IMoon {
        name: string;
        pos: ICoordinate;
        vel: ICoordinate;
    }

    interface IOptions {
        printEvery?: number;
    }

    const createMoon = (x: number, y: number, z: number) => {
        return {
            name: '',
            pos: { x, y, z },
            vel: { x: 0, y: 0, z: 0 },
        };
    };

    const input = splitFileContents('day12/input.txt', '\n');
    const dataMoons: IMoon[] = input
        .filter((d) => d !== '')
        .map((l) => l.match(/<x=(?<x>[0-9-]+), y=(?<y>[0-9-]+), z=(?<z>[0-9-]+)>/))
        .map((matches) => matches.groups)
        .map((pos: any) => createMoon(parseInt(pos.x, 10), parseInt(pos.y, 10), parseInt(pos.z, 10)));

    const calcLcm = (n1: number, n2: number) => {
        const higher = Math.max(n1, n2);
        let lcm = higher;
        const lower = Math.min(n1, n2);
        while (lcm % lower !== 0) {
            lcm += higher;
        }
        return lcm;
    };

    const runIterations = (moons: IMoon[], options: IOptions) => {
        moons[0].name = 'Io';
        moons[1].name = 'Europa';
        moons[2].name = 'Ganymede';
        moons[3].name = 'Callisto';

        const uniquePairName = (moon1: IMoon, moon2: IMoon) => {
            return [moon1.name, moon2.name].sort().join('-');
        };

        const pairMap = new Map<string, IMoon[]>();

        moons.forEach((moon1) => {
            moons.forEach((moon2) => {
                if (moon1.name !== moon2.name) {
                    pairMap.set(uniquePairName(moon1, moon2), [moon1, moon2]);
                }
            });
        });

        const pairs = Array.from(pairMap.values());

        const printMoons = (step: number, force?: boolean) => {
            if ((options.printEvery > 0 && step % (options.printEvery || 1) === 0) || force) {
                console.log(`After ${step} steps`);
                moons.forEach((moon) => {
                    const printCoords = (c: ICoordinate) => {
                        return `<x=${c.x}, y=${c.y}, z=${c.z}>`;
                    };
                    console.log(`pos=${printCoords(moon.pos)}, vel=${printCoords(moon.vel)}`);
                });
            }
        };

        const previousStates = new Map<keyof ICoordinate, string[]>();
        const repeats = new Map<keyof ICoordinate, number>();

        previousStates.set('x', [JSON.stringify(moons.reduceRight<number[]>((prev, moon) => [ ...prev, moon.pos.x, moon.vel.x ], []))]);
        previousStates.set('y', [JSON.stringify(moons.reduceRight<number[]>((prev, moon) => [ ...prev, moon.pos.y, moon.vel.y ], []))]);
        previousStates.set('z', [JSON.stringify(moons.reduceRight<number[]>((prev, moon) => [ ...prev, moon.pos.z, moon.vel.z ], []))]);
        repeats.set('x', 0);
        repeats.set('y', 0);
        repeats.set('z', 0);

        printMoons(0);
        let iteration = 0;
        while (true) {
            // Apply Gravity
            pairs.forEach((m) => {
                const [ moon1, moon2 ] = m;
                const velChange = (first: number, second: number) => {
                    if (first === second) {
                        return [0, 0];
                    }
                    if (first > second) {
                        return [-1, 1];
                    }
                    if (first < second) {
                        return [1, -1];
                    }
                };

                const process = (key: keyof ICoordinate) => {
                    const change = velChange(moon1.pos[key], moon2.pos[key]);
                    moon1.vel[key] += change[0];
                    moon2.vel[key] += change[1];
                };

                process('x');
                process('y');
                process('z');
            });
            // Apply Velocity
            moons.forEach((moon) => {
                const applyVelocity = (key: keyof ICoordinate) => {
                    moon.pos[key] += moon.vel[key];
                };

                applyVelocity('x');
                applyVelocity('y');
                applyVelocity('z');
            });

            printMoons(iteration + 1);
            iteration++;

            const checkState = (key: keyof ICoordinate) => {
                const state = JSON.stringify(moons.reduceRight<number[]>((prev, moon) => [ ...prev, moon.pos[key], moon.vel[key] ], []));
                const lastStates = previousStates.get(key) || [];
                const repeatPos = lastStates.indexOf(state);
                if (repeatPos !== -1 && repeats.get(key) === 0) {
                    repeats.set(key, iteration);
                }
                previousStates.set(key, lastStates);
            };

            checkState('x');
            checkState('y');
            checkState('z');

            if (Array.from(repeats.values()).every((r) => r > 0)) {
                const lcm1 = calcLcm(repeats.get('x'), repeats.get('y'));
                return calcLcm(lcm1, repeats.get('z'));
            }
        }
    };

    assertEquals(2772, runIterations([ createMoon(-1, 0, 2), createMoon(2, -10, -7), createMoon(4, -8, 8), createMoon(3, 5, -1)], { printEvery: 0 }));
    assertEquals(4686774924, runIterations([ createMoon(-8, -10, 0), createMoon(5, 5, 10), createMoon(2, -7, 3), createMoon(9, -8, -3)], { printEvery: 1000 }));

    console.log(runIterations(dataMoons,  { printEvery: 10000 }));
})();
