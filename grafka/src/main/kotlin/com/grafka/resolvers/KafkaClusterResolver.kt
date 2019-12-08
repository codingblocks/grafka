package com.grafka.resolvers

import com.coxautodev.graphql.tools.GraphQLMutationResolver
import com.grafka.entities.KafkaCluster
import com.grafka.repositories.KafkaClusterConfigRepository
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.grafka.entities.KafkaClusterConfig
import org.springframework.stereotype.Component
import java.util.*

@Component
class KafkaClusterResolver(private val repository: KafkaClusterConfigRepository, private val topicRepository: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) : GraphQLQueryResolver, GraphQLMutationResolver {

    fun clusters(clusterId: String?):List<KafkaCluster> {
        return (if(clusterId != null)
            listOf(repository.findById(UUID.fromString(clusterId)).get())
        else
            repository.findAll()
        ).map { KafkaCluster(it, topicRepository, schemaRegistryResolver) }
    }

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