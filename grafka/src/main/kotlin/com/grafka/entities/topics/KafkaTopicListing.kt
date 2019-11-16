package com.grafka.entities.topics

import com.grafka.resolvers.KafkaAdminResolver

class KafkaTopicListing(val clusterId: String, val name: String, val internal: Boolean, private val resolver: KafkaAdminResolver) {
    val description by lazy { resolver.description(clusterId, name) }
    val configs by lazy { resolver.configs(clusterId, name) }
    val schema by lazy { resolver.schema(clusterId, name) }
    fun consumerGroups(partialConsumerGroupId: String? = null) = resolver.consumerGroups(clusterId, name, partialConsumerGroupId)
}