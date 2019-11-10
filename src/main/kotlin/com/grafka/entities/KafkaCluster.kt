package com.grafka.entities

import com.grafka.resolvers.KafkaAdminResolver
import com.grafka.resolvers.SchemaRegistryResolver

class KafkaCluster(clusterConfig: KafkaClusterConfig, private val admin: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) {
    val clusterId: String = clusterConfig.clusterId.toString()
    val name: String = clusterConfig.name
    val config: String = clusterConfig.config

    fun topicListings(partialTopicName: String? = null) = admin.topicListings(clusterId, partialTopicName)
    fun consumerGroupListings(partialConsumerGroupId: String? = null) = admin.consumerGroupListings(clusterId, partialConsumerGroupId)

    val totalTopicCount by lazy { topicListings(null).count() }
    val internalTopicCount by lazy { topicListings(null).filter { it.internal }.count() }
    val consumerGroupCount by lazy { consumerGroupListings().count() }
    val schemaRegistry by lazy { schemaRegistryResolver.schemaRegistry(clusterId) }
    val description by lazy { admin.describe(clusterId) }
}

