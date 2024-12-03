import * as fs from 'fs';
import * as path from 'path';

const reports = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/).map(n => parseInt(n, 10)));

const safetyCheck = (report: number[]) => {
    let isTotalIncreasing;
    for (let i = 0; i < report.length - 1; ++i) {
        const increasing = report[i + 1] > report[i];
        if (isTotalIncreasing === undefined) {
            isTotalIncreasing = increasing;
        }
        if (increasing !== isTotalIncreasing) {
            return false;
        }
        const difference = Math.abs(report[i + 1] - report[i]);
        if (difference < 1 || difference > 3) {
            return false;
        }
    }
    return true;
}

const safetyCheckReports = (reports: number[][]) => {
    return reports.filter(r => safetyCheck(r)).length;
}

const safetyCheckReportsWithDampener = (reports: number[][]) => {
    return reports.filter(r => {
        if (safetyCheck(r)) {
            return true;
        }
        for (var i = 0; i < r.length; ++i) {
            const newReport = r.filter((_, index) => index !== i);
            if (safetyCheck(newReport)) {
                return true;
            }
        }
        return false;
    }).length;
}

const testData = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
];
console.log('Testcase 1', safetyCheckReports(testData));
console.log('Safe reports 1', safetyCheckReports(reports));

console.log('Testcase 2', safetyCheckReportsWithDampener(testData));
console.log('Safe reports 2', safetyCheckReportsWithDampener(reports));