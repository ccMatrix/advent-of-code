import * as fs from 'fs';
import * as path from 'path';
import { flattenDeep, merge } from 'lodash';

interface IBrokenRecord {
    record: string;
    checksum: number[];
}

let records = fs.readFileSync(path.join(__dirname, 'sampleInput.txt'))
    .toString()
    .trim()
    .split('\n')
    .map<IBrokenRecord>(line => {
        const [record, checksumStr] = line.trim().split(' ');
        return {
            record,
            checksum: checksumStr.split(',').map(n => parseInt(n, 10)),
        };
    });

const isValidRecord = (record: string, checksum: number[]) => {
    const matches = record.match(/(#+)/g);
    if (!matches) {
        return false;
    }
    if (matches.length !== checksum.length) {
        return false;
    }
    return matches.every((value, index) => value.length === checksum[index]);
};

const variationsGenerator = function* (length: number) {
    for (let i = 0; i < Math.pow(2, length); i++) {
        yield i.toString(2).padStart(length, '0')
            .split('')
            .map(bit => bit === '0' ? '.' : '#')
            .join('');
    }
};

(() => {
    const optionsPerLine = records.map(record => {
        const possibleRecords: string[] = [];
        const matches = record.record.match(/(\?{1})/g);
        const options = [...variationsGenerator(matches.length)];

        options.forEach(option => {
            let tmp = record.record;
            matches.forEach((match, idx) => {
                tmp = tmp.replace(match, option[idx]);
            });
            possibleRecords.push(tmp);
        });

        const validCount = possibleRecords.filter(check => isValidRecord(check, record.checksum)).length;
        return validCount;
    });
    console.log('Part1:', optionsPerLine.reduce((prev, cur) => prev + cur, 0));
})();

(() => {

})();

