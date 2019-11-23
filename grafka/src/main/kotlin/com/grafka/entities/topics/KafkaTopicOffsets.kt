package com.grafka.entities.topics

class KafkaTopicOffsets(val partitionOffsets: List<KafkaPartitionOffsets>) {
    val offsetCount = partitionOffsets.fold(0L) {sum, p -> sum + p.offsetCount}
}