package com.grafka.entities.connect

import com.fasterxml.jackson.annotation.JsonProperty

class KafkaConnectorStatusConnector {
    var state: String? = null
    @JsonProperty("worker_id")
    var workerId: String? = null
}