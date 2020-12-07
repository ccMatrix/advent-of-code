import { uniq } from 'lodash';
import { splitFileContents } from '../helper';

(() => {
    interface Bag {
        type: string;
        quantity: number;
        subbags?: Bag[];
    }

    interface BagDictionary {
        [propName: string]: Bag;
    }

    const dictionary: BagDictionary = {};

    splitFileContents('day7/input.txt', '\n')
        .forEach(line => {
            const data = line.match(/^([a-z\s]+) bags contain (.+)/);
            const name = data[1].trim();
            const subBags = data[2].match(/([0-9]+) ([a-z\s]+) bag/gi) || [];
            dictionary[name] = {
                type: name,
                quantity: 1,
                subbags: subBags.map(subBag => {
                    const subData = subBag.match(/([0-9]+) ([a-z\s]+) bag/);
                    return {
                        type: subData[2].trim(),
                        quantity: parseInt(subData[1], 10),
                    };
                })
            };
        });

    console.log(dictionary);
    const usableBags: Bag[] = [];

    const targetBag = 'shiny gold';

    const subBagFinder = (bagType: string) => {
        Object.values(dictionary).forEach(bag => {
            const subBag = bag.subbags.find(b => b.type === bagType);
            if (subBag) {
                usableBags.push(bag);
                subBagFinder(bag.type);
            }
        })
    }

    subBagFinder(targetBag);

    const reducedBags = uniq(usableBags);

    console.log('Total bag options:', reducedBags.length);
})();
