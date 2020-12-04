import { head } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface Passport {
        byr: number;
        iyr: number;
        eyr: number;
        hgt: string;
        hcl: string;
        ecl: string;
        pid: string;
        cid: number;
    };
    const numeric = ['byr', 'iyr', 'eyr', 'cid'];

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
        /*
            byr (Birth Year) - four digits; at least 1920 and at most 2002.
            iyr (Issue Year) - four digits; at least 2010 and at most 2020.
            eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
            hgt (Height) - a number followed by either cm or in:
            If cm, the number must be at least 150 and at most 193.
            If in, the number must be at least 59 and at most 76.
            hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
            ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
            pid (Passport ID) - a nine-digit number, including leading zeroes.
            cid (Country ID) - ignored, missing or not.
        */
        if (!passport.byr || passport.byr < 1920 || passport.byr > 2002) {
            return false;
        }
        if (!passport.iyr || passport.iyr < 2010 || passport.iyr > 2020) {
            return false;
        }
        if (!passport.eyr || passport.eyr < 2020 || passport.eyr > 2030) {
            return false;
        }
        if (!passport.hgt) {
            return false;
        }

        const heightMatch = passport.hgt.match(/^([0-9]+)(cm|in)$/);
        if (!heightMatch) {
            return false;
        }
        const [ _, heightData, heightUnit ] = heightMatch;
        const height = parseInt(heightData, 10);
        if (heightUnit === 'cm' && (height < 150 || height > 193)) {
            return false;
        }
        if (heightUnit === 'in' && (height < 59 || height > 76)) {
            return false;
        }

        if (!passport.hcl || !passport.hcl.match(/^#([0-9a-f]{6})$/)) {
            return false;
        }

        if (!passport.ecl || !['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl)) {
            return false;
        }
        if (!passport.pid || !passport.pid.match(/^([0-9]{9})$/)) {
            return false;
        }

        return true;
    }

    const validPassports = input.filter(p => isValid(p));
    console.log('Valid passports: ', validPassports.length);

})();
