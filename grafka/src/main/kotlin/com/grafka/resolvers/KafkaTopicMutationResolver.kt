package com.grafka.resolvers

import com.coxautodev.graphql.tools.GraphQLMutationResolver
import com.grafka.configs.AdminClientFactory
import com.grafka.entities.topics.KafkaNewTopicRequest
import org.springframework.stereotype.Component

@Component
class KafkaTopicMutationResolver(private val adminClientFactory: AdminClientFactory) : GraphQLMutationResolver {

    fun newTopic(clusterId: String, request: KafkaNewTopicRequest) {
        val topic = request.toNewTopic()

        adminClientFactory
                .getAdminClient(clusterId)
                .createTopics(listOf(topic))
    }

}