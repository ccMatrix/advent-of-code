import { splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {
    enum TileId {
        Empty = 0,
        Wall = 1,
        Block = 2,
        HorizontalPaddle = 3,
        Ball = 4,
    }

    interface ITile {
        x: number;
        y: number;
        type: TileId;
    }

    const input = splitFileContents('day13/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runCode = (memory: number[]) => {
        const intCoder = new IntCoder(memory);
        intCoder.run();

        const tiles: ITile[] = [];
        let output = intCoder.runOutput;
        while (output.length > 0) {
            const [x, y, type, ...other] = output;
            output = other;
            tiles.push({ x, y, type });
        }

        return tiles.reduceRight<number>((counter, tile) => counter + (tile.type === TileId.Block ? 1 : 0), 0);
    };

    console.log(runCode(data));

})();
