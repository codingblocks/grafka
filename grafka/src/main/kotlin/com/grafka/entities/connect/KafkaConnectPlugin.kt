package com.grafka.entities.connect

import com.fasterxml.jackson.annotation.JsonProperty

class KafkaConnectPlugin {
    @JsonProperty("class")
    var className: String? = null
    var type: String? = null
    var version: String? = null
}