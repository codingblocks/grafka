package com.grafka.entities

import org.apache.kafka.common.config.ConfigResource

class KafkaConfigResource(private val resource: ConfigResource) {
    val name = resource.name()
    val default = resource.isDefault
    val type = resource.type().name
}
