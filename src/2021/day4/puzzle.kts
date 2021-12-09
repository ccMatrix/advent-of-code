import java.io.File
import kotlin.math.floor
import kotlin.math.min

data class BingoField(val value: Int, var picked: Boolean = false)
data class BingoBoard(val fields: List<List<BingoField>>) {
    private var hasBingo = false
    private var lastPickedNumber = 0

    private fun boardSum(): Int = fields.fold(0, { acc, bingoFields ->
        bingoFields.fold(acc, { acc2, bingoField ->
            acc2 + if (!bingoField.picked) bingoField.value else 0
        })
    })

    fun markNumber(number: Int) {
        if (hasBingo) return

        lastPickedNumber = number
        fields.forEach {
            it.forEach {
                if (it.value.equals(number)) {
                    it.picked = true;
                }
            }
        }
    }

    fun isBingo(): Boolean {
        if (hasBingo) {
            return hasBingo
        }

        hasBingo = hasBingo || fields.any { it.all { it.picked } }
        for (col in 0..4) {
            hasBingo = hasBingo || fields.map { it[col] }.all { it.picked }
        }
        return hasBingo
    }

    fun result(): Int
        = boardSum() * lastPickedNumber
}

public class BingoGame(val instructions: List<Int>, val boards: List<BingoBoard>) {
    private var lastPickedNumber: Int = 0
    val winnerBoards: MutableList<BingoBoard> = emptyList<BingoBoard>().toMutableList()
    fun play() {
        instructions.forEach { pick ->
            this.lastPickedNumber = pick
            boards
                .filter { !it.isBingo() }
                .forEach { board ->
                    board.markNumber(pick)
                    if (board.isBingo()) {
                        winnerBoards.add(board)
                    }
                }
        }
    }
}

fun readAndParseInputFromFile(fileName: String): BingoGame {
    val input: List<String> = File(fileName)
        .useLines { it.toList() }
        .map { it.toString() }
    val instructions = input[0].split(",").map { it.toInt() }
    val boardCount = floor(input.count().toDouble() / 6).toInt();
    var boards: List<BingoBoard> = List<BingoBoard>(boardCount, {
        BingoBoard(
            input.subList(it * 5 + 2 + (it * 1), it * 5 + 7 + (it * 1))
            .map { it.trim().split("\\s+".toRegex()).map { BingoField(it.toInt(), false) } }
        )
    })
    return BingoGame(instructions, boards)
}

fun p1sample() {
    val bingoGame = readAndParseInputFromFile("sampleInput.txt")
    bingoGame.play()
    println(bingoGame.winnerBoards.first().result())
}

fun puzzle1() {
    val bingoGame = readAndParseInputFromFile("input.txt")
    bingoGame.play()
    println(bingoGame.winnerBoards.first().result())
}

fun p2sample() {
    val bingoGame = readAndParseInputFromFile("sampleInput.txt")
    bingoGame.play()
    println(bingoGame.winnerBoards.last().result())
}

fun puzzle2() {
    val bingoGame = readAndParseInputFromFile("input.txt")
    bingoGame.play()
    println(bingoGame.winnerBoards.last().result())
}

p1sample()
puzzle1()
p2sample()
puzzle2()