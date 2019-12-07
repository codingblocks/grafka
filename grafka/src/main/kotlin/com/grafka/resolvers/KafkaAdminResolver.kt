package com.grafka.resolvers

import com.grafka.configs.KafkaClientFactory
import com.grafka.entities.*
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.grafka.entities.topics.KafkaPartitionOffsets
import com.grafka.entities.topics.KafkaTopicDescription
import com.grafka.entities.topics.KafkaTopicListing
import com.grafka.entities.topics.KafkaTopicOffsets
import org.apache.kafka.clients.admin.*
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.config.ConfigResource
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.*

// This is a very humble object...
@Component
class KafkaAdminResolver(private val kafkaClientFactory: KafkaClientFactory, private val schemaRegistryResolver: SchemaRegistryResolver) : GraphQLQueryResolver {

    private val log = LoggerFactory.getLogger(javaClass)

    private val adminClients = hashMapOf<String, AdminClient>()
    private fun getAdminClient(clusterId: String) = adminClients.getOrPut(clusterId, { kafkaClientFactory.getAdminClient(clusterId) })

    fun topicPartitionMetadata(clusterId: String, topicName: String): KafkaTopicOffsets {
        val groupId = "_grafka-temp-consumer-${Instant.now().toEpochMilli()}"
        val consumer = kafkaClientFactory.getConsumer(clusterId, groupId)

        try {
            consumer.subscribe(listOf(topicName))

            val topics = consumer.listTopics()
            consumer.unsubscribe() // can't assign unless you unsub

            val partitions = topics[topicName]!!.map { t -> TopicPartition(t.topic(), t.partition()) }

            consumer.assign(partitions) // can't seek unless your assigned

            consumer.seekToBeginning(partitions)
            val offsets = partitions.map { p ->
                consumer.seekToBeginning(listOf(p))
                val beginning = consumer.position(p)
                consumer.seekToEnd(listOf(p))
                val end = consumer.position(p)
                KafkaPartitionOffsets(p.partition(), beginning, end)
            }
            return KafkaTopicOffsets(offsets)
        } finally {
            consumer.unsubscribe()
            consumer.close()
            getAdminClient(clusterId).deleteConsumerGroups(listOf(groupId))
        }
    }

    fun topicListings(clusterId: String, partialTopicName: String? = null) = try {
        getAdminClient(clusterId)
                .listTopics(ListTopicsOptions().apply {
                    listInternal(true)
                })
                .listings()
                .get()
                .filter { partialTopicName == null || it.name().contains(partialTopicName) }
                .map { KafkaTopicListing(clusterId, it.name(), it.isInternal, this) }
    } catch(e:Exception) {
        log.error("Error fetching topic listings, we should really tell the client!")
        log.error(e.toString())
        Collections.emptyList<KafkaTopicListing>()
    }

    fun kafkaTopicDescriptions(clusterId: String, topic: String) = KafkaTopicDescription.create(
            getAdminClient(clusterId)
                    .describeTopics(listOf(topic), DescribeTopicsOptions().apply {
                        includeAuthorizedOperations(true)
                    })
                    .values()
                    .get(topic)!!
                    .get()
    )

    fun consumerGroupListings(clusterId: String, partialConsumerGroupId: String? = null, topicName: String? = null): List<KafkaConsumerGroupListing> = try {
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

        result
    } catch(e:Exception) {
        log.error("Error fetching consumer groups, we should really tell the client!")
        log.error(e.toString())
        Collections.emptyList()
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

    fun describeCluster(clusterId: String) = try {
        KafkaClusterDescription(
                getAdminClient(clusterId).describeCluster()
        )
    } catch(e:Exception) {
        log.error("Error describing cluster, probably config related. We should really tell the UI about this...")
        log.error(e.toString())
        null
    }

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









