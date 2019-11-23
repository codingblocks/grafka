package com.grafka.configs

import com.grafka.repositories.KafkaClusterConfigRepository
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.serializers.KafkaAvroDeserializer
import org.apache.kafka.clients.admin.AdminClient
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.stereotype.Service
import java.io.StringReader
import java.util.*

@Service
class KafkaClientFactory(private val clusterRepository: KafkaClusterConfigRepository) {
    fun getAdminClient(clusterId: String): AdminClient {
        val p = getProperties(clusterId)
        return AdminClient.create(p)
    }

    fun getConsumer(clusterId: String, groupId: String? = null): KafkaConsumer<String, Any> {
        // TODO create these from config, can't assume avro!
        val keyDeserializer = StringDeserializer()
        val valueDeserializer = KafkaAvroDeserializer(getSchemaRegistryClient(clusterId))

        val p = getProperties(clusterId)
        groupId.let { p.setProperty("group.id", groupId) }

        return KafkaConsumer(p, keyDeserializer, valueDeserializer)
    }

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

    private fun getProperties(clusterId: String): Properties {
        val cluster = clusterRepository.findById(UUID.fromString(clusterId))
        val p = Properties()
        p.load(StringReader(cluster.get().config))
        return p
    }
}