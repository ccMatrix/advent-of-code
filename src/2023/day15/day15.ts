import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split(',');

const calcHash = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; ++i) {
        const ascii = input.charCodeAt(i);
        hash += ascii;
        hash *= 17;
        hash %= 256;
    }
    return hash;
}

(() => {
    const hashes = input.map(line => calcHash(line));
    const totalSum = hashes.reduceRight((prev, current) => prev + current, 0);
    console.log('Hash sum:', totalSum);
})();

(() => {
    interface ILens {
        hash: number;
        key: string;
        focal: number;
    }

    let boxes: Array<Array<ILens>> = [];
    for (let i = 0; i < 256; i++) {
        boxes[i] = [];
    }

    input.forEach(line => {
        const match = line.match(/(.+)(=|-)(\d*)/);
        const key = match[1];
        const hash = calcHash(key);
        switch (match[2]) {
            case '-': {
                const idx = boxes[hash].findIndex(l => l.key === key);
                if (idx >= 0) {
                    boxes[hash].splice(idx, 1);
                }
                break;
            }
            case '=':  {
                const lens: ILens = { hash, key, focal: parseInt(match[3], 10) };
                const exists = boxes[hash].find(l => l.key === key);
                if (exists) {
                    exists.focal = lens.focal;
                }
                else {
                    boxes[hash].push(lens);
                }
                break;
            }
        }
    });
    const focusPower = boxes.reduce((prev, current, index) => {
        const box = index + 1;
        for (let idx = 0; idx < current.length; ++idx) {
            const slot = idx + 1;
            prev += box * slot * current[idx].focal;
        }
        return prev;
    }, 0);
    console.log('Focus power', focusPower);
})();