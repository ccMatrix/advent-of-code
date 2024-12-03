import * as fs from 'fs';
import * as path from 'path';

const mulRegex = new RegExp(/mul\((?<first>\d{1,3}),(?<second>\d{1,3})\)/g);
const extractMuls = (input: string) => input.match(mulRegex);

const instructionRegex = new RegExp(/(?<op>mul)\((?<first>\d{1,3}),(?<second>\d{1,3})\)|(?<op>do)\(\)|(?<op>don)'t\(\)/g);
const extractInstructions = (input: string) => input.match(instructionRegex);

const executeMuls = (muls: string[]) => {
    let runMul = true;
    const results = muls.map(mul => {
        const matches = mul.matchAll(instructionRegex);
        for (const match of matches) {
            if (match.groups) {
                switch (match.groups['op']) {
                    case 'do':
                        runMul = true;
                        break;
                    case 'don':
                        runMul = false;
                    case 'mul':
                        if (runMul) {
                            return parseInt(match.groups['first'], 10) * parseInt(match.groups['second'], 10);
                        }
                        return 0;
                }
            }
        }
        return 0;
    });
    return results.reduce((prev, current) => prev + current, 0);
}

const muls = extractMuls(fs.readFileSync(path.join(__dirname, 'input.txt')).toString());
const testMuls = extractMuls('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))');

console.log('Test Result 1', executeMuls(testMuls));
console.log('Mul Result 1', executeMuls(muls));

const testInstructions = extractInstructions("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))");
const instructions = extractInstructions(fs.readFileSync(path.join(__dirname, 'input.txt')).toString());

console.log('Test Result 2', executeMuls(testInstructions));
console.log('Mul Result 2', executeMuls(instructions));
