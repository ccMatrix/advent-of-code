import java.io.File

fun loadDatastream(fileName: String): String = File(fileName).readText().trim()

fun findMarkerInStream(datastream: String, length: Int): Int {
    for (index in length ..datastream.count() - 1) {
        if (datastream.subSequence(index - length, index).toList().distinct().count() === length) {
            return index
        }
    }
    return -1
}

val datastream = loadDatastream("./input.txt")
println("Start packet is " + findMarkerInStream(datastream, 4))
println("Start message is " + findMarkerInStream(datastream, 14))