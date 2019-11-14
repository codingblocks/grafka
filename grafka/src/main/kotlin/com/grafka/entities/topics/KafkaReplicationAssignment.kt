package com.grafka.entities.topics

data class KafkaReplicationAssignment(val partition: Int, val assignments: List<Int>)