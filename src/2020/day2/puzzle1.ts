import { max, without } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

interface PasswordData {
    min: number;
    max: number;
    character: string;
    password: string;
}

(() => {
    const isValid = (pw: PasswordData) => {
        const chars = pw.password.split('').filter(c => c === pw.character);
        return chars.length >= pw.min && chars.length <= pw.max;
    };

    const input = splitFileContents('day2/input.txt', '\n')
        .filter(line => !!line)
        .map<PasswordData>(line => {
            const [ _, minChars, maxChars, character, password ] = line.match(/([0-9]+)-([0-9]+) ([a-z]{1}): ([a-z]+)/);
            const pw: PasswordData = {
                min: parseInt(minChars, 10),
                max: parseInt(maxChars, 10),
                character,
                password
            };
            return pw;
        })

    const validPws = input.filter(pw => isValid(pw));

    console.log(validPws.length);
})();
