package com.grafka.resolvers

import KafkaSchemaRegistrySubject
import com.grafka.entities.KafkaSchemaRegistry
import com.grafka.entities.KafkaSchemaRegistrySubjectMetadata
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.grafka.configs.KafkaClientFactory
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import org.springframework.stereotype.Component

@Component
class SchemaRegistryResolver(private val clientFactory: KafkaClientFactory) : GraphQLQueryResolver {
    private val clients = hashMapOf<String, SchemaRegistryClient>()
    private fun getClient(clusterId: String) = clients.getOrPut(clusterId, { clientFactory.getSchemaRegistryClient(clusterId) })

    fun schemaRegistry(clusterId: String) = KafkaSchemaRegistry(clusterId, this)
    fun schemaRegistryMode(clusterId: String) = getClient(clusterId).getMode()
    fun schemaCompatibilityMode(clusterId: String, subject: String) = getClient(clusterId).getCompatibility(subject)
    fun schemaRegistrySubjects(clusterId: String) = getClient(clusterId).allSubjects.map { KafkaSchemaRegistrySubject(clusterId, it, this) }
    fun schemaRegistrySubject(clusterId: String, topicName: String?) = schemaRegistrySubjects(clusterId).firstOrNull { topicName == null || it.subject == "${topicName}-value" }
    fun schemaMetadata(clusterId: String, subject: String) = KafkaSchemaRegistrySubjectMetadata.create(getClient(clusterId).getLatestSchemaMetadata(subject))
}
