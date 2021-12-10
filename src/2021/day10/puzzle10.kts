import java.io.File
import kotlin.math.floor

fun readFile(fileName: String): List<String>
        = File(fileName)
    .useLines { it.toList() }

class MalformedException(message: String, val illegalChar: Char) : Exception(message)

val charMap: Map<Char, Char> = mapOf('(' to ')', '{' to '}', '[' to ']', '<' to '>')

fun checkLine(line: String): List<Char> {
    val bracketList: MutableList<Char> = emptyList<Char>().toMutableList()

    line.forEach { c ->
        if (charMap.contains(c)) {
            bracketList.add(c)
        }
        else {
            val closing = charMap.getValue(bracketList.last())
            if (c == closing) {
                bracketList.removeLast()
            }
            else {
                throw MalformedException("Malformed line", c)
            }
        }
    }
    return bracketList
}

fun scoreWrongLines(lines: List<String>): Int
    = lines.fold(0, { acc, line ->
        try {
            checkLine(line)
            acc
        }
        catch (e: MalformedException) {
            when (e.illegalChar) {
                ')' -> acc + 3
                ']' -> acc + 57
                '}' -> acc + 1197
                '>' -> acc + 25137
                else -> acc
            }
        }
    })

fun completeAndScoreLines(lines: List<String>): List<Long> =
    lines.map {
            try { checkLine(it) }
            catch (e: MalformedException) { null }
        }
        .filterNotNull()
        .map { reminder ->
            reminder
                .reversed()
                .map { charMap.getValue(it) }
                .fold(0L, { acc, c ->
                    when (c) {
                        ']' -> acc * 5 + 2
                        ')' -> acc * 5 + 1
                        '}' -> acc * 5 + 3
                        '>' -> acc * 5 + 4
                        else -> acc
                    }
                })
        }
        .sortedBy { it }

fun puzzle1(input: List<String>) {
    val score = scoreWrongLines(input)
    println("score is: $score")
}

fun puzzle2(input: List<String>) {
    val scores = completeAndScoreLines(input)
    val middleScore = scores[floor(scores.count().toDouble() / 2).toInt()]
    println("Middle score is $middleScore")
}

puzzle1(readFile("sampleInput.txt"))
puzzle1(readFile("input.txt"))
puzzle2(readFile("sampleInput.txt"))
puzzle2(readFile("input.txt"))