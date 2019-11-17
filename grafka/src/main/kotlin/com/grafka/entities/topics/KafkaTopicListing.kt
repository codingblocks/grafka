package com.grafka.entities.topics

import com.grafka.resolvers.KafkaAdminResolver

class KafkaTopicListing(val clusterId: String, val name: String, val internal: Boolean, private val resolver: KafkaAdminResolver) {
    val description by lazy { resolver.clusterDescription(clusterId, name) }
    val configs by lazy { resolver.clusterConfigs(clusterId, name) }
    val schema by lazy { resolver.clusterSchema(clusterId, name) }
    fun consumerGroups(partialConsumerGroupId: String? = null) = resolver.clusterConsumerGroups(clusterId, name, partialConsumerGroupId)
}