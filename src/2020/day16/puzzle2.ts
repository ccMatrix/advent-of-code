import { difference } from 'lodash';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    type Ticket = number[];
    interface Rule {
        name: string;
        range: number[],
        possibleIndexes: number[];
        processed: boolean;
    }

    interface PuzzleData {
        rules: Rule[],
        ownTicket: Ticket,
        nearbyTickets: Ticket[],
    }

    const exampleInput = [
        'class: 0-1 or 4-19',
        'row: 0-5 or 8-19',
        'seat: 0-13 or 16-19',
        '',
        'your ticket:',
        '11,12,13',
        '',
        'nearby tickets:',
        '3,9,18',
        '15,1,5',
        '5,14,9',
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

        const parseTicket = (line: string) => line.split(',').map(d => parseInt(d, 10));
        const createRange = (startStr: string, endStr: string) => {
            const range: number[] = [];
            for (let i = parseInt(startStr, 10); i <= parseInt(endStr, 10); ++i) {
                range.push(i);
            }
            return range;
        }

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
                        possibleIndexes: [],
                        processed: false,
                    }
                    rule.range.push(...createRange(ruleData[2], ruleData[3]));
                    rule.range.push(...createRange(ruleData[4], ruleData[5]));
                    result.rules.push(rule);
                    break;
                case ParseMode.OwnTicket:
                    result.ownTicket = parseTicket(line);
                    break;
                case ParseMode.NearbyTickets:
                    result.nearbyTickets.push(parseTicket(line));
                    break;
            }
        });

        return result;
    }

    const findDepartureValue = (data: PuzzleData) => {
        const validTickets: Ticket[] =
            data.nearbyTickets.filter(ticket =>
                ticket.every(num => data.rules.some(rule => rule.range.includes(num)))
            );

        for (let i = 0; i < data.rules.length; ++i) {
            data.rules.forEach(rule => {
                const possibleValues: number[] =
                    validTickets.map(ticket => ticket[i]);

                const diff = difference(possibleValues, rule.range);
                if (diff.length === 0) {
                    rule.possibleIndexes.push(i);
                }
            })
        }

        // Go through all rules. remove those that are certain (1 array length) from other arrays and reduce until each index is used only once!
        while (!data.rules.every(rule => rule.possibleIndexes.length === 1)) {
            const seek = data.rules.find(r => r.possibleIndexes.length === 1 && !r.processed);
            data.rules.forEach(rule => {
                if (rule.name === seek.name) {
                    return;
                }
                rule.possibleIndexes = difference(rule.possibleIndexes, seek.possibleIndexes);
            });
            seek.processed = true;
        }

        const ticketValue =
            data.rules
                .filter(rule => rule.name.includes('departure'))
                .reduceRight((value, rule) => value *= (data.ownTicket[rule.possibleIndexes[0]]), 1);

        return ticketValue;
    }

    const exampleData = parseInput(exampleInput);
    assertEquals(1, findDepartureValue(exampleData));

    const puzzleData = parseInput(input);
    const departuerInfo = findDepartureValue(puzzleData);
    console.log('My Departure info is:', departuerInfo);


})();
