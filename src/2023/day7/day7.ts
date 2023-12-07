import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

interface ICardHand {
    hand: string;
    bid: number;
    type?: HandType;
}

enum HandType {
    Five_of_a_kind = 6,
    Four_of_a_kind = 5,
    Full_house = 4,
    Three_of_a_kind = 3,
    Two_pair = 2,
    One_pair = 1,
    High_card = 0,
}

const hands = input.map<ICardHand>(line => {
    const [ hand, bid ] = line.split(/\s+/);
    return {
        hand,
        bid: parseInt(bid, 10),
    };
});

const sorting = (cardValues: string[]) => {
    const sortHands = (a: ICardHand, b: ICardHand) => {
        const handTypeComp = a.type - b.type;
        if (handTypeComp === 0) {
            for (let i = 0; i < a.hand.length; ++i) {
                if (a.hand[i] !== b.hand[i]) {
                    return cardValues.indexOf(a.hand[i]) - cardValues.indexOf(b.hand[i]);
                }
            }
        }
        return handTypeComp;
    };
    return sortHands;
}

const getHandType = (hand: ICardHand, withJokers: boolean): HandType => {
    const cardMap = new Map<string, number>();
    let jokers: number = 0;
    hand.hand.split('').forEach(card => {
        if (withJokers && card === 'J') {
            jokers++;
        }
        else {
            cardMap.set(card, (cardMap.get(card) || 0) + 1);
        }
    });
    const values = Array.from(cardMap.values());
    values.sort().reverse();
    values[0] += jokers;
    switch (values[0]) {
        case 5: return HandType.Five_of_a_kind;
        case 4: return HandType.Four_of_a_kind;
        case 3: return (values[1] === 2) ? HandType.Full_house : HandType.Three_of_a_kind;
        case 2: return (values[1] === 2) ? HandType.Two_pair : HandType.One_pair;
        case 1: return HandType.High_card;
        default: return HandType.Five_of_a_kind;
    }
}

((hands) => {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    hands.forEach(hand => { hand.type = getHandType(hand, false) });

    hands.sort(sorting(cards));
    const totalWinnings = hands.reduce((prev, current, idx) => prev + (current.bid * (idx + 1)), 0);
    console.log(`Part 1: Winnings are ${totalWinnings}`);
})(hands);

((hands) => {
    const cards = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
    hands.forEach(hand => { hand.type = getHandType(hand, true) });

    hands.sort(sorting(cards));
    const totalWinnings = hands.reduce((prev, current, idx) => prev + (current.bid * (idx + 1)), 0);
    console.log(`Part 2: Winnings are ${totalWinnings}`);
})(hands);
