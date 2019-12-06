import { intersection, shuffle } from 'lodash';
import { assertEquals, readFileContents } from '../helper';

(() => {

    const transferOrbits = (orbits: string[]) => {
        const allOrbits = new Map<string, string[]>();
        const orbitMap = new Map<string, number>();

        orbits.forEach((orbit) => {
            const [A, B] = orbit.split(')');
            if (allOrbits.has(A)) {
                allOrbits.get(A).push(B);
            } else {
                allOrbits.set(A, [B]);
            }
        });

        const findPathTo = (target: string) => {
            let targetPath: string[] = [];
            const pathFinder = (steps: string[]) => {
                const current = steps[steps.length - 1];
                const satellites = allOrbits.get(current);
                if (!satellites) {
                    return;
                }
                satellites.forEach((satellite) => {
                    if (satellite === target) {
                        targetPath = steps;
                        return;
                    }
                    pathFinder([...steps, satellite]);
                });
            };
            pathFinder(['COM']);
            return targetPath;
        };

        const youPath = findPathTo('YOU');
        const santaPath = findPathTo('SAN');

        const intersections = intersection(youPath, santaPath);
        const closestIntersect = intersections[intersections.length - 1];

        const youLen = youPath.length - youPath.indexOf(closestIntersect) - 1;
        const santaLen = santaPath.length - santaPath.indexOf(closestIntersect) - 1;

        return youLen + santaLen;
    };

    const testData = ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L', 'K)YOU', 'I)SAN'];
    assertEquals(4, transferOrbits(testData));
    assertEquals(4, transferOrbits(testData.reverse()));
    assertEquals(4, transferOrbits(shuffle(testData)));

    const input = readFileContents('day6/input.txt', '\n');
    const data = input.filter((d) => d !== '');
    console.log(transferOrbits(data));
})();
