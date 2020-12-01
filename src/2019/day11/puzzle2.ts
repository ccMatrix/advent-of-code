import { maxBy, minBy } from 'lodash';
import { splitFileContents } from '../helper';
import IntCoder, { Status } from '../Intcode';

(() => {

    enum Color {
        Black = 0,
        White = 1,
    }

    enum Rotate {
        Left = 0,
        Right = 1,
    }

    enum Direction {
        Up = 0,
        Right = 1,
        Down = 2,
        Left = 3,
    }

    interface IPixel {
        x: number;
        y: number;
        colors: Color[];
    }

    const input = splitFileContents('day11/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const runCode = (memory: number[]) => {
        const intCoder = new IntCoder(memory);
        let currentX = 0;
        let currentY = 0;
        let direction: number = Direction.Up;
        const pixels: IPixel[] = [];
        pixels.push({ x: 0, y: 0, colors: [Color.White] });
        while (intCoder.status !== Status.Break) {
            let currentPixel = pixels.find((pixel) => pixel.x === currentX && pixel.y === currentY);
            if (!currentPixel) {
                currentPixel = { x: currentX, y: currentY, colors: [Color.Black]};
                pixels.push(currentPixel);
            }
            intCoder.run([currentPixel.colors[0]]);
            currentPixel.colors.unshift(intCoder.runOutput[0]);
            switch (intCoder.runOutput[1]) {
                case Rotate.Left:
                    direction = (direction === Direction.Up) ? Direction.Left : --direction;
                    break;
                case Rotate.Right:
                    direction = (direction === Direction.Left) ? Direction.Up : ++direction;
                    break;
            }
            switch (direction) {
                case Direction.Up:
                    currentY++;
                    break;
                case Direction.Right:
                    currentX++;
                    break;
                case Direction.Down:
                    currentY--;
                    break;
                case Direction.Left:
                    currentX--;
                    break;
            }
        }

        const renderPixels = () => {
            const minX = minBy(pixels, (pixel) => pixel.x).x;
            const maxX = maxBy(pixels, (pixel) => pixel.x).x;
            const minY = minBy(pixels, (pixel) => pixel.y).y;
            const maxY = maxBy(pixels, (pixel) => pixel.y).y;

            for (let y = maxY; y >= minY; --y) {
                let line = '';
                for (let x = minX; x <= maxX; ++x) {
                    const pixel = pixels.find((p) => p.x === x && p.y === y);
                    const color = pixel && pixel.colors.shift() || Color.Black;
                    line += (color === Color.Black) ? ' ' : '█';
                }
                console.log(line);
            }
        };

        renderPixels();
    };

    runCode(data);

})();
