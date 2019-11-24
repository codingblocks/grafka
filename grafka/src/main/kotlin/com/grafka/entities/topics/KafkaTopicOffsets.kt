package com.grafka.entities.topics

class KafkaTopicOffsets(val partitionOffsets: List<KafkaPartitionOffsets>) {
    val offsetCount by lazy {partitionOffsets.fold(0L) {sum, p -> sum + p.offsetCount}}
    val lifetimeOffsetCount by lazy {partitionOffsets.fold(0L) {sum, p -> sum + p.endOffset}}
    val partitionCount by lazy {partitionOffsets.size}
    val maxOffset by lazy { partitionOffsets.maxBy { it.endOffset }?.endOffset ?: 0}
    val minOffset by lazy { partitionOffsets.minBy { it.beginningOffset }?.beginningOffset ?: 0}
}