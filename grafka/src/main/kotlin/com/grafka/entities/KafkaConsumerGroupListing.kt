package com.grafka.entities

import com.grafka.resolvers.KafkaAdminResolver

class KafkaConsumerGroupListing(val clusterId: String, val groupId: String, val simpleConsumerGroup: Boolean, private val kafkaAdminResolver: KafkaAdminResolver) {
    fun offsets() = kafkaAdminResolver.consumerGroupOffsets(clusterId, groupId)
}