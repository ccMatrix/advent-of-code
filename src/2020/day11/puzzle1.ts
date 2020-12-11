import { assert } from 'console';
import { cloneDeep, max, sortBy } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    enum TileType {
        Floor,
        Empty,
        Occupied,
    }

    const parseTiles = (line: string) =>
        line.split('').map(c => {
            switch (c) {
                case '.': return TileType.Floor;
                case 'L': return TileType.Empty;
                case '#': return TileType.Occupied;
                default:
                    throw new Error('Unknown tile: ' + c);
            }
        });

    const exampleInput1 = [
        'L.LL.LL.LL',
        'LLLLLLL.LL',
        'L.L.L..L..',
        'LLLL.LL.LL',
        'L.LL.LL.LL',
        'L.LLLLL.LL',
        '..L.L.....',
        'LLLLLLLLLL',
        'L.LLLLLL.L',
        'L.LLLLL.LL',
     ].map(line => parseTiles(line));

    const input = splitFileContents('day11/input.txt', '\n')
        .map(line => parseTiles(line));


    const collectSurrounding = (data: TileType[][], rowIndex: number, colIndex: number, width: number, height: number) => {
        const surrounding: TileType[] = [];

        if (rowIndex > 0) {
            surrounding.push(data[rowIndex - 1][colIndex]);
        }
        if (rowIndex > 0 && colIndex > 0) {
            surrounding.push(data[rowIndex - 1][colIndex - 1]);
        }
        if (rowIndex > 0 && colIndex < width - 1) {
            surrounding.push(data[rowIndex - 1][colIndex + 1])
        }
        if (colIndex > 0) {
            surrounding.push(data[rowIndex][colIndex - 1]);
        }
        if (colIndex < width - 1) {
            surrounding.push(data[rowIndex][colIndex + 1]);
        }
        if (rowIndex < height - 1) {
            surrounding.push(data[rowIndex + 1][colIndex]);
        }
        if (rowIndex < height - 1 && colIndex > 0) {
            surrounding.push(data[rowIndex + 1][colIndex - 1]);
        }
        if (rowIndex < height - 1 && colIndex < width - 1) {
            surrounding.push(data[rowIndex + 1][colIndex + 1]);
        }
        return surrounding;
    };

    const runCode = (data: TileType[][]) => {
        let changes = 0;
        let source: TileType[][] = cloneDeep(data);
        let target: TileType[][] = cloneDeep(data);
        const width = source[0].length;
        const height = source.length;
        while (true) {
            changes = 0;
            source.forEach((row, ri) => {
                row.forEach((col, ci) => {
                    switch (col) {
                        case TileType.Empty: {
                            const surrounding: TileType[] = collectSurrounding(source, ri, ci, width, height);
                            const occupieds = surrounding.filter(t => t === TileType.Occupied).length;
                            if (occupieds === 0) {
                                target[ri][ci] = TileType.Occupied;
                                changes++;
                            }
                            else {
                                target[ri][ci] = TileType.Empty;
                            }
                            break;
                        }

                        case TileType.Occupied: {
                            const surrounding: TileType[] = collectSurrounding(source, ri, ci, width, height);
                            const occupieds = surrounding.filter(t => t === TileType.Occupied).length;
                            if (occupieds >= 4) {
                                target[ri][ci] = TileType.Empty;
                                changes++;
                            }
                            else {
                                target[ri][ci] = TileType.Occupied;
                            }
                            break;
                        }

                        case TileType.Empty:
                            target[ri][ci] = TileType.Empty;
                            break;
                    }
                })
            });
            if (changes === 0) {
                return target;
            }
            // flip source and target
            const temp = source;
            source = target;
            target = temp;
        }
    }

    const countOccupiedSeats = (data: TileType[][]) => {
        return data.reduceRight(
            (prev, current) => prev + current.filter(c => c === TileType.Occupied).length,
            0
        );
    }

    const exampleResult = runCode(exampleInput1);
    assertEquals(37, countOccupiedSeats(exampleResult));

    const result = runCode(input);
    const occupiedSeats = countOccupiedSeats(result);
    console.log('Total occupied seats: ', occupiedSeats);
})();
