import { assertEquals, readFileContents } from '../helper';

(() => {
    const input = readFileContents('day8/input.txt');

    const renderImage = (image: string, width: number, height: number) => {
        const layers = image.match(new RegExp(`[0-9]{${width * height}}`, 'g'));
        layers.reverse();
        const rendered: number[] = Array(width * height);
        layers.forEach((layer) => {
            const pixels = layer.split('').map((d) => parseInt(d, 10));
            pixels.forEach((pixel, index) => {
                if (pixel !== 2) {
                    rendered[index] = pixel;
                }
            });
        });

        const lines = rendered.join('').match(new RegExp(`[0-9]{${width}}`, 'g'));
        return lines;
    };

    assertEquals(['01', '10'], renderImage('0222112222120000', 2, 2));

    const renderLines = renderImage(input, 25, 6);
    renderLines.forEach((line) => {
        console.log(line.replace(/0/g, ' ').replace(/1/g, '█'));
    });

})();
