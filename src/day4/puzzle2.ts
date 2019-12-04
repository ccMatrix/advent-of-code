import { assertFalse, assertTrue } from '../helper';

(() => {
    const checkUniqueDouble = (doubleDigit: RegExpMatchArray, trippleDigit: RegExpMatchArray) => {
        if (doubleDigit.length > 1) {
            return false === doubleDigit
                .map((dd) => {
                    const trippleMatch = trippleDigit.find((td) => td.includes(dd));
                    return !trippleMatch;
                })
                .every((b) => b);
        }
        return false;
    };

    const checkPassword = (candidate: number) => {
        const str = candidate.toString();
        const doubleDigit = str.match(/(11|22|33|44|55|66|77|88|99|00)/g);
        const trippleDigit = str.match(/(111|222|333|444|555|666|777|888|999|000)/g);

        if (!doubleDigit || (trippleDigit && !checkUniqueDouble(doubleDigit, trippleDigit))) {
            return false;
        }

        if (str !== str.split('').sort().join('')) {
            return false;
        }

        return true;
    };

    const findPasswords = (start: number, end: number) => {
        let pwCount = 0;
        for (let candidate = start; candidate < end; ++candidate) {
            pwCount += checkPassword(candidate) ? 1 : 0;
        }
        return pwCount;
    };

    assertTrue(checkPassword(112233));
    assertFalse(checkPassword(123444));
    assertTrue(checkPassword(111122));

    const passwords = findPasswords(172930, 683082);
    console.log(passwords);
})();
