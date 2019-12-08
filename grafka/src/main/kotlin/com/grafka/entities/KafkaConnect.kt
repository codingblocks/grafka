package com.grafka.entities

import com.grafka.services.KafkaConnectService

// ew on resolver! better way? Factory?
class KafkaConnect(config: KafkaConnectConfig, service: KafkaConnectService) {
    val connectId: String = config.connectId.toString()
    val name: String = config.name
    val config: String = config.config

    // TODO connectors
    val connectors:String by lazy {service.getConnectors(connectId)}
}

