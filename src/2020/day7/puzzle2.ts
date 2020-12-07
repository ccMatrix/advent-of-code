import { sumBy, uniq } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    const inputData = splitFileContents('day7/input.txt', '\n');

    const calculate = (input: string[]) => {

        interface Bag {
            type: string;
            quantity: number;
            subbags?: Bag[];
        }

        interface BagDictionary {
            [propName: string]: Bag;
        }

        const dictionary: BagDictionary = {};

        input.forEach(line => {
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
        let totalBags = 0;
        const targetBag = 'shiny gold';

        const subBagCounter = (bagType: string, multiplier: number) => {
            const bag = dictionary[bagType];
            totalBags += (sumBy(bag.subbags, 'quantity') * multiplier);
            bag.subbags.forEach((subBag) => {
                subBagCounter(subBag.type, subBag.quantity * multiplier);
            });
        };

        subBagCounter(targetBag, 1);

        return totalBags;
    }

    const exampleData1 = [
        'light red bags contain 1 bright white bag, 2 muted yellow bags.',
        'dark orange bags contain 3 bright white bags, 4 muted yellow bags.',
        'bright white bags contain 1 shiny gold bag.',
        'muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.',
        'shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.',
        'dark olive bags contain 3 faded blue bags, 4 dotted black bags.',
        'vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.',
        'faded blue bags contain no other bags.',
        'dotted black bags contain no other bags.',
    ]
    assertEquals(32, calculate(exampleData1));

    const exampleData2 = [
        'shiny gold bags contain 2 dark red bags.',
        'dark red bags contain 2 dark orange bags.',
        'dark orange bags contain 2 dark yellow bags.',
        'dark yellow bags contain 2 dark green bags.',
        'dark green bags contain 2 dark blue bags.',
        'dark blue bags contain 2 dark violet bags.',
        'dark violet bags contain no other bags.',
    ]

    assertEquals(126, calculate(exampleData2));

    const bagsCount = calculate(inputData);
    console.log('Total bags needed:', bagsCount);
})();
