import { sumBy } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface IElement {
        element: string;
        multiplier: number;
    }

    const parseElement = (elementString: string): IElement => {
        const e = elementString.match(/(\d+) ([A-Z]+)/);
        return {
            element: e[2],
            multiplier: parseInt(e[1], 10),
        };
    };

    const parseInput = (file: string) => {
        const input = splitFileContents(`day14/${file}.txt`, '\n');
        const equations = new Map<IElement, IElement[]>();
        input.filter((d) => d !== '')
            .map((l) => l.split(' => '))
            .forEach(([ es, result ]) => {
                const elements = es.split(',').map((e) => parseElement(e));
                const element = parseElement(result);
                equations.set(element, elements);
            });
        return equations;
    };

    const findFuel = (equations: Map<IElement, IElement[]>) => {
        Array.from(equations.keys()).forEach((key) => {
            // replace key in all equations with elements
            const replacement = equations.get(key);
            Array.from(equations.keys()).forEach((target) => {
                if (key.element === target.element) {
                    return;
                }
                const oldElements = equations.get(target);
                const newElements: IElement[] = [];
                oldElements.forEach((e) => {
                    if (e.element === key.element) {
                        replacement.forEach((r) => {
                            newElements.push({
                                element: r.element,
                                multiplier: Math.ceil(e.multiplier / key.multiplier) * r.multiplier,
                            });
                        });
                    } else {
                        newElements.push(e);
                    }
                });
                equations.set(target, newElements);
            });
        });
        const fuelEquationKey = Array.from(equations.keys()).find((k) => k.element === 'FUEL');
        if (fuelEquationKey) {
            return sumBy(equations.get(fuelEquationKey), 'multiplier');
        }
        return 0;
    };

    const test1 = parseInput('p1t1');
    assertEquals(13312, findFuel(test1));
    const test2 = parseInput('p1t2');
    assertEquals(180697, findFuel(test2));
    const test3 = parseInput('p1t3');
    assertEquals(2210736, findFuel(test3));

    // assertEquals(179, getTotalEnergy([ createMoon(-1, 0, 2), createMoon(2, -10, -7), createMoon(4, -8, 8), createMoon(3, 5, -1)], { iterations: 10, printEvery: 10 }));
    // assertEquals(1940, getTotalEnergy([ createMoon(-8, -10, 0), createMoon(5, 5, 10), createMoon(2, -7, 3), createMoon(9, -8, -3)], { iterations: 100, printEvery: 100 }));

    // console.log(getTotalEnergy(dataMoons,  { iterations: 1000, printEvery: 100 }));

})();
