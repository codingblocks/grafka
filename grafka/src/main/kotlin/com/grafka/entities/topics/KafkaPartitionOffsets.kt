package com.grafka.entities.topics

class KafkaPartitionOffsets(val partition: Int, val beginningOffset: Long, val endOffset: Long) {
    val offsetCount = endOffset - beginningOffset
}