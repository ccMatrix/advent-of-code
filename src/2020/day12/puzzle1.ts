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
        const position: Point = { x: 0, y: 0 };
        let direction: Point = directions.east;

        data.forEach((line) => {
            const [ _, command, val ] = line.match(/([A-Z]{1})(\d+)/);
            const value = parseInt(val, 10);
            switch (command) {
                case 'N':
                    position.y += value;
                    break;
                case 'S':
                    position.y -= value;
                    break;
                case 'E':
                    position.x += value;
                    break;
                case 'W':
                    position.x -= value;
                    break;
                case 'L':
                    if (value === 90) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.north;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.west;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.east;
                        }
                    } else if (value === 180) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.west;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.east;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.north;
                        }
                    } else if (value === 270) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.east;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.north;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.west;
                        }
                    } else {
                        throw new Error('unknown rotation: ' + value);
                    }
                    break;
                case 'R':
                    if (value === 90) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.east;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.north;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.west;
                        }
                    } else if (value === 180) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.west;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.east;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.north;
                        }
                    } else if (value === 270) {
                        if (isEqual(direction, directions.east)) {
                            direction = directions.north;
                        } else if (isEqual(direction, directions.north)) {
                            direction = directions.west;
                        } else if (isEqual(direction, directions.west)) {
                            direction = directions.south;
                        } else if (isEqual(direction, directions.south)) {
                            direction = directions.east;
                        }
                    } else {
                        throw new Error('unknown rotation');
                    }
                    break;
                case 'F':
                    position.x += (direction.x * value);
                    position.y += (direction.y * value);
                    break;
            }
        });

        return Math.abs(position.x) + Math.abs(position.y);
    };

    const exampleResult = followInstructions(exampleInput1);
    assertEquals(25, exampleResult);

    const result = followInstructions(input);
    console.log('final manhattan distance is: ', result);
})();
