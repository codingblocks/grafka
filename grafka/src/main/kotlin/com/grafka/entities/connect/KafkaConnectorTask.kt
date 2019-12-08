package com.grafka.entities.connect

import com.fasterxml.jackson.annotation.JsonProperty

class KafkaConnectorTask {
    var id: String? = null
    var state: String? = null
    @JsonProperty("worker_id")
    var workerId: String? = null
}