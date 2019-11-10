package com.grafka.resolvers

import com.grafka.entities.KafkaCluster
import com.grafka.repositories.KafkaClusterConfigRepository
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import org.springframework.stereotype.Component
import java.util.*

@Component
class KafkaClusterQueryResolver(private val repository: KafkaClusterConfigRepository, private val topicRepository: KafkaAdminResolver, private val schemaRegistryResolver: SchemaRegistryResolver) : GraphQLQueryResolver {
    fun clusters(clusterId: String?):List<KafkaCluster> {
        return (if(clusterId != null)
            listOf(repository.findById(UUID.fromString(clusterId)).get())
        else
            repository.findAll()
        ).map { KafkaCluster(it, topicRepository, schemaRegistryResolver) }
    }
}