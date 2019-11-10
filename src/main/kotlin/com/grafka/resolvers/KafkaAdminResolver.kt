package com.grafka.resolvers

import com.grafka.configs.AdminClientFactory
import com.grafka.entities.*
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import org.apache.kafka.clients.admin.*
import org.springframework.stereotype.Component

@Component
class KafkaAdminResolver(private val adminClientFactory: AdminClientFactory, private val schemaRegistryResolver: SchemaRegistryResolver) : GraphQLQueryResolver {

    private val adminClients = hashMapOf<String, AdminClient>()
    private fun getAdminClient(clusterId: String) = adminClients.getOrPut(clusterId, { adminClientFactory.getAdminClient(clusterId) })

    fun topicListings(clusterId: String, partialTopicName: String? = null) = getAdminClient(clusterId)
            .listTopics(ListTopicsOptions().apply {
                listInternal(true)
            })
            .listings()
            .get()
            .filter { partialTopicName == null || it.name().contains(partialTopicName) }
            .map { KafkaTopicListing(clusterId, it.name(), it.isInternal, this, schemaRegistryResolver) }

    fun kafkaTopicDescriptions(clusterId: String, topic: String) = KafkaTopicDescription.create(
            getAdminClient(clusterId)
                    .describeTopics(listOf(topic), DescribeTopicsOptions().apply {
                        includeAuthorizedOperations(true)
                    })
                    .values()
                    .get(topic)!!
                    .get()
    )

    fun consumerGroupListings(clusterId: String, partialConsumerGroupId: String? = null) = getAdminClient(clusterId)
            .listConsumerGroups()
            .all()
            .get()
            .filter{partialConsumerGroupId == null || it.groupId().contains(partialConsumerGroupId)}
            .map { KafkaConsumerGroupListing(clusterId, it.groupId(), it.isSimpleConsumerGroup(), this) }

    fun consumerGroupOffsets(clusterId: String, groupId: String) = getAdminClient(clusterId)
            .listConsumerGroupOffsets(groupId)
            .partitionsToOffsetAndMetadata()
            .get()
            .map {
                KafkaOffset(
                        it.key.partition(),
                        it.key.topic(),
                        it.value.leaderEpoch().orElse(null),
                        it.value.metadata(),
                        it.value.offset()
                )
            }

    fun describe(clusterId: String) = KafkaClusterDescription(getAdminClient(clusterId)
            .describeCluster())
}