import * as fs from 'fs';

const input = fs.readFileSync('day1/input.txt').toString();

const findNumbers = (transform: boolean) => {
    return input.split('\n')
        .map((line) => {
            if (transform) {
                const numbers = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
                let first = { pos: Infinity, seek: '', target: '' };
                let last = { pos: -1, seek: '', target: '' };
                numbers.forEach((numString, idx) => {
                    const posfirst = line.indexOf(numString);
                    if (posfirst >= 0 && posfirst < first.pos) {
                        first = {pos: posfirst, seek: numString, target: `${idx + 1}`};
                    }
                    const poslast = line.lastIndexOf(numString);
                    if (poslast >= 0 && poslast > last.pos) {
                        last = {pos: poslast, seek: numString, target: `${idx + 1}`};
                    }
                });
                line = line.replace(RegExp(first.seek, 'g'), first.target).replace(RegExp(last.seek, 'g'), last.target);
            }
            const digits = line.match(/(\d{1})/g);
            if (digits) {
                return parseInt(digits[0] + digits[digits.length - 1], 10);
            }
            return 0;
        });
    }

const totalPart1 = findNumbers(false).reduce((prev, current) => { return prev + current }, 0);
console.log('Part1: total number is', totalPart1);

const totalPart2 = findNumbers(true).reduce((prev, current) => { return prev + current }, 0);
console.log('Part2: total number is', totalPart2);
