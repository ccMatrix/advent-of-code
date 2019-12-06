import { shuffle, sum } from 'lodash';
import { assertEquals, readFileContents } from '../helper';

(() => {

    const countOrbits = (orbits: string[]) => {
        const allOrbits = new Map<string, string[]>();
        const orbitMap = new Map<string, number>();

        const processOrbit = (orbit: string) => {
            const parentValue = orbitMap.get(orbit);
            const satellites = allOrbits.get(orbit);
            if (!satellites) {
                return;
            }
            satellites.forEach((satellite) => {
                orbitMap.set(satellite, parentValue + 1);
                processOrbit(satellite);
            });
        };

        orbits.forEach((orbit) => {
            const [A, B] = orbit.split(')');
            if (allOrbits.has(A)) {
                allOrbits.get(A).push(B);
            } else {
                allOrbits.set(A, [B]);
            }
        });

        orbitMap.set('COM', 0);
        processOrbit('COM');
        return sum(Array.from(orbitMap.values()));
    };

    const testData = ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L'];
    assertEquals(42, countOrbits(testData));
    assertEquals(42, countOrbits(testData.reverse()));
    assertEquals(42, countOrbits(shuffle(testData)));

    const input = readFileContents('day6/input.txt', '\n');
    const data = input.filter((d) => d !== '');
    console.log(countOrbits(data));
})();
