import java.io.File

data class Line(val input: List<String>, val output: List<String>)

fun readFile(fileName: String): List<Line>
        = File(fileName)
    .useLines { it.toList() }
    .map {
        val segments = it.split(" | ")
        Line(segments[0].split(' '), segments[1].split(' '))
    }

fun countOneFourSevenEight(input: List<Line>): Int
    = input.fold(0, { acc, line ->
        val sum = line.output.sumOf {
            val res:Int = when (it.length) {
                2,3,4,7 -> 1
                else -> 0
            }
            res
        }
        acc + sum
     })

fun getDigitByMapping(scrambled: String, connections: Map<String, List<String>>): Int {
    val realDigits = scrambled
        .map { it.toString() }
        .map { scrambledChar ->
            connections.entries.find { it.value.first() == scrambledChar }?.key
        }
        .sortedBy { it }
        .joinToString("")
    val code = when (realDigits) {
        "abcefg" -> 0
        "cf" -> 1
        "acdeg" -> 2
        "acdfg" -> 3
        "bcdf" -> 4
        "abdfg" -> 5
        "abdefg" -> 6
        "acf" -> 7
        "abcdefg" -> 8
        "abcdfg" -> 9
        else -> throw Exception("unknown sequence detected")
    }
    return code
}

fun findConnectionCode(line: Line): Int {
    val possibleConnections: MutableMap<String, List<String>> =
        emptyMap<String, List<String>>().toMutableMap()
    fun putOrReduce(pos: String, ideas: List<String>) {
        val currentOptions = possibleConnections.getOrDefault(pos, listOf("a","b","c","d","e","f","g"))
        val newOptions = currentOptions.filter { it -> ideas.contains(it) }
        possibleConnections.put(pos, newOptions)
    }
    line.input.forEach {
        val list = it.map { it.toString() }
        when (it.length) {
            2 -> {
                putOrReduce("c", list)
                putOrReduce("f", list)
            }
            3 -> {
                putOrReduce("a", list)
                putOrReduce("c", list)
                putOrReduce("f", list)
            }
            4-> {
                putOrReduce("b", list)
                putOrReduce("d", list)
                putOrReduce("c", list)
                putOrReduce("f", list)
            }
            7-> {
                putOrReduce("e", list)
            }
            6 -> {
                putOrReduce("a", list)
                putOrReduce("b", list)
                putOrReduce("f", list)
                putOrReduce("g", list)
            }
        }
    }

    while (possibleConnections.values.any { it.count() > 1 }) {
        possibleConnections.forEach {
            if (it.value.count() == 1) {
                val search = it.value.first()
                possibleConnections.forEach { entry ->
                    if (entry.value.count() > 1) {
                        possibleConnections.put(entry.key, entry.value.filter { !it.equals(search) })
                    }
                }
            }
        }
    }

    return line.output.map { getDigitByMapping(it, possibleConnections) }.joinToString("").toInt()
}

fun decodeConnections(input: List<Line>)
    = input.fold(0, { acc, line ->
        acc + findConnectionCode(line)
    })

fun p1sample() {
    val sampleInput = readFile("sampleInput.txt")
    val count = countOneFourSevenEight(sampleInput)
    println("There are $count 1,2,4,7 values")
}

fun puzzle1() {
    val input = readFile("input.txt")
    val count = countOneFourSevenEight(input)
    println("There are $count 1,2,4,7 values")
}

fun p2sample() {
    val sampleInput = readFile("sampleInput.txt")
    val code = decodeConnections(sampleInput)
    println("Sum of all codes is $code")
}

fun puzzle2() {
    val input = readFile("input.txt")
    val code = decodeConnections(input)
    println("Sum of all codes is $code")
}

p1sample()
puzzle1()
p2sample()
puzzle2()