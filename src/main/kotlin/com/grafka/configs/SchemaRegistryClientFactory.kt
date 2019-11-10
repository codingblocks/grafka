package com.grafka.configs

import com.grafka.repositories.KafkaClusterConfigRepository
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import org.springframework.stereotype.Service
import java.io.StringReader
import java.util.*

@Service
class SchemaRegistryClientFactory(private val clusterRepository: KafkaClusterConfigRepository) {
    fun getSchemaRegistryClient(clusterId: String): SchemaRegistryClient {
        val cluster = clusterRepository.findById(UUID.fromString(clusterId))
        val p = Properties()
        p.load(StringReader(cluster.get().config))

        val map = p
                .map { it.key.toString() to it.value }
                .toMap()
        val mapCapacity = 1024 // TODO what is this!?
        return CachedSchemaRegistryClient(
                map["schema.registry.url"].toString(), mapCapacity, map
        )
    }
}