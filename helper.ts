export const assert = (test: boolean) => {
    if (!test) {
        console.log('Assertion failed');
        throw Error('Assertion failed');
    }
}