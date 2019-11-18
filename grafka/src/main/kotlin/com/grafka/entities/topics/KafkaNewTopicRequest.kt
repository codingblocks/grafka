package com.grafka.entities.topics

import org.apache.kafka.clients.admin.NewTopic

class KafkaNewTopicRequest(
        val name: String,
        val partitionCount: Int? = null,
        val replicationFactor: Short? = null,
        val configs: List<KafkaTopicConfig>? = null,
        val replicationAssignments: List<KafkaReplicationAssignment>? = null
) {
    init {
        // TODO I dislike this, better to have multiple constructors or classes, but we're compromising for GraphQL...for now
        if (replicationAssignments == null) {
            require(partitionCount != null)
            require(replicationFactor != null)
        } else {
            require(partitionCount == null)
            require(replicationFactor == null)
        }
    }

    fun toNewTopic(): NewTopic {
        val newTopic = if (replicationAssignments.isNullOrEmpty()) {
            NewTopic(name, partitionCount!!, replicationFactor!!)
        } else {
            NewTopic(name, replicationAssignments.map { it.partition to it.assignments }.toMap())
        }
        if (!configs.isNullOrEmpty()) {
            newTopic.configs(configs.map { it.config to it.value }.toMap())
        }
        return newTopic
    }

    companion object {
        fun create(name: String, partitionCount: Int, replicationFactor: Short, configs: List<KafkaTopicConfig>? = null) = KafkaNewTopicRequest(
                name,
                partitionCount,
                replicationFactor,
                configs
        )

        fun create(name: String, replicationAssignments: List<KafkaReplicationAssignment>? = null, configs: List<KafkaTopicConfig>? = null) = KafkaNewTopicRequest(
                name,
                replicationAssignments = replicationAssignments,
                configs = configs
        )
    }
}