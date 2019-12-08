package com.grafka.entities.connect

import com.grafka.services.KafkaConnectService

// ew on resolver! better way? Factory?
class KafkaConnect(config: KafkaConnectConfig, private val service: KafkaConnectService) {
    val connectId: String = config.connectId.toString()
    val name: String = config.name
    val config: String = config.config
    val plugins by lazy {service.getConnectorPlugins(connectId)}

    fun connectors(name:String? = null) = service.getConnectors(connectId, name)
}

