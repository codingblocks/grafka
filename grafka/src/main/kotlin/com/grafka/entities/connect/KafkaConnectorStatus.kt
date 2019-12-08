package com.grafka.entities.connect

import com.grafka.services.KafkaConnectService

class KafkaConnectorStatus {
    var name: String? = null
    var connector: KafkaConnectorStatusConnector?  = null
    var tasks: List<KafkaConnectorTask>? = null
    var type: String? = null
}