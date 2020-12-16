import { assertEquals, splitFileContents } from '../helper';

(() => {
    type Ticket = number[];
    interface Rule {
        name: string;
        range: number[],
    }

    interface PuzzleData {
        rules: Rule[],
        ownTicket: Ticket,
        nearbyTickets: Ticket[],
    }

    const exampleInput = [
        'class: 1-3 or 5-7',
        'row: 6-11 or 33-44',
        'seat: 13-40 or 45-50',
        '',
        'your ticket:',
        '7,1,14',
        '',
        'nearby tickets:',
        '7,3,47',
        '40,4,50',
        '55,2,20',
        '38,6,12',
    ]

    const input = splitFileContents('day16/input.txt', '\n');

    const parseInput = (data: string[]) => {
        enum ParseMode {
            Rules,
            OwnTicket,
            NearbyTickets,
        };
        const ownTicketDelimiter = 'your ticket:';
        const nearbyTicketDelimiter = 'nearby tickets:';
        let mode = ParseMode.Rules;
        const result: PuzzleData = {
            rules: [],
            ownTicket: undefined,
            nearbyTickets: [],
        };
        data.forEach(line => {
            if (line.length === 0) {
                return;
            }
            if (line === ownTicketDelimiter) {
                mode = ParseMode.OwnTicket;
                return;
            }
            if (line === nearbyTicketDelimiter) {
                mode = ParseMode.NearbyTickets;
                return;
            }

            switch (mode) {
                case ParseMode.Rules:
                    const ruleData = line.match(/([a-z\s]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)/);
                    const rule: Rule = {
                        name: ruleData[1],
                        range: [],
                    }
                    for (let i = parseInt(ruleData[2], 10); i <= parseInt(ruleData[3], 10); ++i) {
                        rule.range.push(i);
                    }
                    for (let i = parseInt(ruleData[4], 10); i <= parseInt(ruleData[5], 10); ++i) {
                        rule.range.push(i);
                    }
                    result.rules.push(rule);
                    break;
                case ParseMode.OwnTicket:
                    result.ownTicket = line.split(',').map(d => parseInt(d, 10));
                    break;
                case ParseMode.NearbyTickets:
                    result.nearbyTickets.push(
                        line.split(',').map(d => parseInt(d, 10))
                    );
                    break;
            }

        });

        return result;
    }

    const checkNearbyTickets = (data: PuzzleData) => {
        let err = 0;
        data.nearbyTickets.forEach(ticket => {
            ticket.forEach(num => {
                const valid = data.rules.some(rule => rule.range.includes(num));
                if (!valid) {
                    err += num;
                }
            });
        });
        return err;
    }

    const exampleData = parseInput(exampleInput);
    assertEquals(71, checkNearbyTickets(exampleData));

    const errorRate = checkNearbyTickets(parseInput(input));
    console.log('Error Rate is:', errorRate);


})();
