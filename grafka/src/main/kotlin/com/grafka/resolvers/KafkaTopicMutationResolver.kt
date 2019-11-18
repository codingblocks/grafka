package com.grafka.resolvers

import com.coxautodev.graphql.tools.GraphQLMutationResolver
import com.grafka.configs.AdminClientFactory
import com.grafka.entities.topics.KafkaNewTopicRequest
import com.grafka.entities.topics.KafkaReplicationAssignment
import com.grafka.entities.topics.KafkaTopicConfig
import org.springframework.stereotype.Component

@Component
class KafkaTopicMutationResolver(private val adminClientFactory: AdminClientFactory) : GraphQLMutationResolver {

    fun newTopicByPartitionAndReplicationFactor(clusterId: String, topicName: String, partitionCount: Int, replicationFactor: Short, configs: List<KafkaTopicConfig>?) = createTopic(
            clusterId,
            KafkaNewTopicRequest.create(topicName, partitionCount, replicationFactor, configs)
    )

    fun newTopicByReplicationAssignments(clusterId: String, topicName: String, replicationAssignments: List<KafkaReplicationAssignment>, configs: List<KafkaTopicConfig>?) = createTopic(
            clusterId,
            KafkaNewTopicRequest.create(topicName, replicationAssignments, configs)
    )

    private fun createTopic(clusterId: String, request: KafkaNewTopicRequest): Boolean {
        adminClientFactory
                .getAdminClient(clusterId)
                .createTopics(listOf(request.toNewTopic()))
                .all()
                .get()
        return true
    }

}