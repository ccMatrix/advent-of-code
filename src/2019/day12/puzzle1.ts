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
        iterations: number;
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

        const printMoons = (step: number) => {
            if (step % (options.printEvery || 1) === 0) {
                console.log(`After ${step} steps`);
                moons.forEach((moon) => {
                    const printCoords = (c: ICoordinate) => {
                        return `<x=${c.x}, y=${c.y}, z=${c.z}>`;
                    };
                    console.log(`pos=${printCoords(moon.pos)}, vel=${printCoords(moon.vel)}`);
                });
            }
        };

        printMoons(0);

        for (let iteration = 0; iteration < options.iterations; ++iteration) {

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
        }
    };

    const getTotalEnergy = (moons: IMoon[], options: IOptions) => {
        runIterations(moons, options);
        return moons
            .map((moon) => {
                const sum = (val: ICoordinate) => {
                    return Math.abs(val.x) + Math.abs(val.y) + Math.abs(val.z);
                };
                return sum(moon.pos) * sum(moon.vel);
            })
            .reduceRight((prev, current) => prev + current, 0);
    };

    assertEquals(179, getTotalEnergy([ createMoon(-1, 0, 2), createMoon(2, -10, -7), createMoon(4, -8, 8), createMoon(3, 5, -1)], { iterations: 10, printEvery: 10 }));
    assertEquals(1940, getTotalEnergy([ createMoon(-8, -10, 0), createMoon(5, 5, 10), createMoon(2, -7, 3), createMoon(9, -8, -3)], { iterations: 100, printEvery: 100 }));

    console.log(getTotalEnergy(dataMoons,  { iterations: 1000, printEvery: 100 }));

})();
