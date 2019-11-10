package com.grafka.entities

import org.apache.kafka.clients.admin.DescribeClusterResult

class KafkaClusterDescription(private val description: DescribeClusterResult) {
    val nodes by lazy { KafkaNode.create(description.nodes().get().toList()) }
    val controller by lazy { KafkaNode.create(description.controller().get()) }
    val authorizedOperations by lazy { description.authorizedOperations().get().map { KafkaAclOperation(it) } }
}

