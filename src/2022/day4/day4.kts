import java.io.File

class Instruction(val from: Int, val to: Int) {
    fun toArray() = (from..to)
    companion object {
        fun parse(range: String): Instruction {
            val data = range.split('-')
            return Instruction(data[0].toInt(), data[1].toInt())
        }
    }
}

fun loadInstructions(fileName: String): List<Pair<Instruction, Instruction>>
        = File(fileName)
    .useLines { it.toList() }
    .map { s: String ->
        val data = s.split(',')
        Pair(Instruction.parse(data[0]), Instruction.parse(data[1]))
    }

val fullMatchInstructions = loadInstructions("./input.txt")
    .filter { pair ->
        val firstArray = pair.first.toArray()
        val secondArray = pair.second.toArray()
        val find = firstArray.intersect(secondArray)
        val match = firstArray.count() === find.count() || secondArray.count() === find.count()

        match
    }

println("Instructions found: " + fullMatchInstructions.count())

val partMatchInstructions = loadInstructions("./input.txt")
    .filter { pair ->
        pair.first
            .toArray()
            .intersect(pair.second.toArray())
            .isNotEmpty()
    }
println("Partial overlaps found: " + partMatchInstructions.count())