package com.grafka.entities

import io.confluent.kafka.schemaregistry.client.SchemaMetadata

class KafkaSchemaRegistrySubjectMetadata(val id: Int, val version:Int, val schema: String) {
    companion object {
        fun create(metadata: SchemaMetadata?) = if(metadata != null) KafkaSchemaRegistrySubjectMetadata(metadata.id, metadata.version, metadata.schema) else null
    }
}