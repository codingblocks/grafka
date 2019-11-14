package com.grafka.entities.topics;

import com.grafka.entities.KafkaAclOperation
import org.apache.kafka.clients.admin.TopicDescription

// TODO val authorizedOperations: ImmutableSet<AuthorizedOperations>
class KafkaTopicDescription(val name: String, val internal: Boolean, val partitions: List<KafkaTopicPartitionInfo>, val authorizedOperations:Collection<KafkaAclOperation>) {
    companion object {
        fun create(it: TopicDescription) = KafkaTopicDescription(
                it.name(),
                it.isInternal,
                KafkaTopicPartitionInfo.create(it.partitions()),
                it.authorizedOperations().map { acl -> KafkaAclOperation(acl) }
        )
    }
}