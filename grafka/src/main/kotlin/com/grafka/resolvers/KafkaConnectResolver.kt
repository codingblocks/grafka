package com.grafka.resolvers

import com.coxautodev.graphql.tools.GraphQLMutationResolver
import com.coxautodev.graphql.tools.GraphQLQueryResolver
import com.grafka.entities.KafkaConnect
import com.grafka.entities.KafkaConnectConfig
import com.grafka.repositories.KafkaConnectConfigRepository
import org.springframework.stereotype.Component
import java.util.*

@Component
class KafkaConnectResolver(private val repository: KafkaConnectConfigRepository) : GraphQLQueryResolver, GraphQLMutationResolver {
    fun connect(connectId: String?) = connectClusterConfigs(connectId).map { KafkaConnect(it) }
    fun connectClusterConfigs(connectId: String?) = if (connectId != null) {
        listOf(repository.findById(UUID.fromString(connectId)).get())
    } else {
        repository.findAll()
    }

    fun newConnect(name: String, config: String): KafkaConnect {
        val item = KafkaConnectConfig(UUID.randomUUID(), name, config)
        repository.save(item)
        return KafkaConnect(item)
    }

    fun deleteConnect(connectId: String): Boolean {
        repository.deleteById(UUID.fromString(connectId))
        return true
    }

    fun updateConnect(connectId: String, name: String, config: String): KafkaConnect {
        val item = repository.findById(UUID.fromString(connectId))
        item.ifPresent {
            it.name = name
            it.config = config
            repository.save(it)
        }
        return KafkaConnect(item.get())
    }
}