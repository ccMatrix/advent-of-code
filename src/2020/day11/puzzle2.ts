import { cloneDeep } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    enum TileType {
        Floor,
        Empty,
        Occupied,
    }

    interface Point {
        x: number;
        y: number;
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

    const walkAndFind = (data: TileType[][], position: Point, direction: Point) => {
        const checkX = position.x + direction.x;
        const checkY = position.y + direction.y;

        if (checkY < 0 || checkY >= data.length) {
            return undefined;
        }

        const row = data[checkY];
        if (checkX < 0 || checkX >= row.length) {
            return undefined;
        }

        const seat = row[checkX];
        if (seat !== TileType.Floor) {
            return seat;
        }

        return walkAndFind(data, { x: checkX, y: checkY }, direction);
    };

    const collectVisible = (data: TileType[][], position: Point) => {
        const surrounding: TileType[] = [];

        surrounding.push(walkAndFind(data, position, { x: -1, y: -1 }));
        surrounding.push(walkAndFind(data, position, { x: -1, y: 0 }));
        surrounding.push(walkAndFind(data, position, { x: -1, y: 1 }));
        surrounding.push(walkAndFind(data, position, { x: 1, y: -1 }));
        surrounding.push(walkAndFind(data, position, { x: 1, y: 0 }));
        surrounding.push(walkAndFind(data, position, { x: 1, y: 1 }));
        surrounding.push(walkAndFind(data, position, { x: 0, y: -1 }));
        surrounding.push(walkAndFind(data, position, { x: 0, y: 1 }));

        return surrounding.filter(s => s !== undefined);
    };

    const runCode = (data: TileType[][]) => {
        let changes = 0;
        let source: TileType[][] = cloneDeep(data);
        let target: TileType[][] = cloneDeep(data);
        while (true) {
            changes = 0;
            source.forEach((row, ri) => {
                row.forEach((col, ci) => {
                    switch (col) {
                        case TileType.Empty: {
                            const surrounding: TileType[] = collectVisible(source, { x: ci, y: ri });
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
                            const surrounding: TileType[] = collectVisible(source, { x: ci, y: ri });
                            const occupieds = surrounding.filter(t => t === TileType.Occupied).length;
                            if (occupieds >= 5) {
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
            // console.log('\n\n\n\n\n')
            // console.log(target
            //     .map(line =>
            //         line.join('')
            //             .replace(/0/g, '.')
            //             .replace(/1/g, 'L')
            //             .replace(/2/g, '#')
            //     )
            //     .join('\n')
            // );
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
    assertEquals(26, countOccupiedSeats(exampleResult));

    const result = runCode(input);
    const occupiedSeats = countOccupiedSeats(result);
    console.log('Total occupied seats: ', occupiedSeats);
})();
