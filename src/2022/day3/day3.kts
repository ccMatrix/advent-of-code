import java.io.File

data class Backpack(val compartment1: CharSequence, val compartment2: CharSequence, val items: CharSequence)

fun loadBackpacks(fileName: String): List<Backpack>
        = File(fileName)
    .useLines { it.toList() }
    .map { s: String ->
        val backpack = Backpack(
            s.subSequence(0, s.length / 2),
            s.subSequence(s.length / 2, s.length),
            s
        )
        backpack
    }

val backpacks = loadBackpacks("./input.txt")
val chars = (('a'..'z') + ('A' .. 'Z')).toList()
val prioritySum = backpacks
    .map { backpack ->
        val common = backpack.compartment1.filter { it in backpack.compartment2 }.first()
        chars.indexOf(common) + 1
    }
    .sum()

println("Sum of priorities is " + prioritySum)

var totalBadge = 0;
for (groupIndex in 0..((backpacks.count() - 1) / 3)) {
    val group = backpacks.subList(groupIndex * 3, groupIndex * 3 + 3)
    val common = group[0].items
            .filter { it in group[1].items }
            .filter { it in group[2].items }
        .first()
    val badge = chars.indexOf(common) + 1
    totalBadge += badge
}
println("Total badge sum is " + totalBadge)