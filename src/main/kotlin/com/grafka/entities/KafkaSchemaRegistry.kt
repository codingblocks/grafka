package com.grafka.entities

import com.grafka.resolvers.SchemaRegistryResolver

data class KafkaSchemaRegistry(val clusterId: String,  val resolver: SchemaRegistryResolver) {
    val mode by lazy {resolver.schemaRegistryMode(clusterId)}
    val subjects by lazy {resolver.schemaRegistrySubjects(clusterId).toList()}
}