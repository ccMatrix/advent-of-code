import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface Passport {
        byr: number;
        iyr: number;
        eyr: number;
        hgt: number;
        hcl: string;
        ecl: string;
        pid: number;
        cid: number;
    };
    const numeric = ['byr', 'iyr', 'eyr', 'hgt', 'pid', 'cid'];

    const input = splitFileContents('day4/input.txt', '\n\n')
        .map<Partial<Passport>>(line => {
            const passport: Partial<Passport> = {};
            const elements = line.split(/\s/);
            elements.forEach(e => {
                const d = e.split(':');
                if (numeric.includes(d[0])) {
                    passport[d[0]] = parseInt(d[1], 10);
                }
                else {
                    passport[d[0]] = d[1];
                }
            });
            return passport;
        });

    const isValid = (passport: Partial<Passport>) => {
        const values = Object.values(passport);
        if (values.length === 8) {
            return true;
        }
        if (values.length === 7 && passport.cid === undefined) {
            return true;
        }
        return false;
    }

    const validPassports = input.filter(p => isValid(p));
    console.log('Valid passports: ', validPassports.length);

})();
