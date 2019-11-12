package com.grafka.resolvers

import com.grafka.entities.KafkaCluster
import com.grafka.entities.KafkaClusterConfig
import com.grafka.repositories.KafkaClusterConfigRepository
import com.coxautodev.graphql.tools.GraphQLMutationResolver
import org.springframework.stereotype.Component
import java.util.*

@Component
class KafkaClusterMutationResolver(private val repository: KafkaClusterConfigRepository, private val topicRepository: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) : GraphQLMutationResolver {

    fun newCluster(name: String, config: String): KafkaCluster {
        val item = KafkaClusterConfig(UUID.randomUUID(), name, config)
        repository.save(item)
        return KafkaCluster(item, topicRepository, schemaRegistryResolver)
    }

    fun deleteCluster(clusterId: String): Boolean {
        repository.deleteById(UUID.fromString(clusterId))
        return true
    }

    fun updateCluster(clusterId: String, name: String, config: String): KafkaCluster {
        val item = repository.findById(UUID.fromString(clusterId))
        item.ifPresent {
            it.name = name
            it.config = config
            repository.save(it)
        }
        return KafkaCluster(item.get(), topicRepository, schemaRegistryResolver)
    }
}