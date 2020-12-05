import { first, maxBy, sortBy } from 'lodash';
import { splitFileContents } from '../helper';

(() => {
    interface BoardingPass {
        row: number;
        column: number;
        seatId: number;
    }
    const input = splitFileContents('day5/input.txt', '\n')
        .map<BoardingPass>((line) => {
            const rowBinary = line.substr(0, 7).replace(/B/g, '1').replace(/F/g, '0');
            const columnBinary = line.substr(7, 3).replace(/R/g, '1').replace(/L/g, '0');
            const row = parseInt(rowBinary, 2);
            const column = parseInt(columnBinary, 2);

            const boardingPass: BoardingPass = {
                column,
                row,
                seatId: (row * 8) + column,
            };
            return boardingPass;
        });

    const seats = sortBy(input, 'seatId');
    let lastSeat = first(seats);
    seats.forEach((seat) => {
        if (seat.seatId - lastSeat.seatId > 1) {
            console.log('Your seat is:', lastSeat.seatId + 1);
        }
        lastSeat = seat;
    });

})();
