import { intersection, sumBy, uniq } from 'lodash';
import { splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day6/input.txt', '\n\n')
        .map<string[]>((line) => {
            const answers = line.split('\n').map((answer) => answer.split(''));
            return intersection(...answers);
        });

    const yesTotal = sumBy(input, (answers) => answers.length);

    console.log('Total unique yes:', yesTotal);
})();
