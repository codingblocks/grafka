package com.grafka.entities

import com.grafka.resolvers.KafkaAdminResolver
import com.grafka.resolvers.SchemaRegistryResolver

class KafkaTopicListing(val clusterId: String, val name: String, val internal: Boolean, private val admin: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) {
    // TODO ew!
    val description by lazy { admin.kafkaTopicDescriptions(clusterId, name) }

    val configs by lazy { admin.topicConfigs(clusterId, listOf(name))[0] }

    // TODO should the offsets filter by the topic if we have one?
    fun consumerGroups(partialConsumerGroupId: String? = null) = admin
            .consumerGroupListings(clusterId)
            .filter { partialConsumerGroupId == null || it.groupId.contains(partialConsumerGroupId) }
            .filter { c -> c.offsets().any { o -> o.topicName == name } }

    val schema by lazy {
        schemaRegistryResolver
                .schemaRegistrySubjects(clusterId)
                .firstOrNull { it.subject == "${name}-value" }
    }
}