package love.yinlin.ylcs.utils

fun <E> MutableCollection<E>.clearAndAddAll(element: Collection<E>) {
    clear()
    addAll(element)
}

fun <K, V> MutableMap<K, V>.clearAndAddAll(element: Map<out K, V>) {
    clear()
    putAll(element)
}

fun <T> MutableList<T>.moveItem(fromIndex: Int, toIndex: Int) {
    if (fromIndex in 0..<this.size && toIndex in 0..< this.size) {
        val item = removeAt(fromIndex)
        add(toIndex, item)
    }
}
