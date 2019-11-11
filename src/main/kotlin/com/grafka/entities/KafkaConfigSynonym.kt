package com.grafka.entities

import org.apache.kafka.clients.admin.ConfigEntry

class KafkaConfigSynonym(synonym: ConfigEntry.ConfigSynonym) {
    val name = synonym.name()!!
    val value = synonym.value()!!
    val source = synonym.source().toString()
}