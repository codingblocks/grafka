package com.grafka.entities

import org.apache.kafka.clients.admin.ConfigEntry

class KafkaConfigEntry(private val configEntry: ConfigEntry) {
    val default = configEntry.isDefault
    val readOnly = configEntry.isReadOnly
    val sensitive = configEntry.isSensitive
    val name = configEntry.name()
    val source = configEntry.source().toString()
    val synonyms = configEntry.synonyms().map{KafkaConfigSynonym(it)}
    val value = configEntry.value()
}