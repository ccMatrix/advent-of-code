import * as fs from 'node:fs';
import * as path from 'node:path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

const gridItem = (grid: string[][], r: number, c: number): string | null => {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) {
        return null;
    }
    return grid[r][c];
}

const countSurroundingsRolls = (grid: string[][], row: number, col: number): number => {
    let count = 0;

    const item = (r: number, c: number): string => gridItem(grid, r, c);

    if (item(row - 1, col - 1) === '@') count++;
    if (item(row - 1, col) === '@') count++;
    if (item(row - 1, col + 1) === '@') count++;
    if (item(row, col - 1) === '@') count++;
    if (item(row, col + 1) === '@') count++;
    if (item(row + 1, col - 1) === '@') count++;
    if (item(row + 1, col) === '@') count++;
    if (item(row + 1, col + 1) === '@') count++;

    return count;
};

const countLiftableRolls = (grid: string[][]): number => {
    let liftableCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (gridItem(grid, row,col) === '@' && countSurroundingsRolls(grid, row, col) < 4) {
                liftableCount++;
            }
        }
    }
    return liftableCount;
};

console.log('Liftable rolls count:', countLiftableRolls(input));

const removeLiftableRolls = (grid: string[][]): number => {
    let liftableCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (gridItem(grid, row,col) === '@' && countSurroundingsRolls(grid, row, col) < 4) {
                grid[row][col] = '.';
                liftableCount++;
            }
        }
    }
    return liftableCount;
};

const removeAllLiftableRolls = (grid: string[][]): number => {
    let totalRemoved = 0;
    while (true) {
        const removedThisRound = removeLiftableRolls(grid);
        if (removedThisRound === 0) {
            break;
        }
        totalRemoved += removedThisRound;
    }
    return totalRemoved;
};

console.log('Total rolls removed:', removeAllLiftableRolls(input));