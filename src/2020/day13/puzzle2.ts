// tslint:disable: object-literal-sort-keys
import { cloneDeep, isEqual, max, multiply, sortBy, sum } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    interface Line {
        index: number;
        id: number;
    }

    interface Schedule {
        lines: Line[];
    }

    const parseSchedule = (linesStr: string) => {
        return {
            lines: linesStr.split(',').map<Line>((d, idx) => {
                if (d === 'x') {
                    return undefined;
                }
                return {
                    index: idx,
                    id: parseInt(d, 10),
                };
            }).filter((x) => x !== undefined),
        };
    };

    const input = splitFileContents('day13/input.txt', '\n');
    const schedule = parseSchedule(input[1]);

    const findPatternStart = (schedule: Schedule) => {
        let timestamp = 1;
        let step = 1;
        while (true) {
            let totalMatches = 0;
            let nextStep = 1;
            schedule.lines
                .forEach((l) => {
                    const match = ((timestamp + l.index) % l.id) === 0;
                    if (match) {
                        nextStep *= l.id;
                        totalMatches++;
                    }
                });

            step = nextStep;

            if (schedule.lines.length === totalMatches) {
                return timestamp;
            }

            timestamp += step;
        }
    };

    assertEquals(3417, findPatternStart(parseSchedule('17,x,13,19')));
    assertEquals(754018, findPatternStart(parseSchedule('67,7,59,61')));
    assertEquals(779210, findPatternStart(parseSchedule('67,x,7,59,61')));
    assertEquals(1261476, findPatternStart(parseSchedule('67,7,x,59,61')));
    assertEquals(1202161486, findPatternStart(parseSchedule('1789,37,47,1889')));

    assertEquals(1068781, findPatternStart(parseSchedule('7,13,x,x,59,x,31,19')));

    const result = findPatternStart(schedule);
    console.log('Result is:', result);

})();
