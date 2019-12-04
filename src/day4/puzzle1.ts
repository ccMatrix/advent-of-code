import { assertFalse, assertTrue } from '../helper';

(() => {
    const checkPassword = (candidate: number) => {
        const str = candidate.toString();
        const doubleDigit = str.match(/(11|22|33|44|55|66|77|88|99|00)/);
        if (!doubleDigit) {
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

    assertTrue(checkPassword(111111));
    assertFalse(checkPassword(223450));
    assertFalse(checkPassword(123789));

    const passwords = findPasswords(172930, 683082);
    console.log(passwords);
})();
