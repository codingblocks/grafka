package com.grafka.entities

class KafkaConnect(config: KafkaConnectConfig) {
    val connectId: String = config.connectId.toString()
    val name: String = config.name
    val config: String = config.config

    // TODO connectors
}

