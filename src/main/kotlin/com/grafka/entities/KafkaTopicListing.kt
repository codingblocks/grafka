package com.grafka.entities

import com.grafka.resolvers.KafkaAdminResolver
import com.grafka.resolvers.SchemaRegistryResolver

class KafkaTopicListing(val clusterId: String, val name: String, val internal: Boolean, private val topicRepository: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) {
    // TODO ew!
    val description by lazy { topicRepository.kafkaTopicDescriptions(clusterId, name) }

    // TODO should the offsets filter by the topic if we have one?
    fun consumerGroups(partialConsumerGroupId: String? = null) = topicRepository
            .consumerGroupListings(clusterId)
            .filter { partialConsumerGroupId == null || it.groupId.contains(partialConsumerGroupId) }
            .filter { c -> c.offsets().filter { o -> o.topicName == name }.isNotEmpty() }

    val schema by lazy {
        schemaRegistryResolver
                .schemaRegistrySubjects(clusterId)
                .filter { it.subject == "${name}-value" }
                .firstOrNull()
    }
}