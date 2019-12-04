export const checkPassword = (candidate: number) => {
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

export const findPasswords = (start: number, end: number) => {
    let pwCount = 0;
    for (let candidate = start; candidate < end; ++candidate) {
        pwCount += checkPassword(candidate) ? 1 : 0;
    }
    return pwCount;
};
