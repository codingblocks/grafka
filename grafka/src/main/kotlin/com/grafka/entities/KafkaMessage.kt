package com.grafka.entities

class KafkaMessage(
        val topic: String,
        val key: String,
        val value: String,
        val partition: Int,
        val offset: Long,
        val timestampType: String,
        val timestamp: Long,
        val leaderEpoch: Int?
)