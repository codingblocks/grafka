package com.grafka.resolvers

import com.grafka.configs.AdminClientFactory
import com.grafka.entities.*
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import org.apache.kafka.clients.admin.*
import org.apache.kafka.common.config.ConfigResource
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
            .filter { partialConsumerGroupId == null || it.groupId().contains(partialConsumerGroupId) }
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

    fun describeCluster(clusterId: String) = KafkaClusterDescription(
            getAdminClient(clusterId).describeCluster()
        )

    fun topicConfigs(clusterId: String, topicNames: List<String>) = configs(
            clusterId,
            ConfigResource.Type.TOPIC,
            topicNames
    )

    // TODO not hooked up to graphql? what's the "broker"?
    fun brokerConfigs(clusterId: String, broker: List<String>) = configs(
            clusterId,
            ConfigResource.Type.BROKER,
            broker
    )

    // TODO not hooked up to graphql? what's this mean?
    fun unknownConfigs(clusterId: String, resourceName: List<String>) = configs(
            clusterId,
            ConfigResource.Type.UNKNOWN,
            resourceName
    )

    private fun configs(clusterId: String, type: ConfigResource.Type, items: List<String>) = getAdminClient(clusterId)
            .describeConfigs(
                    items.map {
                        ConfigResource(type, it)
                    }
            )
            .all()
            .get()
            .map{
                KafkaConfigCollection(it.key, it.value)
            }

}









