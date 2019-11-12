package com.grafka.entities

import org.apache.kafka.common.Node

class KafkaNode(val id: Int, val idString: String, val host: String, val port: Int, val rack: String) {
    companion object {
        fun create(n: Node) = KafkaNode(
                n.id(),
                n.idString(),
                n.host(),
                n.port(),
                n.rack()
        )

        fun create(list: List<Node>) = list.map { create(it) }
    }
}