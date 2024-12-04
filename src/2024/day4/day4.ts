import * as fs from 'fs';
import * as path from 'path';

const parsePuzzle = (input: string): string[] => input.trim().split('\n').map(l => l.trim());

const puzzle = parsePuzzle(fs.readFileSync(path.join(__dirname, 'input.txt')).toString());

const testPuzzle = parsePuzzle('MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX');

const findWord = (puzzle: string[], word: string = 'XMAS') => {
    let totalFound = 0;
    // find in rows
    const wordReverse = word.split('').reverse().join('');
    const check = (checkWord: string) => {
        if ([word, wordReverse].includes(checkWord)) {
            totalFound++;
        }
    }

    // Check all lines
    puzzle.forEach((line) => {
        for (let i = 0; i < line.length - word.length + 1; ++i) {
            const checkWord = line.substring(i, i + word.length);
            check(checkWord);
        }
    });

    // Check all columns
    const maxColumns = puzzle[0].length;
    for (let x = 0; x < maxColumns; x++) {
        for (let y = 0; y < puzzle.length - word.length + 1; y++) {
            let checkWord = '';
            for (let i = 0; i < word.length; i++) {
                checkWord += puzzle[y + i][x];
            }
            check(checkWord);
        }
    }

    // Diagonal 1
    for (let y = 0; y < puzzle.length - word.length + 1; y++) {
        for (let x = 0; x < puzzle.length - word.length + 1; x++) {
            let checkWord = '';
            for (let i = 0; i < word.length; i++) {
                checkWord += puzzle[y + i][x + i];
            }
            check(checkWord);
        }
    }

    // Diagonal 2
    for (let y = 0; y < puzzle.length - word.length + 1; y++) {
        for (let x = puzzle.length - 1; x > word.length - 2; x--) {
            let checkWord = '';
            for (let i = 0; i < word.length; i++) {
                checkWord += puzzle[y + i][x - i];
            }
            check(checkWord);
        }
    }

    return totalFound;
}

const findMases = (puzzle: string[]) => {
    let masses = 0;
    const maxWidth = puzzle[0].length;
    const check = (word: string) =>  ['MAS', 'SAM'].includes(word);

    for (let y = 1; y < puzzle.length - 1; ++y) {
        for (let x = 1; x < maxWidth - 1; x++) {
            if (puzzle[y][x] === 'A') {
                const diag1 = puzzle[y - 1][x - 1] + 'A' + puzzle[y + 1][x + 1];
                const diag2 = puzzle[y - 1][x + 1] + 'A' + puzzle[y + 1][x - 1];

                if (check(diag1) && check(diag2)) {
                    masses++;
                }
            }
        }
    }

    return masses;
}

console.log('Word found', findWord(puzzle, 'XMAS'));
console.log('MASes found', findMases(puzzle));