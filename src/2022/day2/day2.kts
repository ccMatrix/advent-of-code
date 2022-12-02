import java.io.File

enum class Hand(val points: Int) {
    Rock(1),
    Paper(2),
    Scissors(3)
}
enum class Score(val score: Int) {
    Lost(0),
    Draw(3),
    Win(6)
}
val decoderMap = mapOf('A' to Hand.Rock, 'B' to Hand.Paper, 'C' to Hand.Scissors, 'X' to Hand.Rock, 'Y' to Hand.Paper, 'Z' to Hand.Scissors)
data class Strategy(public val opponent: Hand, public val suggestion: Hand)

fun scorePuzzle(strategy: Strategy): Int {
    val result = when (strategy.opponent) {
        Hand.Rock ->
            when (strategy.suggestion) {
                Hand.Rock -> Score.Draw;
                Hand.Paper -> Score.Win;
                Hand.Scissors -> Score.Lost;
            }
        Hand.Paper ->
            when (strategy.suggestion) {
                Hand.Rock -> Score.Lost;
                Hand.Paper -> Score.Draw;
                Hand.Scissors -> Score.Win;
            }
        Hand.Scissors ->
            when (strategy.suggestion) {
                Hand.Rock -> Score.Win;
                Hand.Paper -> Score.Lost;
                Hand.Scissors -> Score.Draw;
            }
    }
    return result.score + strategy.suggestion.points
}

fun loadStrategies(fileName: String): List<Strategy>
        = File(fileName)
    .useLines { it.toList() }
    .map { s ->
        val data = s.toCharArray()
        Strategy(decoderMap.getValue(data[0]), decoderMap.getValue(data[2]))
    }

val strategies = loadStrategies("./input.txt");

val totalPoints2 = strategies.map { scorePuzzle(it) }.sum()
println("Puzzle 1: " + totalPoints2)
