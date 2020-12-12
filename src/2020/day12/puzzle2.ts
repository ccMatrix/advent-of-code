// tslint:disable: object-literal-sort-keys
import { cloneDeep, isEqual, max, sortBy } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    const exampleInput1 = [
        'F10',
        'N3',
        'F7',
        'R90',
        'F11',
     ];

    const input = splitFileContents('day12/input.txt', '\n');

    interface Point {
        x: number;
        y: number;
    }

    const followInstructions = (data: string[]) => {
        const directions = {
            north: { x: 0, y: 1 },
            east: { x: 1, y: 0 },
            south: { x: 0, y: -1 },
            west: { x: -1, y: 0 },
        };
        const waypoint: Point = { x: 10, y: 1 };
        const position: Point = { x: 0, y: 0 };

        data.forEach((line) => {
            const [ _, command, val ] = line.match(/([A-Z]{1})(\d+)/);
            const value = parseInt(val, 10);
            const tmp = cloneDeep(waypoint);
            switch (command) {
                case 'N':
                    waypoint.y += value;
                    break;
                case 'S':
                    waypoint.y -= value;
                    break;
                case 'E':
                    waypoint.x += value;
                    break;
                case 'W':
                    waypoint.x -= value;
                    break;
                case 'L':
                    if (value === 90) {
                        waypoint.x = tmp.y * -1;
                        waypoint.y = tmp.x;
                    } else if (value === 180) {
                        waypoint.x *= -1;
                        waypoint.y *= -1;
                    } else if (value === 270) {
                        waypoint.x = tmp.y;
                        waypoint.y = tmp.x * -1;
                    } else {
                        throw new Error('unknown rotation: ' + value);
                    }
                    break;
                case 'R':
                    if (value === 90) {
                        waypoint.x = tmp.y;
                        waypoint.y = tmp.x * -1;
                    } else if (value === 180) {
                        waypoint.x *= -1;
                        waypoint.y *= -1;
                    } else if (value === 270) {
                        waypoint.x = tmp.y * -1;
                        waypoint.y = tmp.x;
                    } else {
                        throw new Error('unknown rotation');
                    }
                    break;
                case 'F':
                    position.x += (waypoint.x * value);
                    position.y += (waypoint.y * value);
                    break;
            }
        });

        return Math.abs(position.x) + Math.abs(position.y);
    };

    const exampleResult = followInstructions(exampleInput1);
    assertEquals(286, exampleResult);

    const result = followInstructions(input);
    console.log('final manhattan distance is: ', result);
})();
