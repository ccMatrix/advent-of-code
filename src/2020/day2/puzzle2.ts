import { first, max, without } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

interface PasswordData {
    first: number;
    second: number;
    character: string;
    password: string;
}

(() => {
    const isValid = (pw: PasswordData) => {
        const chars = pw.password.split('');
        if (chars[pw.first - 1] === pw.character && chars[pw.second - 1] !== pw.character) {
            return true;
        }
        if (chars[pw.first - 1] !== pw.character && chars[pw.second - 1] === pw.character) {
            return true;
        }
        return false;
    };

    const input = splitFileContents('day2/input.txt', '\n')
        .filter(line => !!line)
        .map<PasswordData>(line => {
            const [ _, firstPos, secondPos, character, password ] = line.match(/([0-9]+)-([0-9]+) ([a-z]{1}): ([a-z]+)/);
            const pw: PasswordData = {
                first: parseInt(firstPos, 10),
                second: parseInt(secondPos, 10),
                character,
                password
            };
            return pw;
        })

    const validPws = input.filter(pw => isValid(pw));

    console.log(validPws.length);
})();
