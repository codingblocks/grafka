package com.grafka.resolvers

import com.grafka.configs.AdminClientFactory
import com.grafka.entities.*
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.grafka.entities.topics.KafkaTopicDescription
import com.grafka.entities.topics.KafkaTopicListing
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
            .map { KafkaTopicListing(clusterId, it.name(), it.isInternal, this) }

    fun kafkaTopicDescriptions(clusterId: String, topic: String) = KafkaTopicDescription.create(
            getAdminClient(clusterId)
                    .describeTopics(listOf(topic), DescribeTopicsOptions().apply {
                        includeAuthorizedOperations(true)
                    })
                    .values()
                    .get(topic)!!
                    .get()
    )

    fun consumerGroupListings(clusterId: String, partialConsumerGroupId: String? = null, topicName: String? = null): List<KafkaConsumerGroupListing> {
        var groups = getAdminClient(clusterId)
                .listConsumerGroups()
                .all()
                .get()

        if (partialConsumerGroupId != null) {
            groups = groups.filter { it.groupId().contains(partialConsumerGroupId) }
        }

        var result = groups
                .map { KafkaConsumerGroupListing(clusterId, it.groupId(), it.isSimpleConsumerGroup(), this) }

        if (topicName != null) {
            result = result.filter { it.offsets().any { o -> o.topicName == topicName } }
        }

        return result
    }

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

    fun topicConfigs(clusterId: String, topicNames: List<String>) = clusterConfigs(
            clusterId,
            ConfigResource.Type.TOPIC,
            topicNames
    )

    // TODO not hooked up to graphql? what's the "broker"?
    fun brokerConfigs(clusterId: String, broker: List<String>) = clusterConfigs(
            clusterId,
            ConfigResource.Type.BROKER,
            broker
    )

    // TODO not hooked up to graphql? what's this mean?
    fun unknownConfigs(clusterId: String, resourceName: List<String>) = clusterConfigs(
            clusterId,
            ConfigResource.Type.UNKNOWN,
            resourceName
    )

    private fun clusterConfigs(clusterId: String, type: ConfigResource.Type, items: List<String>) = getAdminClient(clusterId)
            .describeConfigs(
                    items.map {
                        ConfigResource(type, it)
                    }
            )
            .all()
            .get()
            .map {
                KafkaConfigCollection(it.key, it.value)
            }

    // TODO these are internals...probably shouldn't be here
    internal fun clusterDescription(clusterId: String, name: String) = kafkaTopicDescriptions(clusterId, name)
    internal fun clusterConfigs(clusterId: String, name: String) = topicConfigs(clusterId, listOf(name))[0]
    internal fun clusterSchema(clusterId: String, name: String) = schemaRegistryResolver.schemaRegistrySubject(clusterId, name)
    internal fun clusterConsumerGroups(clusterId: String, name: String, partialConsumerGroupId: String? = null) = consumerGroupListings(clusterId, partialConsumerGroupId, name)
}









