import java.io.File

enum class IoType {
    File,
    Directory
}
public class IoNode(val name: String, val type: IoType) {
    private var size: Int = 0
    private val childNodes: MutableList<IoNode> = mutableListOf()
    private var parent: IoNode? = null

    public fun setSize(size: Int) {
        this.size = size
    }

    public fun getSize(): Int {
        when (this.type) {
            IoType.Directory -> {
                return this.childNodes.sumOf { it.getSize() }
            }
            IoType.File -> {
                return this.size
            }
        }
    }

    public fun addChild(node: IoNode) {
        this.childNodes.add(node)
    }

    public fun children(): List<IoNode> {
        return this.childNodes
    }

    public fun findChild(name: String): IoNode {
        val child = this.childNodes.find { it.name.equals(name) }
        if (child === null) {
            println(this.childNodes.map { it.name })
            throw Exception("Invalid child name ${name}. Folder not found!")
        }
        return child
    }

    public fun setParent(node: IoNode) {
        this.parent = node
    }

    public fun getParent(): IoNode? {
        return this.parent
    }
}

fun loadConsoleOutput(fileName: String): List<String>
        = File(fileName)
    .useLines { it.toList() }

fun buildFilesystemTree(commands: List<String>): IoNode {
    var rootNode = IoNode("/", IoType.Directory)
    var pointer = rootNode
    commands.forEach { command ->
        if (command.startsWith("$")) {
            val line = "\\$ (cd|ls)\\s*([\\w./]*)".toRegex().find(command)!!
            if (line.groupValues[1] == "cd") {
                val target = line.groupValues[2]
                if (target == "..") {
                    pointer = pointer.getParent() ?: rootNode
                }
                else if (target == "/") {
                    pointer = rootNode
                }
                else {
                    pointer = pointer.findChild(target)
                }
            }
        }
        else {
            val line = "^(dir|\\d+) ([\\w.]+)".toRegex().find(command)!!
            if (line.groupValues[1] == "dir") {
                val node = IoNode(line.groupValues[2], IoType.Directory)
                node.setParent(pointer)
                pointer.addChild(node)
            }
            else {
                val node = IoNode(line.groupValues[2], IoType.File)
                node.setSize(line.groupValues[1].toInt())
                node.setParent(pointer)
                pointer.addChild(node)
            }
        }
    }
    return rootNode
}

fun findFoldersMaxSize(node: IoNode, maxSize: Int, nodeList: MutableList<IoNode>) {
    if (node.type == IoType.Directory) {
        if (node.getSize() <= maxSize) {
            nodeList.add(node)
        }
        node.children().forEach { findFoldersMaxSize(it, maxSize, nodeList) }
    }
}

val rootNode = buildFilesystemTree(
    loadConsoleOutput("./input.txt")
)

fun calculateSumOfSmallDirs(node: IoNode): Int {
    var smallFolders = mutableListOf<IoNode>()
    findFoldersMaxSize(rootNode, 100000, smallFolders)
    return smallFolders.sumOf { it.getSize() }
}
println("Size sum is ${calculateSumOfSmallDirs(rootNode)}")

fun findFolderToDelete(node: IoNode): IoNode {
    val systemSize = 70000000
    val rootDirSize = node.getSize()
    val spaceNeeded = systemSize - rootDirSize
    val deletionCandidates = mutableListOf<IoNode>()

    findFoldersMaxSize(node, spaceNeeded, deletionCandidates)
    deletionCandidates.sortBy { it.getSize() }
    return deletionCandidates.last()
}

val deleteFolder = findFolderToDelete(rootNode)
println("Delete folder ${deleteFolder.name} with size ${deleteFolder.getSize()}")