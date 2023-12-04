import * as fs from 'fs';
import * as path from 'path';

interface IScratchCard {
    id: number;
    winningNumbers: number[];
    cardNumbers: number[];
    winningCardCount: number;
    cardCounter: number;
}

const scratchcards = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => {
        const delimiterPos = line.indexOf('|');
        const scratchCard: IScratchCard = {
            id: parseInt(line.match(/Card\s+(\d+):/)![1], 10),
            winningNumbers: line.substring(line.indexOf(':') + 1, delimiterPos - 1).trim().split(/\s+/).map(n => parseInt(n, 10)),
            cardNumbers: line.substring(delimiterPos + 1).trim().split(/\s+/).map(n => parseInt(n, 10)),
            winningCardCount: 0,
            cardCounter: 1,
        };
        const winnersFound = scratchCard.cardNumbers.filter(n => scratchCard.winningNumbers.includes(n));
        scratchCard.winningCardCount = winnersFound.length;
        return scratchCard;
    });

(() => {
    const sumWinnerValue = scratchcards.reduce((prev, current) => prev + (current.winningCardCount > 0 ? Math.pow(2, current.winningCardCount - 1) : 0), 0);
    console.log('part1', sumWinnerValue);
})();

(() => {
    scratchcards.forEach(scratchcard => {
        if (scratchcard.winningCardCount > 0) {
            for (let copyId = scratchcard.id + 1; copyId <= scratchcard.id + scratchcard.winningCardCount; copyId++) {
                const targetCard = scratchcards.find(sc => sc.id === copyId)!;
                targetCard.cardCounter += scratchcard.cardCounter;
            }
        }
    });
    const sumTotalCards = scratchcards.reduce((prev, current) => prev + current.cardCounter, 0);
    console.log('part2', sumTotalCards);
})();