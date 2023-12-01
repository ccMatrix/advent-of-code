import * as fs from 'fs';

const input = fs.readFileSync('day1/input.txt').toString();

const findNumbers = (transform: boolean) => {
    return input.split('\n')
        .map((line) => {
            if (transform) {
                const numbers = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
                let smallest = 1000;
                let smallestSeek = '';
                let smallestTarget = '';
                let tallest = -1;
                let tallestSeek = '';
                let tallestTarget = '';
                numbers.forEach((numString, idx) => {
                    const posSmallest = line.indexOf(numString);
                    if (posSmallest >= 0 && posSmallest < smallest) {
                        smallest = posSmallest;
                        smallestSeek = numString;
                        smallestTarget = (idx + 1).toString();
                    }
                    const posTallest = line.lastIndexOf(numString);
                    if (posTallest >= 0 && posTallest > tallest) {
                        tallest = posTallest;
                        tallestSeek = numString;
                        tallestTarget = (idx + 1).toString();
                    }
                });
                line = line.replace(RegExp(smallestSeek, 'g'), smallestTarget)
                    .replace(RegExp(tallestSeek, 'g'), tallestTarget);
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
