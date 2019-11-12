package com.grafka.entities

import org.apache.kafka.common.TopicPartitionInfo

class KafkaTopicPartitionInfo(val partition: Int, val leader: KafkaNode, val replicas: List<KafkaNode>, val isr: List<KafkaNode>) {
    companion object {
        fun create(it: TopicPartitionInfo) = KafkaTopicPartitionInfo(
                it.partition(),
                KafkaNode.create(it.leader()),
                KafkaNode.create(it.replicas()),
                KafkaNode.create(it.isr())
        )

        fun create(list: List<TopicPartitionInfo>) = list.map { create(it) }
    }
}