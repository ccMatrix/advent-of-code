import { sumBy, uniq } from 'lodash';
import { splitFileContents } from '../helper';

(() => {
    const input = splitFileContents('day6/input.txt', '\n\n')
        .map<string[]>((line) => {
            const answers = line.split('\n');
            const answerList: string[] = [];
            answers.forEach((answer) => {
                answerList.push(...answer.split(''));
            });
            return uniq(answerList);
        });

    const yesTotal = sumBy(input, (answers) => answers.length);

    console.log('Total yes results:', yesTotal);
})();
