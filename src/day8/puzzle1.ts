import { minBy } from 'lodash';
import { assertEquals, readFileContents } from '../helper';

interface INumbers {
    zero: number;
    one: number;
    two: number;
    layer: string;
}

(() => {

    const input = readFileContents('day8/input.txt') as string;

    const layers = input.match(/[0-9]{150}/g);

    const counter: INumbers[] = layers.map((layer) => ({
        layer,
        one: layer.match(/([1]{1})/g).length,
        two: layer.match(/([2]{1})/g).length,
        zero: layer.match(/([0]{1})/g).length,
    }));

    const min = minBy(counter, (entry) => entry.zero);

    console.log(min.one * min.two);

})();
