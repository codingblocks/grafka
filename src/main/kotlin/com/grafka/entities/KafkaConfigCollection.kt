package com.grafka.entities

import org.apache.kafka.clients.admin.Config
import org.apache.kafka.common.config.ConfigResource

class KafkaConfigCollection(resource: ConfigResource, config: Config) {
    val resource = KafkaConfigResource(resource)
    val config = config.entries().map { KafkaConfigEntry(it) }
}