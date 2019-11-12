package com.grafka.entities

data class KafkaOffset(val partition: Int, val topicName: String, val leaderEpoch: Int?, val metadata: String, val offset: Long)