package com.grafka.entities.connect

import java.util.*
import javax.persistence.*

@Entity
@Table(name = "connect_config")
class KafkaConnectConfig(
        @Id
        @org.hibernate.annotations.Type(type = "org.hibernate.type.PostgresUUIDType")
        @Column(name = "connect_id", nullable = false)
        var connectId: UUID = UUID(0, 0),

        @Column(name = "name", nullable = false)
        var name: String = "",

        @Column(name = "config", length = 4096, nullable = false)
        var config: String = ""
)