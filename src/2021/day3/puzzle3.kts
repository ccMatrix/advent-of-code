import java.io.File

data class GammaEpsilon(val gamma: Int, val epsilon: Int) {
    public fun result() = gamma * epsilon
}
data class BitInfo(var zeroCount: Int, var oneCount: Int)

fun readInputFromFile(fileName: String): List<List<Int>>
        = File(fileName)
    .useLines { it.toList() }
    .map { it.map { it.digitToInt() } }

fun generateBitmask(input: List<List<Int>>): Array<BitInfo> {
    val bitInfo = Array<BitInfo>(input[0].count(), { BitInfo(0, 0) })
    input.forEach {
        it.forEachIndexed { index, i ->
            when (i) {
                1 -> bitInfo[index].oneCount++
                0 -> bitInfo[index].zeroCount++
            }
        }
    }
    return bitInfo
}

fun parseGammaEpsilon(input: List<List<Int>>): GammaEpsilon {
    var bitInfo = generateBitmask(input)
    return GammaEpsilon(
        bitInfo.map { if (it.oneCount > it.zeroCount) 1 else 0 }.joinToString("").toInt(2),
        bitInfo.map { if (it.oneCount > it.zeroCount) 0 else 1 }.joinToString("").toInt(2)
    )
}

fun reduceForBit(list: List<List<Int>>, bit: Int, comparator: (zeros: Int, ones: Int) -> Int): Int {
    val bitInfo = generateBitmask(list)
    val filterFor = comparator(bitInfo[bit].zeroCount, bitInfo[bit].oneCount)
    val filteredList = list.filter {
        it[bit].equals(filterFor)
    }

    if (filteredList.count() == 1) {
        return filteredList.last().joinToString("").toInt(2)
    }
    return reduceForBit(filteredList, bit + 1, comparator)
}

fun findOxygenGeneratorRating(input: List<List<Int>>): Int {
    return reduceForBit(input, 0, { zeros, ones -> if (zeros > ones) 0 else 1 })
}

fun findCo2ScrubberRating(input: List<List<Int>>): Int {
    return reduceForBit(input, 0, { zeros, ones -> if (ones < zeros) 1 else 0 })
}

val sampleInput = arrayListOf(
    arrayListOf(0, 0, 1, 0, 0),
    arrayListOf(1, 1, 1, 1, 0),
    arrayListOf(1, 0, 1, 1, 0),
    arrayListOf(1, 0, 1, 1, 1),
    arrayListOf(1, 0, 1, 0, 1),
    arrayListOf(0, 1, 1, 1, 1),
    arrayListOf(0, 0, 1, 1, 1),
    arrayListOf(1, 1, 1, 0, 0),
    arrayListOf(1, 0, 0, 0, 0),
    arrayListOf(1, 1, 0, 0, 1),
    arrayListOf(0, 0, 0, 1, 0),
    arrayListOf(0, 1, 0, 1, 0)
)

fun puzzle1(input: List<List<Int>>) {
    val gammaEpsilon = parseGammaEpsilon(input)
    println("Result is ${gammaEpsilon.result()}")
}

fun puzzle2(input: List<List<Int>>) {
    val oxygenValue = findOxygenGeneratorRating(input)
    val co2Value = findCo2ScrubberRating(input)
    println("Oxygen Value is $oxygenValue, Co2 Value is $co2Value, Result is ${oxygenValue * co2Value}")
}

puzzle1(sampleInput)
puzzle1(readInputFromFile("input.txt"))
puzzle2(sampleInput)
puzzle2(readInputFromFile("input.txt"))
