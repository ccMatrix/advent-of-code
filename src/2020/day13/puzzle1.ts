// tslint:disable: object-literal-sort-keys
import { cloneDeep, isEqual, max, sortBy } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    interface Schedule {
        departure: number;
        lines: number[];
    }

    const parseSchedule = (data: string[]) => {
        const [ startStr, linesStr ] = data;
        return {
            departure: parseInt(startStr, 10),
            lines: linesStr.split(',').filter(x => x !== 'x').map(x => parseInt(x, 10)),
        };
    };

    const exampleSchedule = parseSchedule([
        '939',
        '7,13,x,x,59,x,31,19',
    ]);

    const input = splitFileContents('day13/input.txt', '\n');
    const schedule = parseSchedule(input);

    const findNextDeparture = (schedule: Schedule) => {
        const data: Array<{ line: number, nextDeparture: number, wait: number }> = [];
        schedule.lines.forEach(line => {
            const factor = Math.ceil(schedule.departure / line);
            data.push({
                line,
                nextDeparture: line * factor,
                wait: (line * factor) - schedule.departure,
            });
        });
        const sorted = sortBy(data, 'wait');
        return sorted[0];
    };

    const exampleResult = findNextDeparture(exampleSchedule);
    assertEquals(295, exampleResult.line * exampleResult.wait);

    const result = findNextDeparture(schedule);
    console.log('Result is:', result.line * result.wait);

})();
