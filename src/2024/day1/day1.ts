import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/).map(n => parseInt(n, 10)));


const totalDistance = (data: number[][]) => {
    const left = data.map(l => l[0]).sort()
    const right = data.map(l => l[1]).sort();
    const distances = left.map((start, index) => Math.abs(right[index] - start));
    return distances.reduce((prev, current) => prev + current, 0);
}

console.log('Total Distances:', totalDistance(input));

const totalSimilarity = (data: number[][]) => {
    const right = data.map(l => l[1]);
    const similarities = data.map(d => {
        const left = d[0];
        const appearances = right.filter(d => d === left).length;
        return left * appearances;
    });

    return similarities.reduce((prev, current) => prev + current, 0);
}

console.log('Total Similarities:', totalSimilarity(input));
