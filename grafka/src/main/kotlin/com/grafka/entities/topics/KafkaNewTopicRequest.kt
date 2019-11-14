package com.grafka.entities.topics

import org.apache.kafka.clients.admin.NewTopic

class KafkaNewTopicRequest(
        val name: String,
        val partitionCount: Int,
        val replicationFactor: Short,
        val configs: List<KafkaTopicConfig>?,
        val replicationAssignments: List<KafkaReplicationAssignment>?
) {
    fun toNewTopic(): NewTopic {
        val newTopic = if(replicationAssignments.isNullOrEmpty()) {
            NewTopic(name, partitionCount, replicationFactor)
        } else {
            NewTopic(name, replicationAssignments.map{ it.partition to it.assignments}.toMap())
        }
        if(!configs.isNullOrEmpty()) {
            newTopic.configs(configs.map { it.name to it.value }.toMap())
        }
        return newTopic
    }
}