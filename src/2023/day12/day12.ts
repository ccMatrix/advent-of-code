import * as fs from 'fs';
import * as path from 'path';
import { flatten } from 'lodash';

interface IBrokenRecord {
    record: string;
    checksum: number[];
}

let records = fs.readFileSync(path.join(__dirname, 'input.txt'))
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

(() => {
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
    const optionsPerLine = records.map(record => {
        const totalRecord =  Array(5).fill(`${record.record}?`).join('');
        const checksums =  flatten([0, ...Array(5).fill(record.checksum)]);
        let localCache: number[][] = [];
        for (let recordIdx = 0; recordIdx < totalRecord.length; recordIdx++) {
            localCache[recordIdx] = [];
        }
        const cache = (recordIdx: number, checksumIdx: number) => {
            if (recordIdx == -1 && checksumIdx == 0) {
                return 1;
            }
            if (localCache[recordIdx]) {
                return localCache[recordIdx][checksumIdx] ?? 0;
            }
            return 0;
        }

        for (let checksumIdx = 0; checksumIdx < checksums.length; checksumIdx++) {
            for (let recordIdx = 0; recordIdx < totalRecord.length; recordIdx++) {
                let currentCount = 0;
                if (totalRecord[recordIdx] != '#') {
                    currentCount += cache(recordIdx - 1, checksumIdx);
                }

                if (checksumIdx > 0) {
                    let shouldCount = true;
                    for (let k = 1; k <= checksums[checksumIdx]; k++) {
                        if (totalRecord[recordIdx - k] == '.') {
                            shouldCount = false;
                        }
                    }
                    if (totalRecord[recordIdx] == '#') {
                        shouldCount = false;
                    }
                    if (shouldCount) {
                        currentCount += cache(recordIdx - checksums[checksumIdx] - 1, checksumIdx - 1);
                    }
                }
                localCache[recordIdx][checksumIdx] = currentCount;
            }
        }
        return localCache[totalRecord.length - 1][checksums.length - 1];
    });
    console.log('Part2:', optionsPerLine.reduce((prev, cur) => prev + cur, 0));
})();

