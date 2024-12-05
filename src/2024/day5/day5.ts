import * as fs from 'fs';
import * as path from 'path';

const data = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();
const [ instructionsData, updateData ] = data.trim().split('\n\n');
const updates = updateData.split('\n').map(l => l.split(',').map(d => parseInt(d, 10)));

const validator = (update: number[]) => {
    for (let i = 0; i < update.length; ++i) {
        for (let j = i + 1; j < update.length; ++j) {
            const lookup = `${update[i]}|${update[j]}`;
            if (!instructionsData.includes(lookup)) {
                return false;
            }
        }
    }
    return true;
};

const fixUpdate = (updateData: number[]) => {
    const update = [ ...updateData ];
    while (!validator(update)) {
        for (let i = 0; i < update.length; ++i) {
            for (let j = i + 1; j < update.length; ++j) {
                const lookup = `${update[i]}|${update[j]}`;
                if (!instructionsData.includes(lookup)) {
                    const x = update[i];
                    update[i] = update[j];
                    update[j] = x;
                }
            }
        }
    }
    return update;
};

const sumMiddle = (updates: number[][]) =>
    updates.map(f => f[Math.floor(f.length / 2)]).reduce((prev, current) => prev + current, 0);

const correctUpdates = updates.filter(validator);
console.log('Part 1 result is', sumMiddle(correctUpdates));

const incorrectUpdates = updates.filter(update => !validator(update));
const fixedUpdates = incorrectUpdates.map(fixUpdate);
console.log('Part 2 result is', sumMiddle(fixedUpdates));
